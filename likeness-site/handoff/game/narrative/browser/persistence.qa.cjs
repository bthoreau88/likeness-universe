/* eslint-disable @typescript-eslint/no-require-imports -- standalone QA script run with the preinstalled Playwright (CommonJS) */
// Real-browser persistence qualification for the narrative reference engine.
// Usage: QA_BASE=http://localhost:8790 QA_OUT=<dir> node persistence.qa.cjs
// (QA_BASE serves handoff/game/narrative/ at its root.)
const { chromium } = require("playwright");
const fs = require("fs");
const BASE = process.env.QA_BASE;
const OUT = process.env.QA_OUT;
const URL = (p = "qa") => `${BASE}/browser/harness.html?profile=${p}`;
const results = [];
const check = (name, pass, detail) => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name}`); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const open = async (p) => { const pg = await ctx.newPage(); await pg.goto(URL(p)); await pg.waitForFunction(() => document.title === "ready"); return pg; };
  const meta = { browser: `chromium ${b.version()}`, startedAt: new Date().toISOString() };

  // 1. Reload and restoration
  {
    const p = await open("reload");
    const saved = await p.evaluate(async () => {
      const s = H.play("T03_01", "r1", ["D20", "D40", "D40-ledger"]);
      await H.store.saveRun("slot1", s, null, H.graphs.T03_01);
      return { sum: H.E.checksum(s), rev: s.revision };
    });
    await p.reload(); await p.waitForFunction(() => document.title === "ready");
    const after = await p.evaluate(() => {
      const r = H.store.loadRun("slot1", H.graphs.T03_01);
      const cont = H.E.decide(H.graphs.T03_01, r.run, { decisionId: "r1#3", to: "D40-bell" });
      const fin = H.E.decide(H.graphs.T03_01, cont, { decisionId: "r1#4", to: "D50" });
      return { sum: H.E.checksum(r.run), rev: r.run.revision, ended: fin.ended };
    });
    check("reload restores the exact run state and play continues", saved.sum === after.sum && after.ended === "D60", { saved, after });
    await p.close();
  }

  // 2. Separate playthroughs and discovery histories
  {
    const p = await open("separate");
    const r = await p.evaluate(async () => {
      const a = H.play("T03_01", "runA", ["D10", "D40", "D40-ledger", "D40-bell", "D50"]);
      const c = H.play("T03_01", "runB", ["D30", "D40", "D50"]);
      await H.store.saveRun("A", a, null, H.graphs.T03_01);
      await H.store.saveRun("B", c, null, H.graphs.T03_01);
      let d = H.store.loadDiscovery();
      d = H.E.recordDiscovery(d, a); await H.store.saveDiscovery(d);
      d = H.E.recordDiscovery(H.store.loadDiscovery(), c); await H.store.saveDiscovery(d);
      const la = H.store.loadRun("A", H.graphs.T03_01).run, lb = H.store.loadRun("B", H.graphs.T03_01).run;
      return { aEnd: la.ended, bEnd: lb.ended, aTrust: la.vars.DRYA_TRUST, bTrust: lb.vars.DRYA_TRUST, bTruthFlag: lb.flags.told_clerk_truth ?? null, outcomes: H.store.loadDiscovery().chapters.T03_01.outcomes };
    });
    check("separate playthroughs keep independent run state; discovery spans both", r.aEnd === "D60" && r.bEnd === "D70" && r.aTrust === 54 && r.bTrust === 56 && r.bTruthFlag === null && r.outcomes.join() === "D60,D70", r);
    await p.close();
  }

  // 3. Multi-tab: stale tab cannot silently overwrite; discovery merges
  {
    const t1 = await open("tabs"), t2 = await open("tabs");
    await t1.evaluate(async () => { const s = H.play("T03_01", "mt", ["D10"]); await H.store.saveRun("s", s, null, H.graphs.T03_01); });
    const rev = await t2.evaluate(() => H.store.loadRun("s", H.graphs.T03_01).run.revision);
    await t1.evaluate(async () => {
      const cur = H.store.loadRun("s", H.graphs.T03_01).run;
      const next = H.E.decide(H.graphs.T03_01, cur, { decisionId: "mt#1", to: "D40" });
      await H.store.saveRun("s", next, cur.revision, H.graphs.T03_01);
    });
    await t2.waitForTimeout(300);
    const r2 = await t2.evaluate(async (rev) => {
      const stale = H.store.loadRun("s", H.graphs.T03_01).run; // reload shows tab 1's newer state...
      const mine = H.play("T03_01", "mt", ["D10"]); // ...but tab 2 continues from its own old copy
      const next = H.E.decide(H.graphs.T03_01, mine, { decisionId: "mt#1-tab2", to: "D40" });
      let err = null;
      try { await H.store.saveRun("s", next, rev, H.graphs.T03_01); } catch (e) { err = e.code; }
      const after = H.store.loadRun("s", H.graphs.T03_01).run;
      return { err, storedDecisions: after.decisions, sawExternal: H.external.map((e) => e.kind), staleRev: stale.revision };
    }, rev);
    check("stale tab gets E_CONFLICT; newer progress is preserved; other tab is notified", r2.err === "E_CONFLICT" && r2.storedDecisions.join() === "mt#0,mt#1" && r2.sawExternal.includes("run"), r2);
    await t1.evaluate(async () => { const d = H.E.recordDiscovery(H.store.loadDiscovery(), H.play("T03_01", "x1", ["D10", "D40", "D40-ledger", "D40-bell", "D50"])); await H.store.saveDiscovery(d); });
    const tab2Old = await t2.evaluate(() => H.E.newDiscovery("tabs"));
    const merged = await t2.evaluate(async (old) => { const d = H.E.recordDiscovery(old, H.play("T03_01", "x2", ["D30", "D40", "D50"])); return (await H.store.saveDiscovery(d)).chapters.T03_01.outcomes; }, tab2Old);
    check("concurrent discovery writes from two tabs merge without loss", merged.join() === "D60,D70", { merged });
    await t1.close(); await t2.close();
  }

  // 4. Malformed and incompatible saves
  {
    const p = await open("bad");
    const r = await p.evaluate(() => {
      const out = {};
      localStorage.setItem("likeness.run.v2:bad:junk", "{truncated");
      out.junk = H.store.loadRun("junk", H.graphs.T03_01);
      out.junkStillThere = localStorage.getItem("likeness.run.v2:bad:junk") === "{truncated";
      out.quarantined = !!localStorage.getItem(out.junk.quarantinedAs);
      const s = H.play("T03_01", "f", ["D10"]);
      const env = JSON.parse(H.E.serialize({ run: s, discovery: null }));
      localStorage.setItem("likeness.run.v2:bad:future", JSON.stringify({ ...env, schemaVersion: 99 }));
      out.future = H.store.loadRun("future", H.graphs.T03_01).error;
      localStorage.setItem("likeness.run.v2:bad:edited", JSON.stringify({ ...env, run: { ...env.run, vars: { ...env.run.vars, DRYA_TRUST: 100 } } }));
      out.edited = H.store.loadRun("edited", H.graphs.T03_01).error;
      localStorage.setItem("likeness.run.v2:bad:otherchapter", H.E.serialize({ run: s, discovery: null }));
      out.otherChapter = H.store.loadRun("otherchapter", H.graphs.T03_05).error;
      return out;
    });
    check("malformed save is reported, quarantined, and not deleted", r.junk.error === "E_SAVE_JSON" && r.junkStillThere && r.quarantined, r.junk);
    check("future-version save is refused", r.future === "E_SAVE_FUTURE", r.future);
    check("hand-edited save is refused", r.edited === "E_SAVE_CHECKSUM", r.edited);
    check("save for a different chapter graph is refused", r.otherChapter === "E_SAVE_GRAPH", r.otherChapter);
    await p.close();
  }

  // 5. Repeated choices / duplicate events (double click)
  {
    const p = await open("dup");
    const r = await p.evaluate(async () => {
      let s = H.E.startRun(H.graphs.T03_01, "dup");
      const btn = document.createElement("button"); document.body.append(btn);
      btn.addEventListener("click", () => { s = H.E.decide(H.graphs.T03_01, s, { decisionId: "dup#0", to: "D10" }); });
      btn.click(); btn.click(); btn.dispatchEvent(new MouseEvent("click"));
      return { trust: s.vars.DRYA_TRUST, heat: s.vars.POLICE_HEAT, decisions: s.decisions.length };
    });
    check("three clicks on one choice apply its effects once", r.trust === 54 && r.heat === 2 && r.decisions === 1, r);
    await p.close();
  }

  // 6. Import/export equivalence across profiles (and a fresh browser context)
  {
    const p = await open("exp");
    const text = await p.evaluate(async () => { const s = H.play("T03_05", "ex", ["W10", "W20-preserve", "W30-assist", "W35"]); await H.store.saveRun("e", s, null, H.graphs.T03_05); return H.store.exportRun("e"); });
    const ctx2 = await b.newContext(); const q = await ctx2.newPage(); await q.goto(URL("imp")); await q.waitForFunction(() => document.title === "ready");
    const r = await q.evaluate((t) => {
      const run = H.store.importRun("e", t, H.graphs.T03_05);
      let clobber = null; try { H.store.importRun("e", t, H.graphs.T03_05); } catch (e) { clobber = e.code; }
      return { ended: run.ended, reExport: H.store.exportRun("e") === t, clobber };
    }, text);
    check("export -> import in a fresh browser profile is byte-identical; import never clobbers", r.ended === "W40" && r.reExport && r.clobber === "E_SLOT_TAKEN", r);
    await ctx2.close(); await p.close();
  }

  // 7. Spoiler control in the rendered companion view
  {
    const p = await open("spoil");
    const text = await p.evaluate(() => {
      const s = H.play("T03_05", "sp", ["W10"]);
      H.render("T03_05", H.E.recordDiscovery(H.E.newDiscovery("spoil"), s), s);
      return document.getElementById("projection").textContent;
    });
    check("locked and hidden branches are not exposed in the rendered companion view",
      !/Player trusts the app|Player catches the app lying|Delete the false node|"W50"/.test(text) && /\?\?\?/.test(text), { excerpt: text.slice(0, 400) });
    await p.close();
  }

  await b.close();
  const summary = { meta: { ...meta, finishedAt: new Date().toISOString() }, passed: results.filter((r) => r.pass).length, failed: results.filter((r) => !r.pass).length, results };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/persistence-results.json`, JSON.stringify(summary, null, 1));
  console.log(`${summary.passed} passed, ${summary.failed} failed`);
  process.exit(summary.failed ? 1 : 0);
})();
