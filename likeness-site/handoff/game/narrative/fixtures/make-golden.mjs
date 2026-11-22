// Regenerates fixtures/playthroughs.golden.json from the scripted routes below.
// The golden file is an engine regression snapshot, NOT independent narrative truth.
import fs from "node:fs";
import { loadGraph, replay, checksum } from "../engine/narrative-engine.mjs";
const load = (f) => loadGraph(JSON.parse(fs.readFileSync(new URL(f, import.meta.url))));
const G = {
  T03_01: load("./T03_01_dellwood_checkin.bible-v002.json"),
  T03_02: load("./T03_02_room14_remembers.bible-v002-template.json"),
  T03_05: load("./T03_05_website_mirror.bible-v002.json"),
};
const routes = [
  ["T03_01", "truth-full-lobby", ["D10", "D40", "D40-ledger", "D40-bell", "D50"]],
  ["T03_01", "lie-ledger-and-bell", ["D20", "D40", "D40-ledger", "D40-bell", "D50"]],
  ["T03_01", "drya-speaks-no-lobby", ["D30", "D40", "D50"]],
  ["T03_01", "lie-ledger-only", ["D20", "D40", "D40-ledger", "D50"]],
  ["T03_02", "evidence-first", ["N010", "N040"]],
  ["T03_02", "confrontation-first", ["N020", "N040"]],
  ["T03_02", "tape-first", ["N030", "N050"]],
  ["T03_05", "screenshot-read-in-time", ["W10", "W20-screenshot", "W30-read", "W35"]],
  ["T03_05", "preserve-assist", ["W10", "W20-preserve", "W30-assist", "W35"]],
  ["T03_05", "preserve-missed", ["W10", "W20-preserve", "W30-read", "W30-missed", "W35"]],
  ["T03_05", "delete", ["W10", "W20-delete", "W30-assist", "W35"]],
];
const out = routes.map(([ch, name, steps]) => {
  const s = replay(G[ch], `golden-${name}`, steps.map((to, i) => ({ decisionId: `golden-${name}#${i}`, to })));
  return { chapter: ch, name, steps, expect: { ended: s.ended, nodeId: s.nodeId, vars: s.vars, flags: s.flags, facts: s.facts, visited: s.visited, checksum: checksum(s) } };
});
fs.writeFileSync(new URL("./playthroughs.golden.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(out.map((o) => `${o.chapter} ${o.name} -> ${o.expect.ended}`).join("\n"));
