// Browser persistence for the narrative reference engine (web prototype / companion side).
//
// Ledgers are stored separately, mirroring the engine's law:
//   run slots   likeness.run.v2:<profile>:<slot>   one playthrough each; compare-and-swap writes
//   discovery   likeness.discovery.v1:<profile>     union-merged across tabs and runs
//
// Multi-tab safety: every run write is a compare-and-swap on run.revision, performed inside
// a Web Lock (navigator.locks) when the browser has one. A tab holding a stale revision gets
// E_CONFLICT instead of silently overwriting newer progress. Discovery is monotonic (set
// union), so concurrent tabs can always merge it without loss.
//
// Corrupted or incompatible data is never deleted: it is copied to a quarantine key and the
// load reports the error code.
import { serialize, deserialize, NarrativeError, DISCOVERY_SCHEMA_VERSION, newDiscovery } from "./narrative-engine.mjs";

const runKey = (profile, slot) => `likeness.run.v2:${profile}:${slot}`;
const discKey = (profile) => `likeness.discovery.v1:${profile}`;

async function withLock(name, fn) {
  if (globalThis.navigator?.locks?.request) return navigator.locks.request(name, fn);
  return fn();
}

function mergeDiscovery(a, b) {
  if (!a) return b;
  if (!b) return a;
  const out = { schemaVersion: DISCOVERY_SCHEMA_VERSION, profileId: a.profileId, chapters: {}, runsCompleted: 0, revision: Math.max(a.revision, b.revision) + 1 };
  for (const id of new Set([...Object.keys(a.chapters), ...Object.keys(b.chapters)])) {
    const x = a.chapters[id] ?? { nodes: [], outcomes: [], completed: false, runIds: [] };
    const y = b.chapters[id] ?? { nodes: [], outcomes: [], completed: false, runIds: [] };
    out.chapters[id] = {
      nodes: [...new Set([...x.nodes, ...y.nodes])].sort(),
      outcomes: [...new Set([...x.outcomes, ...y.outcomes])].sort(),
      completed: x.completed || y.completed,
      runIds: [...new Set([...x.runIds, ...y.runIds])].sort(),
    };
  }
  // runsCompleted is a lower bound after a merge: two tabs may have finished different runs.
  out.runsCompleted = Math.max(a.runsCompleted, b.runsCompleted, 0);
  return out;
}

export function createStore({ profile, storage = globalThis.localStorage, now = () => new Date().toISOString() }) {
  const listeners = new Set();
  const onStorage = (e) => {
    if (!e.key) return;
    if (e.key.startsWith(`likeness.run.v2:${profile}:`) || e.key === discKey(profile))
      listeners.forEach((fn) => fn({ key: e.key, kind: e.key === discKey(profile) ? "discovery" : "run" }));
  };
  globalThis.addEventListener?.("storage", onStorage);

  function quarantine(key, raw, code) {
    const q = `${key}:quarantine:${Date.now()}`;
    storage.setItem(q, JSON.stringify({ code, raw }));
    return q;
  }

  return {
    profile,
    /** Subscribe to writes made by OTHER tabs (the storage event never fires in the writer). */
    onExternalChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    loadDiscovery() {
      const raw = storage.getItem(discKey(profile));
      if (!raw) return newDiscovery(profile);
      try {
        const d = JSON.parse(raw);
        if (d.schemaVersion !== DISCOVERY_SCHEMA_VERSION) throw new Error("version");
        return d;
      } catch {
        quarantine(discKey(profile), raw, "E_DISCOVERY");
        return newDiscovery(profile);
      }
    },

    /** Merge (never replace) discovery so concurrent tabs cannot erase each other's history. */
    async saveDiscovery(discovery) {
      return withLock(`likeness:${profile}:discovery`, () => {
        const merged = mergeDiscovery(this.loadDiscovery(), discovery);
        storage.setItem(discKey(profile), JSON.stringify(merged));
        return merged;
      });
    },

    /** Load a run slot. Returns { run } | { empty: true } | { error, quarantinedAs }. */
    loadRun(slot, graph) {
      const key = runKey(profile, slot);
      const raw = storage.getItem(key);
      if (raw == null) return { empty: true };
      try {
        const { run, migratedFrom } = deserialize(raw, graph);
        return { run, migratedFrom };
      } catch (e) {
        const code = e instanceof NarrativeError ? e.code : "E_UNKNOWN";
        return { error: code, quarantinedAs: quarantine(key, raw, code) };
      }
    },

    /**
     * Compare-and-swap save. expectedRevision is the revision this tab last loaded or saved
     * (null for a new slot). Throws NarrativeError E_CONFLICT if another tab moved the slot on.
     */
    async saveRun(slot, run, expectedRevision, graph) {
      const key = runKey(profile, slot);
      return withLock(`likeness:${profile}:${slot}`, () => {
        const raw = storage.getItem(key);
        let storedRev = null;
        if (raw != null) {
          try { storedRev = deserialize(raw, graph).run.revision; } catch { storedRev = "corrupt"; }
        }
        if (storedRev !== expectedRevision)
          throw new NarrativeError("E_CONFLICT", `slot ${slot} is at revision ${storedRev}, this tab expected ${expectedRevision}`, { storedRev, expectedRevision });
        storage.setItem(key, serialize({ run, discovery: null }, now()));
        return run.revision;
      });
    },

    exportRun(slot) { return storage.getItem(runKey(profile, slot)); },

    /** Import refuses to overwrite an existing slot (no silent clobber). */
    importRun(slot, text, graph) {
      const key = runKey(profile, slot);
      if (storage.getItem(key) != null) throw new NarrativeError("E_SLOT_TAKEN", `slot ${slot} is not empty`);
      const { run } = deserialize(text, graph);
      storage.setItem(key, text);
      return run;
    },

    dispose() { globalThis.removeEventListener?.("storage", onStorage); listeners.clear(); },
  };
}

export { mergeDiscovery };
