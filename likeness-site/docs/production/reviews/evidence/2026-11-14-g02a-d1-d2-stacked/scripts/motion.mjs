// Reduced-motion re-test: wheel smoothing, Journey parallax, home reveal transforms, hydration errors.
import { chromium } from "playwright";
const BASE = process.env.QA_BASE || "http://127.0.0.1:4176/likeness-universe";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const out = {};
for (const mode of ["no-preference", "reduce"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: mode });
  const p = await ctx.newPage();
  const errs = []; p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); }); p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 160)));
  // 1. wheel smoothing on home
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  await p.mouse.move(640, 400);
  await p.mouse.wheel(0, 800);
  const samples = [];
  for (const t of [30, 120, 400, 1200]) { await p.waitForTimeout(t - (samples.at(-1)?.t ?? 0)); samples.push({ t, y: Math.round(await p.evaluate(() => scrollY)), cls: await p.evaluate(() => document.documentElement.className) }); }
  // 2. home reveal transforms: scroll a section into view, sample a translateY reveal 50ms after entering
  const reveal = await p.evaluate(async () => {
    const els = [...document.querySelectorAll("[style*='translateY']")].filter((e) => e.getBoundingClientRect().top > innerHeight * 1.5);
    const el = els[0]; if (!el) return "none-found";
    el.scrollIntoView({ block: "center" });
    await new Promise((r) => setTimeout(r, 60));
    return el.style.transform || "(none)";
  });
  // 3. Journey parallax
  await p.goto(BASE + "/journey/", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  const bgT = async () => p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\] .absolute.inset-0"); return s ? s.style.transform : "missing"; });
  await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop - innerHeight * 0.5); }); await p.waitForTimeout(500); const j0 = await bgT();
  await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop + innerHeight * 0.8); }); await p.waitForTimeout(500); const j1 = await bgT();
  out[mode] = { wheelSamples: samples, homeRevealTransform60ms: reveal, journeyBg: [j0, j1], journeyMoves: j0 !== j1, consoleErrors: [...new Set(errs)].filter((e) => !/404|Failed to load resource/.test(e)) };
  await ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
