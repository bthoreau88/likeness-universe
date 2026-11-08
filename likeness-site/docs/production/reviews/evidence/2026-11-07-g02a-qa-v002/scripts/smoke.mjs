import { chromium } from "playwright";
const BASE = process.env.QA_BASE;
const routes = (process.env.QA_ROUTES || "").split(",");
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const bad = {};
for (const mode of ["no-preference", "reduce"]) for (const r of routes) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: mode });
  const p = await ctx.newPage(); const e = [];
  p.on("pageerror", (x) => e.push("PAGEERROR " + x.message.slice(0, 120)));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) e.push(m.text().slice(0, 120)); });
  p.on("response", (x) => { if (x.status() >= 400) e.push(`${x.status()} ${x.url().replace(BASE, "")}`); });
  await p.goto(BASE + r, { waitUntil: "load" }); await p.waitForTimeout(1500); await p.mouse.wheel(0, 2000); await p.waitForTimeout(400);
  if (e.length) bad[`${mode} ${r}`] = [...new Set(e)];
  await ctx.close();
}
console.log(JSON.stringify({ checked: routes.length * 2, problems: bad }, null, 1));
await b.close();
