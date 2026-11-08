import { chromium } from "playwright";
const BASE = process.env.QA_BASE || "http://127.0.0.1:4173/likeness-universe";
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const out = {};

// 1. What are the "failed" requests?
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const f = [];
  page.on("requestfailed", (r) => f.push(`${r.url().replace(BASE, "")} :: ${r.failure()?.errorText}`));
  await page.goto(BASE + "/works/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  out.failedBeforeClose = f.slice();
  await ctx.close();
  out.failedAfterClose = f.slice(0, 4);
}

// 2. Hidden focus on home after waiting (desktop, so mobile-nav is not involved)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hits = [];
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(700);
    const s = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      let o = 1, n = el;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= parseFloat(cs.opacity); n = n.parentElement; }
      const r = el.getBoundingClientRect();
      return { text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40), effOpacity: +o.toFixed(2), inViewport: r.bottom > 0 && r.top < innerHeight };
    });
    if (s && s.effOpacity < 0.1) hits.push(s);
  }
  out.desktopHomeInvisibleFocusAfterWait = hits;
  await ctx.close();
}

// 3. Which animations still run under reduced motion?
for (const route of ["/", "/journey/"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const y0 = await page.evaluate(() => {
    const el = document.querySelector("[style*='translate']"); return el ? el.getAttribute("style") : null;
  });
  await page.mouse.wheel(0, 1600); await page.waitForTimeout(900);
  const y1 = await page.evaluate(() => {
    const el = document.querySelector("[style*='translate']"); return el ? el.getAttribute("style") : null;
  });
  out["reduced:" + route] = {
    animations: await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").map((a) => ({
      name: a.animationName || a.constructor.name, target: a.effect?.target ? (a.effect.target.className?.toString?.() || "").slice(0, 70) : null }))),
    firstTransformBeforeScroll: y0, firstTransformAfterScroll: y1,
  };
  await ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
