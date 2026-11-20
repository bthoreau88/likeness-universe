import { chromium } from "playwright";
const BASE = process.env.QA_BASE;
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
for (const [vp, size] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: vp === "mobile" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(1200);
  const card = p.locator('a:has(img[src*="thoreau-stealth"])').first();
  await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  await card.screenshot({ path: `/home/claude/qa/out_combined/shots_slot_street-card_${vp}.png` });
  await p.goto(BASE + "/journey/", { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.evaluate(() => { const s = document.querySelector("section.relative.h-\\[190vh\\]"); scrollTo(0, s.offsetTop + innerHeight * 0.45); });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `/home/claude/qa/out_combined/shots_slot_journey-I_${vp}.png` });
  await ctx.close();
}
await b.close(); console.log("ok");
