// LKN-SITE-G02A follow-up QA — PR #25 head, static export served at /likeness-universe
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const BASE = "http://127.0.0.1:4173/likeness-universe";
const OUT = "/home/claude/qa/out";
fs.mkdirSync(`${OUT}/shots`, { recursive: true });

const NEW_ROUTES = ["/works/", "/works/the-game/", "/works/tape-03/", "/works/wardrobe/", "/works/score/",
  "/characters/thoreau/", "/characters/drya/", "/characters/the-other/"];
const AFFECTED = ["/", "/street/", "/journey/", "/characters/"];
const VIEWPORTS = { mobile: { width: 390, height: 844 }, tablet: { width: 768, height: 1024 }, desktop: { width: 1440, height: 900 } };

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const results = { routes: {}, internalLinks: {}, perf: {}, keyboard: {}, reducedMotion: {} };
const slug = (r) => (r === "/" ? "home" : r.replace(/\//g, "_").replace(/^_|_$/g, ""));

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

for (const route of [...AFFECTED, ...NEW_ROUTES]) {
  results.routes[route] = {};
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: vp === "desktop" ? 1 : 2, isMobile: vp === "mobile", hasTouch: vp !== "desktop" });
    const page = await ctx.newPage();
    const failed = []; const consoleErr = [];
    page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().replace(BASE, "")}`); });
    page.on("requestfailed", (r) => failed.push(`FAILED ${r.url().replace(BASE, "")}`));
    page.on("console", (m) => { if (m.type() === "error") consoleErr.push(m.text().slice(0, 200)); });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${OUT}/shots/${slug(route)}__${vp}.png` });
    await scrollThrough(page);
    const dom = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth > vw + 1;
      const offenders = overflow ? [...document.querySelectorAll("body *")].filter((el) => {
        const r = el.getBoundingClientRect(); return r.right > vw + 1 && getComputedStyle(el).position !== "fixed";
      }).slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(el.getBoundingClientRect().right)}`) : [];
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src"));
      const cssBgBroken = [];
      const small = [...document.querySelectorAll("a[href], button, [role=button], input, select")].filter((el) => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || s.visibility === "hidden" || el.closest("[inert]")) return false;
        return r.height < 24 || r.width < 24;
      }).map((el) => `${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
      const h1 = [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().slice(0, 40));
      return { overflow, scrollWidth: document.documentElement.scrollWidth, vw, offenders, brokenImgs, cssBgBroken, small: [...new Set(small)].slice(0, 12), links, h1, title: document.title };
    });
    let axe = null;
    if (vp !== "tablet") {
      const a = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      axe = a.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 2).map((n) => n.target.join(" ")) }));
    }
    for (const l of dom.links) if (l && l.startsWith("/likeness-universe")) results.internalLinks[l] = null;
    results.routes[route][vp] = { title: dom.title, h1: dom.h1, failed: [...new Set(failed)], consoleErr: [...new Set(consoleErr)].slice(0, 5), overflow: dom.overflow, scrollWidth: dom.scrollWidth, vw: dom.vw, offenders: dom.offenders, brokenImgs: dom.brokenImgs, smallTargets: dom.small, axe };
    await ctx.close();
  }
  console.log("done", route);
}

// Internal link check
for (const l of Object.keys(results.internalLinks)) {
  const url = "http://127.0.0.1:4173" + l.split("#")[0];
  const u = url.endsWith("/") || /\.[a-z0-9]+$/i.test(url) ? url : url + "/";
  results.internalLinks[l] = Number(execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", u]).toString());
}

// Performance: scroll sequences, network bytes + JS heap, mobile emulation (CDP)
for (const route of ["/", "/street/"]) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Performance.enable");
  const reqs = [];
  page.on("requestfinished", async (r) => {
    try { const s = await r.sizes(); reqs.push({ url: r.url().replace(BASE, ""), type: r.resourceType(), bytes: s.responseBodySize + s.responseHeadersSize, t: Date.now() }); } catch {}
  });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const sum = (arr) => arr.reduce((a, b) => a + b.bytes, 0);
  const initial = { requests: reqs.length, bytes: sum(reqs), images: reqs.filter((r) => r.type === "image").map((r) => r.url) };
  const m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  // scroll through the sequence section slowly
  await page.evaluate(async () => {
    const sec = document.querySelector(".ovs-scroll");
    if (!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    for (let y = top; y <= top + sec.offsetHeight; y += 120) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  });
  await page.waitForTimeout(1500);
  const m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  const seqImgs = reqs.filter((r) => r.type === "image" || /\.(png|jpe?g|webp)/.test(r.url));
  const stillBytes = sum(seqImgs.filter((r) => /\/stills\/|\/subjects\//.test(r.url)));
  results.perf[route] = {
    initial: { requests: initial.requests, MB: +(initial.bytes / 1e6).toFixed(2), images: initial.images },
    afterSequence: { requests: reqs.length, MB: +(sum(reqs) / 1e6).toFixed(2), stillsMB: +(stillBytes / 1e6).toFixed(2), frameRequests: reqs.filter((r) => /\/frames2?\//.test(r.url)).length },
    jsHeapMB: { atLoad: +(m0.JSHeapUsedSize / 1e6).toFixed(1), afterSequence: +(m1.JSHeapUsedSize / 1e6).toFixed(1) },
  };
  await ctx.close();
}

// Keyboard: mobile nav, /works filters, outro CTA hidden focus, dossier switcher
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const seq = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    seq.push(await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect(); let o = 1, n = el;
      while (n && n !== document.body) { const s = getComputedStyle(n); o *= parseFloat(s.opacity); if (s.visibility === "hidden" || s.display === "none") o = 0; n = n.parentElement; }
      const offscreen = r.bottom < 0 || r.top > window.innerHeight;
      return { text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30), tag: el.tagName, effOpacity: +o.toFixed(2), offscreen };
    }));
  }
  results.keyboard.homeMobileTabOrder = seq.filter(Boolean);
  results.keyboard.homeInvisibleFocus = seq.filter((s) => s && s.effOpacity < 0.1);
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  await page.goto(BASE + "/works/", { waitUntil: "networkidle" });
  const filters = page.locator('nav[aria-label="Filter works"] button');
  const n = await filters.count();
  const out = [];
  for (let i = 0; i < n; i++) {
    await filters.nth(i).focus();
    const ring = await filters.nth(i).evaluate((el) => getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
    out.push({
      label: (await filters.nth(i).textContent()).trim(),
      pressed: await filters.nth(i).getAttribute("aria-pressed"),
      articles: await page.locator("article").count(),
      headings: await page.locator("article h2").allTextContents(),
      focusRing: ring,
      liveRegion: await page.locator("[aria-live]").count(),
    });
  }
  results.keyboard.worksFilters = out;
  await page.goto(BASE + "/characters/thoreau/", { waitUntil: "networkidle" });
  const sw = page.locator('nav[aria-label="Select a character"] a');
  results.keyboard.dossierSwitcher = { count: await sw.count(), current: await page.locator('nav[aria-label="Select a character"] a[aria-current="page"]').getAttribute("aria-label") };
  await sw.nth(1).focus(); await page.keyboard.press("Enter"); await page.waitForURL(/drya/);
  results.keyboard.dossierSwitcher.afterEnter = page.url().replace(BASE, "");
  await page.locator("text=NEXT IDENTITY").click(); await page.waitForURL(/the-other/);
  results.keyboard.dossierSwitcher.nextFromDrya = page.url().replace(BASE, "");
  await page.locator("text=NEXT IDENTITY").click(); await page.waitForURL(/thoreau/);
  results.keyboard.dossierSwitcher.wrapsTo = page.url().replace(BASE, "");
  await ctx.close();
}

// Reduced motion
for (const route of ["/", "/street/", "/journey/", "/room-14/"]) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/shots/reduced-motion__${slug(route)}__mobile.png` });
  results.reducedMotion[route] = await page.evaluate(() => ({
    lenisActive: document.documentElement.classList.contains("lenis"),
    runningAnimations: document.getAnimations().filter((a) => a.playState === "running").length,
    reducedAltVisible: [...document.querySelectorAll(".ovs-reduced-only")].some((e) => getComputedStyle(e).display !== "none"),
    canvasVisible: [...document.querySelectorAll(".ovs-scroll canvas")].some((e) => getComputedStyle(e).display !== "none"),
    framerTransforms: [...document.querySelectorAll("[style*='transform']")].filter((e) => /translate|scale/.test(e.style.transform) && !/scaleX\(0\)|none/.test(e.style.transform)).length,
  }));
  await ctx.close();
}

fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log("ALL DONE");
