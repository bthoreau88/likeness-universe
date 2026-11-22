// node --test handoff/game/narrative/tests/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  VARIABLES, loadGraph, validateGraph, validateCondition, startRun, decide, availableChoices, replay,
  newDiscovery, recordDiscovery, projectForCompanion, serialize, deserialize, checksum, NarrativeError,
  SAVE_SCHEMA_VERSION,
} from "../engine/narrative-engine.mjs";

const fx = (f) => JSON.parse(fs.readFileSync(new URL(`../fixtures/${f}`, import.meta.url)));
const RAW = {
  T03_01: fx("T03_01_dellwood_checkin.bible-v002.json"),
  T03_02: fx("T03_02_room14_remembers.bible-v002-template.json"),
  T03_05: fx("T03_05_website_mirror.bible-v002.json"),
};
const G = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, loadGraph(v)]));
const GOLDEN = fx("playthroughs.golden.json");
const play = (g, runId, steps) => replay(g, runId, steps.map((to, i) => ({ decisionId: `${runId}#${i}`, to })));
const rejects = (fn, code) => assert.throws(fn, (e) => e instanceof NarrativeError && e.code === code, `expected ${code}`);

test("the eight bible variables are frozen in name and order", () => {
  assert.deepEqual(Object.keys(VARIABLES), ["THOREAU_INTEGRITY", "DRYA_TRUST", "ROOM_MEMORY", "PUBLIC_SIGNAL", "POLICE_HEAT", "EVIDENCE_STACK", "DARK_DRIFT", "APP_SYNC"]);
});

test("all fixtures load with zero structural errors", () => {
  for (const [k, g] of Object.entries(RAW)) assert.deepEqual(validateGraph(g).errors, [], k);
});

test("bible §15 template defect: N060 'Player anchors the memory' is unreachable", () => {
  const v = validateGraph(RAW.T03_02);
  assert.deepEqual(v.report.unreachable, ["N060"]);
  assert.deepEqual(Object.keys(v.report.outcomesReached), ["N050"]);
});

test("conditions are typed data; strings and unknown variables are rejected", () => {
  assert.ok(validateCondition("EVIDENCE_STACK.length >= 2").length > 0);
  assert.ok(validateCondition({ var: "TRUST", op: ">=", value: 1 }).length > 0);
  assert.ok(validateCondition({ var: "EVIDENCE_STACK", op: ">=", value: 1 }).length > 0);
  assert.ok(validateCondition({ var: "DRYA_TRUST", op: "~", value: 1 }).length > 0);
  assert.deepEqual(validateCondition({ all: [{ var: "DRYA_TRUST", op: ">=", value: 60 }, { evidence: "ledger_14" }] }), []);
  const bad = structuredClone(RAW.T03_02); bad.nodes[4].condition = "EVIDENCE_STACK.length >= 2";
  rejects(() => loadGraph(bad), "E_GRAPH");
});

test("structural lint: missing targets, orphan nodes, two starts, non-terminal outcome", () => {
  const g = structuredClone(RAW.T03_01);
  g.nodes.push({ id: "X1", type: "action", label: "orphan", next: ["NOPE"] });
  const e = validateGraph(g).errors.join("\n");
  assert.match(e, /edge to missing node NOPE/);
  const g2 = structuredClone(RAW.T03_01); g2.nodes.push({ id: "X2", type: "action", label: "orphan" });
  assert.match(validateGraph(g2).errors.join("\n"), /X2: no incoming route/);
  const g3 = structuredClone(RAW.T03_01); g3.nodes[1].type = "start";
  assert.match(validateGraph(g3).errors.join("\n"), /exactly one start/);
  const g4 = structuredClone(RAW.T03_01); g4.nodes.find((n) => n.id === "D60").next = ["D01"];
  assert.match(validateGraph(g4).errors.join("\n"), /outcome must be terminal/);
});

test("golden playthroughs are deterministic", () => {
  for (const r of GOLDEN) {
    const s = play(G[r.chapter], `golden-${r.name}`, r.steps);
    assert.equal(s.ended, r.expect.ended, r.name);
    assert.deepEqual(s.vars, r.expect.vars, r.name);
    assert.deepEqual(s.flags, r.expect.flags, r.name);
    assert.deepEqual(s.facts, r.expect.facts, r.name);
    assert.equal(checksum(s), r.expect.checksum, r.name);
  }
});

test("effects clamp to 0..100 and evidence is a sorted set", () => {
  const g = loadGraph({ chapter_id: "CLAMP", nodes: [
    { id: "S", type: "start", next: ["A"] },
    { id: "A", type: "action", effects: [{ var: "DRYA_TRUST", op: "add", value: 500 }, { var: "POLICE_HEAT", op: "add", value: -9 }, { evidence: "b", op: "add" }, { evidence: "a", op: "add" }, { evidence: "b", op: "add" }], next: ["E"] },
    { id: "E", type: "outcome" },
  ] });
  const s = play(g, "c", ["A"]);
  assert.equal(s.vars.DRYA_TRUST, 100);
  assert.equal(s.vars.POLICE_HEAT, 0);
  assert.deepEqual(s.vars.EVIDENCE_STACK, ["a", "b"]);
});

test("decisions are transactional and state is immutable", () => {
  const s0 = startRun(G.T03_01, "tx");
  const before = checksum(s0);
  rejects(() => decide(G.T03_01, s0, { decisionId: "x", to: "D60" }), "E_CHOICE");
  rejects(() => decide(G.T03_01, s0, { to: "D10" }), "E_DECISION_ID");
  assert.equal(checksum(s0), before);
  assert.throws(() => { s0.vars.DRYA_TRUST = 99; }, TypeError);
});

test("duplicate decision ids are no-ops (double-click / retried event)", () => {
  const s1 = decide(G.T03_01, startRun(G.T03_01, "dup"), { decisionId: "d-1", to: "D10" });
  const again = decide(G.T03_01, s1, { decisionId: "d-1", to: "D10" });
  assert.equal(again, s1);
  assert.equal(again.vars.DRYA_TRUST, 54);
  assert.equal(again.decisions.length, 1);
});

test("gates resolve automatically and never appear as player choices", () => {
  let s = play(G.T03_01, "g", ["D20", "D40", "D40-ledger"]);
  assert.deepEqual(availableChoices(G.T03_01, s).map((c) => c.to), ["D40-bell", "D50"]);
  s = decide(G.T03_01, s, { decisionId: "g#3", to: "D50" });
  assert.equal(s.ended, "D70");
  assert.ok(s.visited.includes("D50"));
  rejects(() => decide(G.T03_01, s, { decisionId: "g#4", to: "D10" }), "E_ENDED");
});

test("separate playthroughs: run state is per-run, discovery accumulates across runs", () => {
  let d = newDiscovery("profile-1");
  const a = play(G.T03_01, "run-a", ["D10", "D40", "D40-ledger", "D40-bell", "D50"]);
  d = recordDiscovery(d, a);
  const b = play(G.T03_01, "run-b", ["D30", "D40", "D50"]);
  assert.equal(b.vars.DRYA_TRUST, 56, "run B is unaffected by run A");
  assert.equal(b.flags.told_clerk_truth, undefined);
  d = recordDiscovery(d, b);
  assert.deepEqual(d.chapters.T03_01.outcomes, ["D60", "D70"]);
  assert.equal(d.runsCompleted, 2);
  const again = recordDiscovery(d, b);
  assert.equal(again.runsCompleted, 2, "recording the same run twice does not double count");
});

test("companion projection is spoiler-safe and read-only", () => {
  let d = newDiscovery("p");
  const s = play(G.T03_05, "w", ["W10", "W20-screenshot", "W30-read", "W35"]);
  d = recordDiscovery(d, s);
  const p = projectForCompanion(G.T03_05, d, s);
  assert.equal(p.readOnly, true);
  const byId = Object.fromEntries(p.nodes.map((n) => [n.id, n]));
  assert.equal(byId.W40.status, "discovered");
  assert.equal(byId["W20-delete"].label, "???");
  assert.equal(byId.W50.label, "???", "chapter completed once: hidden outcome appears only as ???");
  const json = JSON.stringify(p);
  assert.doesNotMatch(json, /Player trusts the app|Delete the false node/);
  assert.doesNotMatch(json, /"APP_SYNC":\s*\d/);
  assert.throws(() => { p.nodes.push({}); }, TypeError);
  // Before any completion, a hidden node not adjacent to a discovery is omitted entirely.
  const early = recordDiscovery(newDiscovery("q"), decide(G.T03_05, startRun(G.T03_05, "e"), { decisionId: "e1", to: "W10" }));
  assert.equal(projectForCompanion(G.T03_05, early).nodes.some((n) => n.id === "W50"), false);
});

test("W01 conditioning: a line may not acknowledge a fact unknown on any incoming route", () => {
  const bad = structuredClone(RAW.T03_05);
  bad.nodes.find((n) => n.id === "W01").acknowledges = ["app_shows_unplayed_node"];
  assert.match(validateGraph(bad).warnings.join("\n"), /W01: line acknowledges fact "app_shows_unplayed_node"/);
  assert.deepEqual(validateGraph(RAW.T03_05).warnings, [], "corrected W01 acknowledges nothing");
  const partial = structuredClone(RAW.T03_01);
  partial.nodes.find((n) => n.id === "D60").acknowledges = ["monitor_shows_03_14"];
  assert.match(validateGraph(partial).warnings.join("\n"), /D60: line acknowledges fact "monitor_shows_03_14"/,
    "D60 is reachable without watching the monitor (ledger + bell), so it may not reference it");
});

test("convergence nodes must acknowledge every incoming route", () => {
  const g = { chapter_id: "CV", nodes: [
    { id: "S", type: "start", next: ["A", "B"] },
    { id: "A", type: "action", effects: [{ var: "DRYA_TRUST", op: "add", value: 1 }], next: ["C"] },
    { id: "B", type: "action", effects: [{ var: "DRYA_TRUST", op: "add", value: -1 }], next: ["C"] },
    { id: "C", type: "convergence", continuity_patch: { A: "Drya is warmer" }, next: ["E"] },
    { id: "E", type: "outcome" },
  ] };
  assert.match(validateGraph(g).warnings.join("\n"), /C: convergence does not acknowledge incoming route B/);
  g.nodes[3].continuity_patch.B = "Drya is cooler";
  assert.deepEqual(validateGraph(g).warnings, []);
});

test("save round-trip and import/export equivalence", () => {
  const run = play(G.T03_01, "save-1", ["D20", "D40", "D40-ledger", "D40-bell", "D50"]);
  const discovery = recordDiscovery(newDiscovery("p"), run);
  const text = serialize({ run, discovery }, "2026-11-21T00:00:00.000Z");
  const back = deserialize(text, G.T03_01);
  assert.equal(back.replayVerified, true);
  assert.deepEqual(back.run, run);
  assert.equal(serialize(back, "2026-11-21T00:00:00.000Z"), text, "export(import(x)) == x byte-for-byte");
});

test("malformed and incompatible saves are rejected, never partially loaded", () => {
  const run = play(G.T03_01, "save-2", ["D10", "D40", "D50"]);
  const discovery = recordDiscovery(newDiscovery("p"), run);
  const good = JSON.parse(serialize({ run, discovery }));
  const reseal = (env) => JSON.stringify({ ...env, checksum: checksum({ run: env.run, discovery: env.discovery }) });
  rejects(() => deserialize("{not json"), "E_SAVE_JSON");
  rejects(() => deserialize(JSON.stringify({ ...good, kind: "other" })), "E_SAVE_KIND");
  rejects(() => deserialize(JSON.stringify({ ...good, schemaVersion: SAVE_SCHEMA_VERSION + 1 })), "E_SAVE_FUTURE");
  rejects(() => deserialize(JSON.stringify({ ...good, run: { ...good.run, vars: { ...good.run.vars, DRYA_TRUST: 99 } } })), "E_SAVE_CHECKSUM");
  rejects(() => deserialize(reseal({ ...good, run: { ...good.run, vars: { ...good.run.vars, DRYA_TRUST: 101 } } })), "E_SAVE_VAR");
  rejects(() => deserialize(reseal({ ...good, run: { ...good.run, vars: { ...good.run.vars, SANITY: 1 } } })), "E_SAVE_VAR");
  rejects(() => deserialize(reseal({ ...good, run: { ...good.run, vars: { ...good.run.vars, EVIDENCE_STACK: "ledger" } } })), "E_SAVE_VAR");
  rejects(() => deserialize(serialize({ run, discovery }), G.T03_02), "E_SAVE_GRAPH");
  // Resealed edit that keeps ranges valid but contradicts the decision log
  rejects(() => deserialize(reseal({ ...good, run: { ...good.run, vars: { ...good.run.vars, DRYA_TRUST: 90 } } }), G.T03_01), "E_SAVE_REPLAY");
  // A save that jumps to a node the log never reached
  rejects(() => deserialize(reseal({ ...good, run: { ...good.run, nodeId: "D60", ended: "D60" } }), G.T03_01), "E_SAVE_REPLAY");
});

test("v1 saves migrate to v2 (normalised evidence set, empty ledgers)", () => {
  const run = { schemaVersion: 1, runId: "old", chapterId: "T03_02", nodeId: "N010", visited: ["N001", "N010"], flags: {},
    vars: { THOREAU_INTEGRITY: 50, DRYA_TRUST: 50, ROOM_MEMORY: 15, PUBLIC_SIGNAL: 0, POLICE_HEAT: 0, EVIDENCE_STACK: ["ledger_14", "ledger_14"], DARK_DRIFT: 0, APP_SYNC: 50 } };
  const discovery = newDiscovery("p");
  const text = JSON.stringify({ kind: "likeness.save", schemaVersion: 1, savedAt: "2026-06-21T00:00:00Z", checksum: checksum({ run, discovery }), run, discovery });
  const out = deserialize(text, G.T03_02);
  assert.equal(out.migratedFrom, 1);
  assert.equal(out.replayVerified, false);
  assert.equal(out.run.schemaVersion, 2);
  assert.deepEqual(out.run.vars.EVIDENCE_STACK, ["ledger_14"]);
  assert.deepEqual(out.run.decisions, []);
});
