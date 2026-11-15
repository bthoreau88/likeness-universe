// Before/after network cost of the scroll sequences, mobile emulation (390x844 @3x).
import { chromium } from "playwright";
const targets = { canonical: "http://127.0.0.1:4174/likeness-universe", pr25: "http://127.0.0.1:4173/likeness-universe" };
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const res = {};
for (const [name, BASE] of Object.entries(targets)) {
  for (const route of ["/", "/street/"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const reqs = [];
    page.on("requestfinished", async (r) => { try { const s = await r.sizes(); reqs.push({ url: r.url(), type: r.resourceType(), bytes: s.responseBodySize }); } catch {} });
    const t0 = Date.now();
    await page.goto(BASE + route, { waitUntil: "load" });
    const lcp = await page.evaluate(() => new Promise((ok) => {
      let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => ok(Math.round(v)), 1500);
    }));
    await page.waitForLoadState("networkidle");
    const sum = (a) => +(a.reduce((x, y) => x + y.bytes, 0) / 1e6).toFixed(2);
    const atIdle = { requests: reqs.length, MB: sum(reqs), seqMB: sum(reqs.filter((r) => /\/frames2?\/|\/stills\/|\/subjects\//.test(r.url))), frameReqs: reqs.filter((r) => /\/frames2?\//.test(r.url)).length };
    await page.evaluate(async () => {
      const sec = document.querySelector(".scroll-animation, .ovs-scroll, section[class*='h-[']") || document.body;
      const top = sec.getBoundingClientRect().top + scrollY;
      for (let y = top; y <= top + sec.offsetHeight; y += 100) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    });
    await page.waitForTimeout(2000);
    res[`${name} ${route}`] = { lcpMs_unthrottled: lcp, atIdle, afterFullScroll: { requests: reqs.length, MB: sum(reqs), seqMB: sum(reqs.filter((r) => /\/frames2?\/|\/stills\/|\/subjects\//.test(r.url))) }, elapsedMs: Date.now() - t0 };
    await ctx.close();
  }
}
console.log(JSON.stringify(res, null, 1));
await browser.close();
