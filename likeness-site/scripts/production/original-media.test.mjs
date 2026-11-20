import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const file = (path) => readFileSync(join(root, path), "utf8");

test("unapproved superhero demo frames are excluded from the static export source", () => {
  assert.equal(existsSync(join(root, "public/frames")), false);
  assert.equal(existsSync(join(root, "public/frames2")), false);
  assert.doesNotMatch(file("src/lib/frames.ts"), /\/(?:frames|frames2)\/frame_/);
});

test("all replacement scroll plates are existing LIKENESS-owned local site files", () => {
  const content = file("src/lib/registry.ts");
  const start = content.indexOf("export const SCROLL_SEQUENCES");
  const end = content.indexOf("export const CHARACTER_PROFILES", start);
  assert.ok(start >= 0 && end > start, "SCROLL_SEQUENCES must be registered");
  const media = content.slice(start, end).match(/"\/(?:stills|subjects)\/[^"]+"/g) || [];
  assert.ok(media.length >= 6, "both scroll sequences need local imagery");
  for (const literal of media) {
    const path = JSON.parse(literal);
    assert.ok(existsSync(join(root, "public", path.slice(1))), `missing ${path}`);
  }
});

test("new editorial route entrypoints are present for a static export", () => {
  for (const path of [
    "src/app/works/page.tsx",
    "src/app/works/the-game/page.tsx",
    "src/app/works/tape-03/page.tsx",
    "src/app/works/wardrobe/page.tsx",
    "src/app/works/score/page.tsx",
    "src/app/characters/thoreau/page.tsx",
    "src/app/characters/drya/page.tsx",
    "src/app/characters/the-other/page.tsx",
  ]) assert.ok(existsSync(join(root, path)), `missing page: ${path}`);
  const sitemap = file("src/app/sitemap.ts");
  for (const route of ["/works", "/works/the-game", "/works/tape-03", "/works/wardrobe",
    "/works/score", "/characters/thoreau", "/characters/drya", "/characters/the-other"]) {
    assert.ok(sitemap.includes(`"${route}"`), `missing sitemap route: ${route}`);
  }
});

// G02A D1 regression: the frame directories were deleted, but two components
// still pointed at them. Scan every runtime source file, not just frames.ts.
function sourceFiles(dir) {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(rel);
    return /\.(?:tsx?|mjs|css)$/.test(entry.name) ? [rel] : [];
  });
}

test("no runtime source references the retired /frames/ or /frames2/ sequences", () => {
  const offenders = sourceFiles("src").filter((path) => /["'`(]\/(?:frames|frames2)\//.test(file(path)));
  assert.deepEqual(offenders, [], `retired frame paths still referenced in: ${offenders.join(", ")}`);
});

test("every local /stills/, /subjects/ or /video/ path in runtime source exists in public/", () => {
  const missing = [];
  for (const path of sourceFiles("src")) {
    for (const [, ref] of file(path).matchAll(/["'`]((?:\/stills|\/subjects|\/video)\/[^"'`\s]+\.(?:png|jpe?g|webp|avif|mp4|webm))["'`]/g)) {
      if (!existsSync(join(root, "public", ref.slice(1)))) missing.push(`${path} → ${ref}`);
    }
  }
  assert.deepEqual(missing, [], `missing media: ${missing.join("; ")}`);
});

test("FD-003: the internal prompt library is not linked from public navigation or the sitemap", () => {
  for (const path of ["src/components/ui/Navbar.tsx", "src/components/universe/UniverseHero.tsx", "src/app/page.tsx", "src/app/sitemap.ts"]) {
    assert.doesNotMatch(file(path), /["']\/prompts["']|<ConceptFrames\s*\/>/, `${path} still links the prompt library`);
  }
  assert.ok(existsSync(join(root, "src/app/prompts/page.tsx")), "the library itself must be preserved");
  assert.match(file("src/app/prompts/page.tsx"), /robots:\s*\{\s*index:\s*false/);
  assert.match(file("src/app/robots.ts"), /disallow:.*\/prompts\//);
});

test("FD-001: Journey stage I uses no combat-styled plate", () => {
  const journey = file("src/components/companion/Journey.tsx");
  const stageOne = journey.slice(journey.indexOf('n: "I"'), journey.indexOf('n: "II"'));
  assert.doesNotMatch(stageOne, /thoreau-stealth|open-world-city|drya-customization|drya-corridor|drya-atrium/);
  const img = stageOne.match(/image:\s*"([^"]+)"/)[1];
  assert.ok(existsSync(join(root, "public", img.slice(1))), `missing ${img}`);
});
