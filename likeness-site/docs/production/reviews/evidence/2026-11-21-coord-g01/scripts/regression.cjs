/* eslint-disable @typescript-eslint/no-require-imports -- standalone QA script run with the preinstalled Playwright (CommonJS) */
// OVS-LKN-COORD-G01 combined-candidate regression (headless Chromium via Playwright).
// Usage: QA_BASE=http://localhost:8765/likeness-universe QA_OUT=<dir> AXE=<path to axe.min.js> node regression.cjs
// Serves a static export built with NEXT_PUBLIC_BASE_PATH=/likeness-universe.
const { chromium } = require("playwright");
const fs = require("fs");
const { execFileSync } = require("child_process");
const httpStatus = (u) => Number(execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", u]).toString());
const BASE = process.env.QA_BASE;
const OUT = process.env.QA_OUT;
const AXE = fs.readFileSync(process.env.AXE, "utf8");
fs.mkdirSync(`${OUT}/shots`, { recursive: true });
const VP = { desktop: { width: 1440, height: 900 }, tablet: { width: 768, height: 1024 }, mobile: { width: 390, height: 844 } };
const SHOT_ROUTES = ["/", "/journey/", "/works/", "/universe/", "/street/", "/characters/"];
const slug = (r) => (r === "/" ? "home" : r.replace(/\//g, "_").replace(/^_|_$/g, ""));
const origin = new URL(BASE).origin;

(async () => {
  const sitemap = execFileSync("curl", ["-s", BASE + "/sitemap.xml"]).toString();
  const routes = [...sitemap.matchAll(/<loc>[^<]*?\/likeness-universe(\/[^<]*)<\/loc>/g)].map((m) => (m[1].endsWith("/") ? m[1] : m[1] + "/"));
  const R = { meta: { base: BASE, generatedAt: new Date().toISOString(), sitemapRoutes: routes.length }, routes: {}, links: {}, checks: {} };
  const b = await chromium.launch();
  const links = new Set();

  async function scroll(p) {
    await p.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(400);
  }

  for (const route of [...routes, "/prompts/"]) {
    R.routes[route] = {};
    for (const vp of ["desktop", "mobile"]) {
      const ctx = await b.newContext({ viewport: VP[vp], isMobile: vp === "mobile", hasTouch: vp === "mobile", deviceScaleFactor: 1 });
      const p = await ctx.newPage();
      const failed = [], errs = [];
      p.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().replace(origin, "")}`); });
      p.on("requestfailed", (r) => { const e = r.failure()?.errorText || ""; if (!/ERR_ABORTED/.test(e)) failed.push(`FAILED(${e}) ${r.url().replace(origin, "")}`); }); // aborted RSC prefetches on page close are not failures
      p.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
      p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
      const resp = await p.goto(BASE + route, { waitUntil: "load" }); await p.waitForTimeout(900);
      await scroll(p);
      const dom = await p.evaluate(() => ({
        title: document.title,
        robots: document.querySelector('meta[name="robots"]')?.content ?? null,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
        imgSrcs: [...document.images].map((i) => i.getAttribute("src")),
        promptLinks: [...document.querySelectorAll('a[href*="/prompts"]')].map((a) => a.textContent.trim().slice(0, 40)),
        links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
      }));
      dom.links.filter((l) => l && l.startsWith("/likeness-universe")).forEach((l) => links.add(l.split("#")[0]));
      let axe = null;
      if (vp === "desktop" || route === "/") {
        await p.addScriptTag({ content: AXE });
        const res = await p.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length })));
        axe = res;
      }
      if (vp === "desktop" || SHOT_ROUTES.includes(route)) { /* screenshots below */ }
      R.routes[route][vp] = { status: resp.status(), title: dom.title, robots: dom.robots, failed: [...new Set(failed)], errors: [...new Set(errs)].slice(0, 5), overflowX: dom.overflowX, brokenImgs: dom.brokenImgs, retiredMedia: dom.imgSrcs.filter((s) => /open-world-city|\/frames\/frame_0(13|22)/.test(s || "")), promptLinks: dom.promptLinks, axe };
      await ctx.close();
    }
  }

  for (const l of links) {
    const u = l.endsWith("/") || /\.[a-z0-9]+$/i.test(l) ? l : l + "/";
    R.links[l] = httpStatus(origin + u);
  }

  // Responsive screenshots
  for (const route of SHOT_ROUTES) for (const [vp, size] of Object.entries(VP)) {
    const ctx = await b.newContext({ viewport: size, isMobile: vp !== "desktop", hasTouch: vp !== "desktop", deviceScaleFactor: 1 });
    const p = await ctx.newPage(); await p.goto(BASE + route, { waitUntil: "load" }); await p.waitForTimeout(900); await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/shots/${slug(route)}__${vp}.png` }); await ctx.close();
  }

  // Journey Stage I image
  {
    const ctx = await b.newContext({ viewport: VP.desktop }); const p = await ctx.newPage();
    await p.goto(BASE + "/journey/", { waitUntil: "load" }); await p.waitForTimeout(900);
    await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop + innerHeight * 0.45); });
    await p.waitForTimeout(1500);
    R.checks.journeyStageI = await p.evaluate(() => {
      const s = document.querySelector("section.relative.h-\\[190vh\\]");
      return { heading: s?.querySelector("h2,h3")?.textContent?.trim(), bg: s?.innerHTML.match(/stills\/[a-z0-9-]+\.png/)?.[0] };
    });
    await p.screenshot({ path: `${OUT}/shots/journey_stage-I__desktop.png` }); await ctx.close();
  }

  // D2: hidden keyboard focus, desktop + mobile home
  for (const vp of ["desktop", "mobile"]) {
    const ctx = await b.newContext({ viewport: VP[vp], isMobile: vp === "mobile", hasTouch: vp === "mobile" });
    const p = await ctx.newPage(); await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(900); await p.waitForTimeout(800);
    const hidden = [], visited = [];
    for (let i = 0; i < 50; i++) {
      await p.keyboard.press("Tab"); await p.waitForTimeout(350);
      const s = await p.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        let o = 1, n = el; while (n && n !== document.body) { const cs = getComputedStyle(n); o *= parseFloat(cs.opacity); if (cs.visibility === "hidden" || cs.display === "none") o = 0; n = n.parentElement; }
        const r = el.getBoundingClientRect();
        return { t: (el.textContent || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 36), o: +o.toFixed(2), zero: r.width === 0 || r.height === 0 };
      });
      if (s) { visited.push(s.t); if (s.o < 0.1 || s.zero) hidden.push(s); }
    }
    R.checks[`hiddenFocus_${vp}`] = { tabStops: visited.length, hidden };
    await ctx.close();
  }

  // Mobile navigation: open, focus moves in, Tab stays in, Escape closes, focus returns
  {
    const ctx = await b.newContext({ viewport: VP.mobile, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(900);
    const toggle = p.getByRole("button", { name: /open menu/i });
    await toggle.click(); await p.waitForTimeout(500);
    const opened = await p.evaluate(() => ({ expanded: document.querySelector('button[aria-label="Close menu"]')?.getAttribute("aria-expanded"), active: document.activeElement?.textContent?.trim().slice(0, 30) }));
    const inside = [];
    for (let i = 0; i < 14; i++) { await p.keyboard.press("Tab"); inside.push(await p.evaluate(() => { const el = document.activeElement; const ok = !!el?.closest("#mobile-menu") || el?.getAttribute("aria-label") === "Close menu"; return { ok, t: (el?.textContent || el?.getAttribute("aria-label") || el?.tagName || "").trim().replace(/\s+/g, " ").slice(0, 28) }; })); }
    for (let i = 0; i < 4; i++) { await p.keyboard.press("Shift+Tab"); inside.push(await p.evaluate(() => { const el = document.activeElement; const ok = !!el?.closest("#mobile-menu") || el?.getAttribute("aria-label") === "Close menu"; return { ok, shift: true, t: (el?.textContent || el?.getAttribute("aria-label") || el?.tagName || "").trim().replace(/\s+/g, " ").slice(0, 28) }; })); }
    await p.screenshot({ path: `${OUT}/shots/mobile-nav-open.png` });
    await p.keyboard.press("Escape"); await p.waitForTimeout(400);
    const closed = await p.evaluate(() => ({ toggleLabel: document.activeElement?.getAttribute("aria-label"), promptCta: [...document.querySelectorAll("a")].some((a) => /prompt library/i.test(a.textContent)) }));
    R.checks.mobileNav = { opened, focusStayedInMenu: inside.every((x) => x.ok), escaped: inside.filter((x) => !x.ok), sequence: inside.map((x) => x.t), afterEscape: closed };
    await ctx.close();
  }

  // Reduced motion: Lenis wheel smoothing and Journey parallax
  for (const mode of ["no-preference", "reduce"]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: mode }); const p = await ctx.newPage();
    await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(900); await p.waitForTimeout(500);
    await p.mouse.move(640, 400); await p.mouse.wheel(0, 800); await p.waitForTimeout(40);
    const y40 = await p.evaluate(() => Math.round(scrollY));
    await p.goto(BASE + "/journey/", { waitUntil: "load" }); await p.waitForTimeout(900); await p.waitForTimeout(400);
    const bg = () => p.evaluate(() => document.querySelector("section.relative.h-\\[190vh\\] .absolute.inset-0")?.style.transform ?? "missing");
    await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop - innerHeight * 0.5); }); await p.waitForTimeout(400); const a = await bg();
    await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop + innerHeight * 0.8); }); await p.waitForTimeout(400); const c = await bg();
    R.checks[`motion_${mode}`] = { homeScrollY40msAfterWheel800: y40, journeyParallaxMoves: a !== c, journeyBg: [a, c] };
    await ctx.close();
  }

  // FD-003: sitemap and robots
  R.checks.prompts = {
    sitemapListsPrompts: /\/prompts/.test(sitemap),
    routeStatus: R.routes["/prompts/"].desktop.status,
    robotsMeta: R.routes["/prompts/"].desktop.robots,
    renderedPromptLinksAcrossSite: Object.entries(R.routes).filter(([r]) => r !== "/prompts/").flatMap(([r, v]) => Object.entries(v).filter(([, x]) => x.promptLinks.length).map(([vp, x]) => `${r} ${vp}: ${x.promptLinks.join("|")}`)),
  };
  await b.close();
  fs.writeFileSync(`${OUT}/regression-results.json`, JSON.stringify(R, null, 1));
  // Summary
  const all = Object.entries(R.routes).flatMap(([r, v]) => Object.entries(v).map(([vp, x]) => ({ r, vp, ...x })));
  const sum = {
    routesTested: Object.keys(R.routes).length,
    non200: all.filter((x) => x.status !== 200).map((x) => `${x.r} ${x.vp} ${x.status}`),
    failedRequests: all.filter((x) => x.failed.length).map((x) => `${x.r} ${x.vp}: ${x.failed.join(", ")}`),
    pageErrors: all.filter((x) => x.errors.length).map((x) => `${x.r} ${x.vp}: ${x.errors.join(" | ")}`),
    brokenImgs: all.filter((x) => x.brokenImgs.length).map((x) => `${x.r} ${x.vp}: ${x.brokenImgs.join(", ")}`),
    retiredMedia: all.filter((x) => x.retiredMedia.length).map((x) => `${x.r} ${x.vp}: ${x.retiredMedia.join(", ")}`),
    overflowX: all.filter((x) => x.overflowX).map((x) => `${x.r} ${x.vp}`),
    axeSeriousCritical: all.filter((x) => x.axe && x.axe.some((v) => /serious|critical/.test(v.impact))).map((x) => `${x.r} ${x.vp}: ${x.axe.filter((v) => /serious|critical/.test(v.impact)).map((v) => `${v.id}(${v.n})`).join(", ")}`),
    internalLinks: Object.keys(R.links).length, brokenLinks: Object.entries(R.links).filter(([, s]) => s !== 200),
    checks: R.checks,
  };
  fs.writeFileSync(`${OUT}/regression-summary.json`, JSON.stringify(sum, null, 1));
  console.log(JSON.stringify(sum, null, 1));
})();
