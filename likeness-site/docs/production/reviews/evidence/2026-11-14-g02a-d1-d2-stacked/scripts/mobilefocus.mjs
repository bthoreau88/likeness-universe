import { chromium } from "playwright";
const BASE = process.env.QA_BASE;
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(1500);
const hidden = [];
for (let i = 0; i < 45; i++) { await p.keyboard.press("Tab"); await p.waitForTimeout(900);
  const s = await p.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; let o = 1, n = el; while (n && n !== document.body) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; } return { t: (el.textContent||"").trim().replace(/\s+/g," ").slice(0, 30), o: +o.toFixed(2) }; });
  if (s && s.o < 0.1) hidden.push(s); }
console.log(JSON.stringify({ mobileInvisibleFocusAfter900ms: hidden }));
await b.close();
