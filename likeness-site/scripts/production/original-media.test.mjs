import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
