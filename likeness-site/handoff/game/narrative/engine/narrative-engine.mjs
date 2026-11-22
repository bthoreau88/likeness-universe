// LIKENESS : THE GAME — narrative-state reference engine (OVS-GAME-BRANCH-G01A.3 preflight)
//
// Pure, deterministic, dependency-free ES module. It is the executable reference
// for the Unreal narrative-state adapter specified in ../UE_NARRATIVE_STATE_ADAPTER_SPEC_V001.md
// and runs unchanged in Node (tests) and in a browser (persistence harness).
//
// Authority: Tape 03 Branching Narrative Bible V.002 §05 (node anatomy), §07 (global
// variables), §13 (data tables), §15 (JSON template), §17 (QC). The G01A.2 V002 33-node
// graph was not available to this gate; nothing here asserts its content.
//
// Laws enforced here (from the bible and LKN-GAME-UNIFY-G01 inherited law):
//  - Game Truth (run state) and discovery history are separate ledgers.
//  - Every committed decision is an event with one origin; replaying a decision id is a no-op.
//  - Decisions are transactional: a decision either applies completely or not at all.
//  - Conditions are typed data, never evaluated strings.
//  - The web companion consumes a read-only projection; it can never write run state.

export const ENGINE_VERSION = "1.0.0";
export const SAVE_SCHEMA_VERSION = 2;
export const DISCOVERY_SCHEMA_VERSION = 1;

/** The eight Tape 03 global variables (Bible V.002 §07). Names are frozen. */
export const VARIABLES = Object.freeze({
  THOREAU_INTEGRITY: { kind: "int", min: 0, max: 100, initial: 50 },
  DRYA_TRUST: { kind: "int", min: 0, max: 100, initial: 50 },
  ROOM_MEMORY: { kind: "int", min: 0, max: 100, initial: 10 },
  PUBLIC_SIGNAL: { kind: "int", min: 0, max: 100, initial: 0 },
  POLICE_HEAT: { kind: "int", min: 0, max: 100, initial: 0 },
  EVIDENCE_STACK: { kind: "set", initial: [] },
  DARK_DRIFT: { kind: "int", min: 0, max: 100, initial: 0 },
  APP_SYNC: { kind: "int", min: 0, max: 100, initial: 50 },
});

export const NODE_TYPES = Object.freeze([
  "start", "action", "dialogue", "timed", "evidence", "gate", "convergence", "outcome", "callback",
]);

export class NarrativeError extends Error {
  constructor(code, message, detail) {
    super(`${code}: ${message}`);
    this.code = code;
    this.detail = detail;
  }
}

const clone = (v) => JSON.parse(JSON.stringify(v));
const freezeDeep = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const k of Object.keys(o)) freezeDeep(o[k]);
  }
  return o;
};

// ---------------------------------------------------------------- conditions
// Condition AST (typed; see schema/narrative-graph.schema.json):
//   { all: [Cond...] } | { any: [Cond...] } | { not: Cond }
//   { var: NAME, op: "<"|"<="|"=="|"!="|">="|">", value: int }      (int variables)
//   { evidence: ID }                     EVIDENCE_STACK contains ID
//   { evidenceCount: { op, value } }     size of EVIDENCE_STACK
//   { flag: ID, is?: boolean }           persistent callback flag
//   { visited: NODE_ID }                 node visited in this run
//   { fact: ID }                         fact known to the player character in this run
const OPS = {
  "<": (a, b) => a < b, "<=": (a, b) => a <= b, "==": (a, b) => a === b,
  "!=": (a, b) => a !== b, ">=": (a, b) => a >= b, ">": (a, b) => a > b,
};

export function validateCondition(c, path = "condition") {
  const errs = [];
  if (c == null || typeof c !== "object" || Array.isArray(c)) return [`${path}: not an object`];
  const keys = Object.keys(c);
  if ("all" in c || "any" in c) {
    const k = "all" in c ? "all" : "any";
    if (!Array.isArray(c[k]) || c[k].length === 0) errs.push(`${path}.${k}: must be a non-empty array`);
    else c[k].forEach((x, i) => errs.push(...validateCondition(x, `${path}.${k}[${i}]`)));
  } else if ("not" in c) errs.push(...validateCondition(c.not, `${path}.not`));
  else if ("var" in c) {
    const v = VARIABLES[c.var];
    if (!v) errs.push(`${path}: unknown variable ${c.var}`);
    else if (v.kind !== "int") errs.push(`${path}: ${c.var} is not numeric; use evidence/evidenceCount`);
    if (!(c.op in OPS)) errs.push(`${path}: bad op ${c.op}`);
    if (!Number.isInteger(c.value)) errs.push(`${path}: value must be an integer`);
  } else if ("evidence" in c) {
    if (typeof c.evidence !== "string") errs.push(`${path}: evidence id must be a string`);
  } else if ("evidenceCount" in c) {
    if (!(c.evidenceCount?.op in OPS) || !Number.isInteger(c.evidenceCount?.value)) errs.push(`${path}: bad evidenceCount`);
  } else if ("flag" in c) {
    if (typeof c.flag !== "string") errs.push(`${path}: flag id must be a string`);
  } else if ("visited" in c) {
    if (typeof c.visited !== "string") errs.push(`${path}: visited must be a node id`);
  } else if ("fact" in c) {
    if (typeof c.fact !== "string") errs.push(`${path}: fact must be a string`);
  } else errs.push(`${path}: unknown condition keys ${keys.join(",")}`);
  return errs;
}

export function evaluate(c, state) {
  if (c == null) return true;
  if ("all" in c) return c.all.every((x) => evaluate(x, state));
  if ("any" in c) return c.any.some((x) => evaluate(x, state));
  if ("not" in c) return !evaluate(c.not, state);
  if ("var" in c) return OPS[c.op](state.vars[c.var], c.value);
  if ("evidence" in c) return state.vars.EVIDENCE_STACK.includes(c.evidence);
  if ("evidenceCount" in c) return OPS[c.evidenceCount.op](state.vars.EVIDENCE_STACK.length, c.evidenceCount.value);
  if ("flag" in c) return (state.flags[c.flag] === true) === (c.is ?? true);
  if ("visited" in c) return state.visited.includes(c.visited);
  if ("fact" in c) return state.facts.includes(c.fact);
  throw new NarrativeError("E_COND", "unknown condition", c);
}

// ------------------------------------------------------------------- effects
// Effect: { var: NAME, op: "add"|"set", value: int }
//       | { evidence: ID, op: "add"|"remove" }
//       | { flag: ID, value: boolean }          persistent callback flag
//       | { fact: ID }                          fact becomes known (monotonic within a run)
function validateEffect(e, path) {
  if ("var" in e) {
    const v = VARIABLES[e.var];
    if (!v || v.kind !== "int") return [`${path}: unknown or non-numeric variable ${e.var}`];
    if (!["add", "set"].includes(e.op) || !Number.isInteger(e.value)) return [`${path}: bad op/value`];
    return [];
  }
  if ("evidence" in e) return ["add", "remove"].includes(e.op) ? [] : [`${path}: evidence op must be add|remove`];
  if ("flag" in e) return typeof e.value === "boolean" ? [] : [`${path}: flag value must be boolean`];
  if ("fact" in e) return typeof e.fact === "string" ? [] : [`${path}: fact must be a string`];
  return [`${path}: unknown effect`];
}

function applyEffect(next, e) {
  if ("var" in e) {
    const spec = VARIABLES[e.var];
    const raw = e.op === "set" ? e.value : next.vars[e.var] + e.value;
    next.vars[e.var] = Math.max(spec.min, Math.min(spec.max, raw));
  } else if ("evidence" in e) {
    const s = new Set(next.vars.EVIDENCE_STACK);
    if (e.op === "add") s.add(e.evidence); else s.delete(e.evidence);
    next.vars.EVIDENCE_STACK = [...s].sort();
  } else if ("flag" in e) next.flags[e.flag] = e.value;
  else if ("fact" in e && !next.facts.includes(e.fact)) next.facts = [...next.facts, e.fact].sort();
}

// --------------------------------------------------------------------- graph
/**
 * Structural + causal validation of a chapter graph. Returns { errors, warnings, report }.
 * Errors make a graph unloadable. Warnings are authoring findings for human review.
 */
export function validateGraph(g) {
  const errors = [], warnings = [];
  if (!g || typeof g !== "object") return { errors: ["graph: not an object"], warnings, report: {} };
  if (typeof g.chapter_id !== "string") errors.push("graph.chapter_id missing");
  const nodes = new Map();
  for (const [i, n] of (g.nodes ?? []).entries()) {
    const p = `nodes[${i}](${n?.id})`;
    if (typeof n?.id !== "string") { errors.push(`${p}: id missing`); continue; }
    if (nodes.has(n.id)) errors.push(`${p}: duplicate id`);
    if (!NODE_TYPES.includes(n.type)) errors.push(`${p}: unknown type ${n.type}`);
    for (const [j, e] of (n.effects ?? []).entries()) errors.push(...validateEffect(e, `${p}.effects[${j}]`));
    if (n.requires) errors.push(...validateCondition(n.requires, `${p}.requires`));
    if (n.type === "gate") {
      errors.push(...validateCondition(n.condition, `${p}.condition`));
      if (!n.pass || !n.fail) errors.push(`${p}: gate needs pass and fail`);
    }
    if (n.type === "outcome" && (n.next ?? []).length) errors.push(`${p}: outcome must be terminal`);
    if (n.type === "convergence" && !n.continuity_patch) errors.push(`${p}: convergence needs continuity_patch`);
    nodes.set(n.id, n);
  }
  const starts = [...nodes.values()].filter((n) => n.type === "start");
  if (starts.length !== 1) errors.push(`graph: expected exactly one start node, found ${starts.length}`);
  const succ = (n) => (n.type === "gate" ? [n.pass, n.fail] : (n.next ?? []).map((x) => (typeof x === "string" ? x : x.to)));
  for (const n of nodes.values()) for (const t of succ(n)) if (t && !nodes.has(t)) errors.push(`${n.id}: edge to missing node ${t}`);
  for (const n of nodes.values()) for (const x of n.next ?? []) if (typeof x === "object" && x.when) errors.push(...validateCondition(x.when, `${n.id}.next(${x.to}).when`));
  if (errors.length) return { errors, warnings, report: {} };

  // Incoming edges
  const incoming = new Map([...nodes.keys()].map((k) => [k, []]));
  for (const n of nodes.values()) for (const t of succ(n)) incoming.get(t).push(n.id);
  for (const n of nodes.values()) if (n.type !== "start" && incoming.get(n.id).length === 0)
    errors.push(`${n.id}: no incoming route (QC: Branch Integrity)`);

  // Exhaustive path simulation from start (graphs are small and acyclic per chapter).
  // A path is a sequence of player choices; gates are resolved against the simulated state.
  const start = starts[0];
  const reached = new Set();
  const outcomesReached = new Map();
  const knownAtNode = new Map(); // node -> intersection of known facts over all arriving paths
  const paths = [];
  const initial = newRunState({ runId: "validator", chapterId: g.chapter_id, startNode: start.id, initialVars: g.initial_vars });
  const walk = (state, nodeId, trail, depth) => {
    if (depth > 200) { errors.push(`cycle or runaway path at ${nodeId}`); return; }
    const node = nodes.get(nodeId);
    const factsBefore = state.facts;
    const prev = knownAtNode.get(nodeId);
    knownAtNode.set(nodeId, prev ? prev.filter((f) => factsBefore.includes(f)) : [...factsBefore]);
    const s = enterNode(state, node);
    reached.add(nodeId);
    const t = [...trail, nodeId];
    if (node.type === "gate") return walk(s, evaluate(node.condition, s) ? node.pass : node.fail, t, depth + 1);
    const nexts = (node.next ?? []).map((x) => (typeof x === "string" ? { to: x } : x))
      .filter((x) => evaluate(x.when, s) && (!nodes.get(x.to).requires || evaluate(nodes.get(x.to).requires, s)));
    if (node.type === "outcome" || nexts.length === 0) {
      paths.push({ trail: t, end: nodeId, vars: s.vars, flags: s.flags });
      if (node.type === "outcome") outcomesReached.set(nodeId, (outcomesReached.get(nodeId) ?? 0) + 1);
      else warnings.push(`${nodeId}: dead end (non-outcome node with no available exit) via ${t.join(">")}`);
      return;
    }
    for (const x of nexts) walk(s, x.to, t, depth + 1);
  };
  walk(initial, start.id, [], 0);

  for (const n of nodes.values()) if (!reached.has(n.id))
    warnings.push(`${n.id}: unreachable from ${start.id} under the bible's starting state (${n.type}${n.label ? ` "${n.label}"` : ""})`);

  // W01 rule: a dialogue line may only acknowledge facts known on EVERY route that reaches it.
  for (const n of nodes.values()) {
    for (const f of n.acknowledges ?? []) {
      const known = knownAtNode.get(n.id) ?? [];
      if (!known.includes(f)) warnings.push(`${n.id}: line acknowledges fact "${f}" that is not known on every incoming route (W01 conditioning)`);
    }
  }
  // Convergence continuity: every incoming route must be named in the continuity patch.
  for (const n of nodes.values()) if (n.type === "convergence") {
    const covered = Object.keys(n.continuity_patch ?? {});
    for (const src of incoming.get(n.id)) if (!covered.includes(src))
      warnings.push(`${n.id}: convergence does not acknowledge incoming route ${src}`);
  }
  // "No fake choices" (QC): sibling choices that lead to identical end-states.
  for (const n of nodes.values()) {
    const kids = (n.next ?? []).map((x) => (typeof x === "string" ? x : x.to));
    if (kids.length < 2) continue;
    const sig = (id) => { const k = nodes.get(id); return JSON.stringify([k.effects ?? [], k.next ?? [], k.type]); };
    const seen = new Map();
    for (const k of kids) { const s = sig(k); if (seen.has(s)) warnings.push(`${n.id}: choices ${seen.get(s)} and ${k} are indistinguishable (QC: No Fake Choices)`); else seen.set(s, k); }
  }
  return {
    errors, warnings,
    report: {
      nodes: nodes.size,
      paths: paths.length,
      outcomesReached: Object.fromEntries(outcomesReached),
      unreachable: [...nodes.keys()].filter((k) => !reached.has(k)),
      pathSummaries: paths.map((p) => ({ trail: p.trail.join(">"), vars: p.vars, flags: p.flags })),
    },
  };
}

// ------------------------------------------------------------------ run state
export function newRunState({ runId, chapterId, startNode, initialVars } = {}) {
  const vars = {};
  for (const [k, spec] of Object.entries(VARIABLES)) vars[k] = clone(spec.initial);
  if (initialVars) for (const [k, v] of Object.entries(initialVars)) {
    if (!(k in VARIABLES)) throw new NarrativeError("E_VAR", `unknown variable ${k}`);
    vars[k] = k === "EVIDENCE_STACK" ? [...new Set(v)].sort() : v;
  }
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    engineVersion: ENGINE_VERSION,
    runId,
    chapterId,
    nodeId: startNode,
    vars,
    flags: {},
    facts: [],
    visited: [],
    decisions: [], // committed decision ids, in order (event origin ledger)
    log: [],       // [{ seq, decisionId, from, to, nodes:[...] }]
    revision: 0,
    ended: null,   // outcome node id once the chapter ends
  };
}

function enterNode(state, node) {
  if (node.requires && !evaluate(node.requires, state))
    throw new NarrativeError("E_REQUIRES", `node ${node.id} requirements not met`);
  const next = clone(state);
  for (const e of node.effects ?? []) applyEffect(next, e);
  if (!next.visited.includes(node.id)) next.visited.push(node.id);
  return next;
}

/** Load a graph after validation. Throws on structural errors. Returns an immutable index. */
export function loadGraph(g) {
  const v = validateGraph(g);
  if (v.errors.length) throw new NarrativeError("E_GRAPH", "graph failed validation", v.errors);
  const nodes = new Map(g.nodes.map((n) => [n.id, n]));
  return freezeDeep({ chapter_id: g.chapter_id, title: g.title, start: g.nodes.find((n) => n.type === "start").id, nodes: Object.fromEntries(nodes), initial_vars: g.initial_vars ?? null, validation: v });
}

/** Begin a chapter run: enters the start node (applies its effects). */
export function startRun(graph, runId) {
  const s0 = newRunState({ runId, chapterId: graph.chapter_id, startNode: graph.start, initialVars: graph.initial_vars });
  const s = enterNode(s0, graph.nodes[graph.start]);
  s.log.push({ seq: 0, decisionId: null, from: null, to: graph.start, nodes: [graph.start] });
  return freezeDeep(s);
}

/** The choices available from the current node (never includes gates' hidden math). */
export function availableChoices(graph, state) {
  if (state.ended) return [];
  const node = graph.nodes[state.nodeId];
  return (node.next ?? []).map((x) => (typeof x === "string" ? { to: x } : x))
    .filter((x) => evaluate(x.when, state) && (!graph.nodes[x.to].requires || evaluate(graph.nodes[x.to].requires, state)))
    .map((x) => ({ to: x.to, label: graph.nodes[x.to].label ?? x.to, type: graph.nodes[x.to].type }));
}

/**
 * Commit one decision transactionally.
 * - decisionId must be unique per run; re-submitting an already-committed id returns the
 *   same state unchanged (duplicate-event prevention, e.g. double clicks, retried RPCs).
 * - The target must be an available choice. Gates after it resolve automatically.
 * - On any error nothing is applied (the input state is immutable).
 */
export function decide(graph, state, { decisionId, to }) {
  if (typeof decisionId !== "string" || !decisionId) throw new NarrativeError("E_DECISION_ID", "decisionId required");
  if (state.decisions.includes(decisionId)) return state; // idempotent replay
  if (state.ended) throw new NarrativeError("E_ENDED", `chapter already ended at ${state.ended}`);
  if (!availableChoices(graph, state).some((c) => c.to === to))
    throw new NarrativeError("E_CHOICE", `${to} is not available from ${state.nodeId}`);
  let s = clone(state);
  const entered = [];
  let id = to;
  for (let guard = 0; guard < 64; guard++) {
    const node = graph.nodes[id];
    s = enterNode(s, node);
    entered.push(id);
    if (node.type === "gate") { id = evaluate(node.condition, s) ? node.pass : node.fail; continue; }
    break;
  }
  s.nodeId = id;
  if (graph.nodes[id].type === "outcome") s.ended = id;
  s.decisions.push(decisionId);
  s.revision += 1;
  s.log.push({ seq: s.log.length, decisionId, from: state.nodeId, to: id, nodes: entered });
  return freezeDeep(s);
}

/** Replay a decision log deterministically from a fresh run (used for save verification). */
export function replay(graph, runId, decisions) {
  let s = startRun(graph, runId);
  for (const d of decisions) s = decide(graph, s, d);
  return s;
}

// ------------------------------------------------------------- discovery ledger
// Discovery history spans playthroughs. It never feeds back into run state.
export function newDiscovery(profileId) {
  return { schemaVersion: DISCOVERY_SCHEMA_VERSION, profileId, chapters: {}, runsCompleted: 0, revision: 0 };
}

export function recordDiscovery(discovery, state) {
  const d = clone(discovery);
  const ch = (d.chapters[state.chapterId] ??= { nodes: [], outcomes: [], completed: false, runIds: [] });
  ch.nodes = [...new Set([...ch.nodes, ...state.visited])].sort();
  if (state.ended && !ch.outcomes.includes(state.ended)) ch.outcomes = [...ch.outcomes, state.ended].sort();
  if (!ch.runIds.includes(state.runId)) {
    ch.runIds = [...ch.runIds, state.runId];
    if (state.ended) { ch.completed = true; d.runsCompleted += 1; }
  } else if (state.ended && !ch.completed) ch.completed = true;
  d.revision += 1;
  return freezeDeep(d);
}

// ------------------------------------------------------------- web projection
/**
 * Read-only, spoiler-safe projection for the web companion (Bible §16 UX rules):
 *  - discovered: full label;  locked: "???" (hint only after the chapter was completed once);
 *  - hidden: omitted entirely until an adjacent node has been discovered;
 *  - variable math is never exported (Rule 07); only coarse bands for the current run.
 */
export function projectForCompanion(graph, discovery, state = null) {
  const ch = discovery.chapters[graph.chapter_id] ?? { nodes: [], outcomes: [], completed: false };
  const found = new Set(ch.nodes);
  const adj = new Set();
  for (const n of Object.values(graph.nodes)) {
    const out = n.type === "gate" ? [n.pass, n.fail] : (n.next ?? []).map((x) => (typeof x === "string" ? x : x.to));
    if (found.has(n.id)) out.forEach((t) => adj.add(t));
  }
  const nodes = [];
  for (const n of Object.values(graph.nodes)) {
    if (found.has(n.id)) nodes.push({ id: n.id, type: n.type, status: "discovered", label: n.label ?? n.id });
    else if (n.hidden && !adj.has(n.id)) continue;
    else if (adj.has(n.id) || ch.completed) nodes.push({ id: n.id, type: n.type === "outcome" ? "outcome" : "unknown", status: "locked", label: "???", hint: ch.completed ? n.hint ?? null : null });
  }
  const band = (v) => (v < 34 ? "low" : v < 67 ? "mid" : "high");
  return freezeDeep({
    kind: "likeness.companion.projection",
    schemaVersion: 1,
    readOnly: true,
    chapterId: graph.chapter_id,
    completed: ch.completed,
    nodes,
    outcomesSeen: ch.outcomes,
    currentRun: state ? { runId: state.runId, atNode: found.has(state.nodeId) ? state.nodeId : null, ended: state.ended, bands: { DRYA_TRUST: band(state.vars.DRYA_TRUST), ROOM_MEMORY: band(state.vars.ROOM_MEMORY), POLICE_HEAT: band(state.vars.POLICE_HEAT) } } : null,
  });
}

// --------------------------------------------------------------- persistence
// Save envelope: { kind, schemaVersion, savedAt, checksum, run, discovery }.
// The checksum is FNV-1a over the canonical JSON of {run, discovery}; it detects truncation
// and hand-edits, it is not a security boundary.
function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
export function checksum(v) {
  let h = 0x811c9dc5;
  const s = canonical(v);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

export function serialize({ run, discovery }, savedAt = "1970-01-01T00:00:00.000Z") {
  const body = { run, discovery };
  return JSON.stringify({ kind: "likeness.save", schemaVersion: SAVE_SCHEMA_VERSION, savedAt, checksum: checksum(body), ...body });
}

/** Migrations keyed by the version they upgrade FROM. Each is pure. */
export const MIGRATIONS = {
  // v1 saves (bible §15 template era) stored EVIDENCE_STACK possibly unsorted with duplicates,
  // had no facts ledger and no decision ids. v2 normalises the set and adds empty ledgers.
  1: (env) => {
    const run = clone(env.run);
    run.vars.EVIDENCE_STACK = [...new Set(run.vars.EVIDENCE_STACK ?? [])].sort();
    run.facts ??= [];
    run.decisions ??= [];
    run.log ??= [];
    run.revision ??= 0;
    run.ended ??= null;
    run.schemaVersion = 2;
    return { ...env, schemaVersion: 2, run, checksum: checksum({ run, discovery: env.discovery }) };
  },
};

/**
 * Parse and validate a save. Never returns a partially valid object: throws NarrativeError
 * with code E_SAVE_* for malformed, corrupted, future-version or graph-incompatible saves.
 */
export function deserialize(text, graph = null) {
  let env;
  try { env = JSON.parse(text); } catch { throw new NarrativeError("E_SAVE_JSON", "save is not valid JSON"); }
  if (!env || env.kind !== "likeness.save") throw new NarrativeError("E_SAVE_KIND", "not a LIKENESS save");
  if (!Number.isInteger(env.schemaVersion)) throw new NarrativeError("E_SAVE_VERSION", "missing schemaVersion");
  if (env.schemaVersion > SAVE_SCHEMA_VERSION) throw new NarrativeError("E_SAVE_FUTURE", `save v${env.schemaVersion} is newer than engine v${SAVE_SCHEMA_VERSION}`);
  if (checksum({ run: env.run, discovery: env.discovery }) !== env.checksum) throw new NarrativeError("E_SAVE_CHECKSUM", "checksum mismatch (corrupted or edited save)");
  const migratedFrom = env.schemaVersion < SAVE_SCHEMA_VERSION ? env.schemaVersion : null;
  while (env.schemaVersion < SAVE_SCHEMA_VERSION) {
    const m = MIGRATIONS[env.schemaVersion];
    if (!m) throw new NarrativeError("E_SAVE_MIGRATION", `no migration from v${env.schemaVersion}`);
    env = m(env);
  }
  const { run, discovery } = env;
  for (const [k, spec] of Object.entries(VARIABLES)) {
    const v = run?.vars?.[k];
    if (spec.kind === "int" && !(Number.isInteger(v) && v >= spec.min && v <= spec.max)) throw new NarrativeError("E_SAVE_VAR", `${k} out of range`);
    if (spec.kind === "set" && !(Array.isArray(v) && v.every((x) => typeof x === "string"))) throw new NarrativeError("E_SAVE_VAR", `${k} malformed`);
  }
  if (Object.keys(run.vars).some((k) => !(k in VARIABLES))) throw new NarrativeError("E_SAVE_VAR", "unknown variable in save");
  if (graph) {
    if (run.chapterId !== graph.chapter_id) throw new NarrativeError("E_SAVE_GRAPH", `save is for ${run.chapterId}, not ${graph.chapter_id}`);
    if (!graph.nodes[run.nodeId]) throw new NarrativeError("E_SAVE_GRAPH", `node ${run.nodeId} not in graph`);
    if (run.visited.some((id) => !graph.nodes[id])) throw new NarrativeError("E_SAVE_GRAPH", "visited node not in graph");
    // Strongest check: the decision log must replay to the same state. Migrated v1 saves
    // predate the decision log, so they are position-checked above but cannot be replayed.
    if (migratedFrom !== null && run.log.length === 0) return { run: freezeDeep(run), discovery: freezeDeep(discovery), migratedFrom, replayVerified: false };
    const decisions = run.log.filter((e) => e.decisionId).map((e) => ({ decisionId: e.decisionId, to: e.nodes[0] }));
    let replayed;
    try { replayed = replay(graph, run.runId, decisions); } catch (e) { throw new NarrativeError("E_SAVE_REPLAY", `decision log does not replay: ${e.message}`); }
    if (checksum(replayed) !== checksum(run)) throw new NarrativeError("E_SAVE_REPLAY", "saved state differs from its own decision log");
  }
  return { run: freezeDeep(run), discovery: freezeDeep(discovery), migratedFrom, replayVerified: !!graph };
}
