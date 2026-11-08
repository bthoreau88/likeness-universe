import { chromium } from "playwright";
const BASE = "http://127.0.0.1:4175/likeness-universe";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(BASE + "/", { waitUntil: "networkidle" });
const hidden = [];
for (let i = 0; i < 30; i++) { await p.keyboard.press("Tab"); await p.waitForTimeout(400);
  const s = await p.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; let o = 1, n = el; while (n && n !== document.body) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; } return { t: (el.textContent||"").trim().slice(0,30), o: +o.toFixed(2) }; });
  if (s && s.o < 0.1) hidden.push(s.t); }
await p.goto(BASE + "/room-14/", { waitUntil: "networkidle" });
const idx = await p.locator('nav[aria-label="Room 14 evidence"] button').count();
await p.locator('nav[aria-label="Room 14 evidence"] button').first().focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(400);
const live = (await p.locator("[aria-live=polite]").first().textContent()).trim().slice(0, 60);
console.log(JSON.stringify({ mergedHomeHiddenFocus: [...new Set(hidden)], room14IndexButtons: idx, inspectorAfterEnter: live }));
await b.close();
