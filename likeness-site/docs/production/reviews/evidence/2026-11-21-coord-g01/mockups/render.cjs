/* eslint-disable @typescript-eslint/no-require-imports -- standalone render script (CommonJS Playwright) */
// node render.cjs  → writes board-1..3.png next to this file
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(__dirname, "branding-hierarchy.html"));
  await p.evaluate(() => document.fonts.ready);
  const fonts = await p.evaluate(() => [...document.fonts].map((f) => `${f.family}:${f.status}`));
  for (const id of ["b1", "b2", "b3"]) await p.locator(`#${id}`).screenshot({ path: path.join(__dirname, `board-${id.slice(1)}.png`) });
  console.log(fonts.join(", "));
  await b.close();
})();
