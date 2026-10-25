// Shared registry — the single source of truth the site reads, mirrored from the
// OVS handoff CSV registries (character/narrative/level/mechanics/asset).
// Per the Production Bible V001: the site and the game speak the same language,
// matching IDs, so content can expand without losing identity.

export const NORTH_STAR = {
  project: "LIKENESS : THE GAME",
  studio: "Omnia Vanitas Studios",
  tagline: "A room for two. A night for four.",
  line: "The room remembers what love edits out.",
  promise:
    "You are inside a room that knows the argument better than you do. Every object remembers a different version of the relationship — and your own memory might be the edited copy.",
  setting: "The Dellwood motel · Room 14",
};

// ---- Audience intake — the follow / wishlist call-to-action. -----------------
// ONE place to control the site-wide CTA. Fill a value to activate that channel
// everywhere; leave it "" to hide it. Because the site is a static export,
// `newsletterAction` must be a form POST endpoint (e.g. a Formspree or
// Buttondown URL) for email capture to actually submit.
export const INTAKE = {
  // "https://store.steampowered.com/app/XXXXXX/" → "Wishlist on Steam"
  steam: "",
  // "https://discord.gg/XXXXXXX" → "Join the Discord"
  discord: "",
  // form POST endpoint, e.g. "https://formspree.io/f/xxxxxxx" → email signup
  newsletterAction: "",
  // Dev-follow — live today; the low-friction way to follow the build.
  github: "https://github.com/bthoreau88/likeness-universe",
};


// ---- Characters (character_registry.csv) ----
export type Character = {
  id: string;
  name: string;
  role: string;
  status: string;
  identityLock: string;
  driftRisk: string;
  image?: string;
  isDouble?: boolean;
};

export const CHARACTERS: Character[] = [
  {
    id: "CHR_THOREAU_001",
    name: "THOREAU",
    role: "Player · Witness · Unreliable memory carrier",
    status: "REF_IN_PROGRESS",
    identityLock:
      "Black man, early 30s, medium-deep warm brown skin, round gold glasses, mustache and goatee, guarded intelligent presence.",
    driftRisk:
      "Generic AI face, age shift, missing glasses, incorrect facial hair, over-glamorization.",
    image: "/stills/thoreau-portrait-clean.png",
  },
  {
    id: "CHR_DRYA_001",
    name: "DRYA",
    role: "Relationship anchor · Contradiction source · Double compare",
    status: "REF_IN_PROGRESS",
    identityLock:
      "Black woman, late 20s, warm medium-brown skin, dancer body language, jewelry and piercing detail, guarded emotional force.",
    driftRisk: "Generic glamour model, body-type drift, victim-only staging.",
    image: "/stills/drya-close.png",
  },
  {
    id: "CHR_DARK_THOREAU_001",
    name: "DARK THOREAU",
    role: "The double · Embodied contradiction",
    status: "IDEA",
    identityLock:
      "Same identity as THOREAU — wrong timing, posture, gaze, breath, and response delay only.",
    driftRisk:
      "Monster redesign, gore-first escalation, losing the recognizable base identity.",
    image: "/stills/the-other.png",
    isDouble: true,
  },
];

// ---- Street subjects (exterior-cam face-lock — the /street cast) ----
// Strangers the exterior cameras flag against the two locked identities. High
// matches resolve to a registry character (the doubles); low matches are just
// the block wearing a borrowed gait.
export type StreetSubject = {
  code: string;
  name: string;
  image: string;
  loc: string;
  matchNum: number; // face-lock confidence, 0–100
  note: string;
  character?: string; // linked CHARACTERS id when the match resolves
  double?: boolean;
};

export const STREET_SUBJECTS: StreetSubject[] = [
  {
    code: "EXT-01",
    name: "THE COMMUTER",
    image: "/stills/thoreau-watching.png",
    loc: "BUS SHELTER · SB",
    matchNum: 31,
    note: "Waits for a bus whose route no longer runs. Reads the same page for an hour.",
  },
  {
    code: "EXT-02",
    name: "THE NEIGHBOR",
    image: "/stills/drya-over-shoulder.png",
    loc: "OPP. OFFICE · WINDOW",
    matchNum: 44,
    note: "Draws the curtain when the sign flickers. Draws it again a second later.",
  },
  {
    code: "EXT-03",
    name: "THE PASSERBY",
    image: "/stills/thoreau-stealth.png",
    loc: "PARKING APRON · N",
    matchNum: 62,
    note: "Crosses against the light without looking. The gait is borrowed from the lobby footage.",
  },
  {
    code: "EXT-04",
    name: "SUBJECT — THOREAU",
    image: "/subjects/thoreau-portrait.png",
    loc: "STOREFRONT GLASS",
    matchNum: 97,
    note: "You, an hour before you arrived. The timestamp disagrees. So does the reflection.",
    character: "CHR_THOREAU_001",
    double: true,
  },
  {
    code: "EXT-05",
    name: "SUBJECT — DRYA",
    image: "/subjects/drya-select.png",
    loc: "CROSSWALK · E",
    matchNum: 95,
    note: "Turns toward the camera the instant before it turns to her. Knows the pass count.",
    character: "CHR_DRYA_001",
    double: true,
  },
  {
    code: "EXT-06",
    name: "THE OTHER",
    image: "/stills/the-other.png",
    loc: "END OF THE BLOCK",
    matchNum: 99.8,
    note: "Same face, wrong delay. Stops when you stop. Is already walking back toward the door.",
    character: "CHR_DARK_THOREAU_001",
    double: true,
  },
];

// Street sightings that resolve to a given character id.
export const streetSightingsFor = (characterId: string): StreetSubject[] =>
  STREET_SUBJECTS.filter((s) => s.character === characterId);

// ---- Inspectable evidence (asset_manifest.csv + § 10 vertical slice) ----
export type Evidence = {
  id: string;
  name: string;
  status: string;
  qc: string;
  image?: string;
  tone?: "key" | "study" | "tape" | "mirror" | "door";
  note: string;
};

export const EVIDENCE: Evidence[] = [
  {
    id: "PROP_KEY14_001",
    name: "Brass Motel Key 14",
    status: "IDEA",
    qc: "Must read as old brass, not shiny gold.",
    image: "/stills/key-14.png",
    note: "The key that opens the room that opens everything. A black diamond tag, the number worn soft.",
  },
  {
    id: "PROP_LOCKET_001",
    name: "Locket Tintype",
    status: "IDEA",
    qc: "High-detail close-inspect asset.",
    tone: "study",
    note: "A tintype the room keeps re-cropping. The two faces inside don't always agree on who was happy.",
  },
  {
    id: "PROP_TAPE_001",
    name: "Tape 03",
    status: "IDEA",
    qc: "Reads as worn consumer cassette; playback rewrites room state.",
    image: "/stills/three-tapes.png",
    note: "Recorded truth that turns out unreliable. Play it and the room edits itself behind you.",
  },
  {
    id: "PROP_MIRROR_001",
    name: "Bathroom Mirror",
    status: "IDEA",
    qc: "Reflection lag must read clearly — no cheap jump scare.",
    image: "/stills/thoreau-mirror.png",
    note: "The reflection answers late. Your eyes are open; the reflected ones are still closed, mid-word.",
  },
  {
    id: "PROP_DEVICE_001",
    name: "The Black Device",
    status: "IDEA",
    qc: "Purposeful, never explained outright. No sci-fi UI gloss.",
    tone: "door",
    note: "Cold to the touch and warm where it shouldn't be. It is listening, and it is not on your side.",
  },
];

// ---- Narrative beats (narrative_beats.csv) ----
export type Beat = {
  id: string;
  name: string;
  status: string;
  characters: string[];
  trigger: string;
  roomState: string;
  webUnlock: string;
};

export const BEATS: Beat[] = [
  {
    id: "BEAT_ARRIVAL_001",
    name: "Arrival at Room 14",
    status: "IDEA",
    characters: ["THOREAU"],
    trigger: "Player enters the room",
    roomState: "STATE_00 · NORMAL",
    webUnlock: "/evidence",
  },
  {
    id: "BEAT_ARGUMENT_RESIDUE_001",
    name: "Argument Residue",
    status: "IDEA",
    characters: ["THOREAU", "DRYA"],
    trigger: "Inspect the locket or the coffee",
    roomState: "STATE_01 · RESIDUE",
    webUnlock: "/evidence",
  },
  {
    id: "BEAT_MIRROR_LAG_001",
    name: "The Mirror Answers Late",
    status: "IDEA",
    characters: ["THOREAU", "DARK THOREAU"],
    trigger: "Inspect the bathroom mirror",
    roomState: "STATE_02 · MIRROR LAG",
    webUnlock: "/tapes",
  },
  {
    id: "BEAT_TAPE_CONTRADICTION_001",
    name: "Tape Contradiction",
    status: "IDEA",
    characters: ["THOREAU", "DRYA"],
    trigger: "Play the tape",
    roomState: "STATE_04 · TAPE CONTRADICTION",
    webUnlock: "/tapes",
  },
  {
    id: "BEAT_DOUBLE_OCCUPANCY_001",
    name: "Double Occupancy",
    status: "IDEA",
    characters: ["THOREAU", "DRYA", "DARK THOREAU"],
    trigger: "The lamp goes out after the tape",
    roomState: "STATE_05 · DOUBLE OCCUPANCY",
    webUnlock: "/characters",
  },
  {
    id: "BEAT_FINAL_MEMORY_LOCK_001",
    name: "Final Memory Lock",
    status: "IDEA",
    characters: ["THOREAU", "DRYA"],
    trigger: "Sign the ledger",
    roomState: "STATE_06 · MEMORY LOCK",
    webUnlock: "/motel",
  },
];

// ---- Story architecture (§ 07) — the six-beat arc ----
export const ARC: { beat: string; fn: string; game: string }[] = [
  { beat: "Arrival", fn: "Ground the player in Room 14", game: "Key, desk bell, hallway, normal lighting." },
  { beat: "Residue", fn: "Expose emotional history", game: "Objects unlock conflicting memories." },
  { beat: "Mirror Lag", fn: "Introduce identity instability", game: "Reflection timing contradicts player action." },
  { beat: "Tape Contradiction", fn: "Show recorded truth as unreliable", game: "Tape playback rewrites room state." },
  { beat: "Double Occupancy", fn: "Reveal body/voice mismatch", game: "Dark variant appears through posture and timing." },
  { beat: "Final Memory Lock", fn: "Choose what evidence to believe", game: "End-of-slice title card and web unlock." },
];

// ---- Locations (level_registry.csv) ----
export type Level = {
  id: string;
  name: string;
  route: string;
  status: string;
  storyFunction: string;
};

export const LEVELS: Level[] = [
  {
    id: "LOC_DELLWOOD_ROOM14_001",
    name: "Room 14",
    route: "/room-14",
    status: "IDEA",
    storyFunction: "Primary chamber. The argument loop and the identity fracture.",
  },
  {
    id: "LOC_DELLWOOD_HALLWAY_001",
    name: "Dellwood Hallway",
    route: "/motel",
    status: "IDEA",
    storyFunction: "Threshold, repetition, impossible doors.",
  },
  {
    id: "LOC_DELLWOOD_OFFICE_001",
    name: "Front Office",
    route: "/motel",
    status: "IDEA",
    storyFunction: "Ledger, key exchange, the arrival ritual.",
  },
];

// ---- Companion route map (§ 15 Three.js architecture) ----
export type Route = { route: string; label: string; fn: string; live: boolean };

export const ROUTES: Route[] = [
  { route: "/universe", label: "Landing", fn: "OVS hierarchy and current campaign title.", live: true },
  { route: "/studio", label: "Studio", fn: "The Omnia Vanitas doctrine, anthology, and north star.", live: true },
  { route: "/characters", label: "Characters", fn: "Identity cards and doubles.", live: true },
  { route: "/evidence", label: "Evidence", fn: "The inspectable object timeline.", live: true },
  { route: "/tapes", label: "Tapes", fn: "Tape archive and unlock state.", live: true },
  { route: "/motel", label: "Motel Map", fn: "Interactive Dellwood map and hidden rooms.", live: true },
  { route: "/street", label: "The Street", fn: "The exterior sweep — street cast and doubles outside Room 14.", live: true },
  { route: "/wardrobe", label: "Wardrobe", fn: "The motel-noir lookbook — identity-locked costume department.", live: true },
  { route: "/score", label: "Score", fn: "Room tone as music — the sound archive and cue list.", live: true },
  { route: "/journey", label: "Journey", fn: "A scroll-driven journey of Tape 03 through five rooms.", live: true },
  { route: "/devlog", label: "Devlog", fn: "Production notes and expansion modules.", live: true },
  { route: "/room-14", label: "Room 14", fn: "Explorable 3D chamber with inspectable objects.", live: true },
];

// ---- Expansion modules (expansion_registry.csv · V002) ----
export type Expansion = {
  id: string;
  name: string;
  category: string;
  use: string;
  status: string;
  gate: string;
};

export const EXPANSIONS: Expansion[] = [
  {
    id: "EXP_ASSET_SOURCING",
    name: "Asset sourcing and adaptation",
    category: "production planning",
    use: "Reuse approved assets, compare free and paid sources, and reserve custom work for identity and story details.",
    status: "PLAN READY",
    gate: "Per-asset rights · total cost · target-specific import proof. No acquisitions yet.",
  },
  {
    id: "EXP_BLENDER_INTERCHANGE",
    name: "Blender interchange",
    category: "asset preparation",
    use: "Prepare a shared prop for web and Unreal with measured scale, materials, pivots, and traceable derivatives.",
    status: "PROOF PENDING",
    gate: "Staged source · GLB/FBX import checks · screenshots · manifest entry.",
  },
  {
    id: "EXP_UNREAL_EVENT_PROOF",
    name: "Room 14 event proof",
    category: "game integration",
    use: "Prove one inspect interaction, one evidence item, and a matching companion recap before expanding the room.",
    status: "PROOF PENDING",
    gate: "Versioned event · replay check · packaged build · measured performance.",
  },
  {
    id: "EXP_IMAGE_BLASTER",
    name: "Image-Blaster",
    category: "image-to-world",
    use: "Rapid environment prototypes — meshes, splats, ambience from a single image.",
    status: "OPTIONAL",
    gate: "Story fit · collision · scale · performance · source note.",
  },
  {
    id: "EXP_NANOGS",
    name: "Nano Gaussian Splatting",
    category: "unreal rendering",
    use: "Large splat-rendering pilot for captured / generated static environments in UE5.",
    status: "TECHNICAL PILOT",
    gate: "UE compatibility · FPS · VRAM · ghosting · collision mesh.",
  },
  {
    id: "EXP_HIGGSFIELD",
    name: "Higgsfield Claude Skills",
    category: "campaign / reference",
    use: "Social hooks, motion reference, fashion lookbook, music-video prompt workflows.",
    status: "MARKETING / REF",
    gate: "OVS visual DNA · identity lock · confirmation before generation.",
  },
  {
    id: "EXP_UE_GUIDE",
    name: "Unreal Engine Guide",
    category: "learning / reference",
    use: "UE checklist, study roadmap, and feature mapping for production problems.",
    status: "REFERENCE ONLY",
    gate: "Must solve a named LIKENESS production problem.",
  },
];

// ---- Devlog — real build sessions on this companion site ----
export type LogEntry = { tag: string; title: string; body: string };

export const DEVLOG: LogEntry[] = [
  {
    tag: "PIPELINE",
    title: "A shared production path",
    body: "Added a source-first workflow for new material, agent handoffs, asset sourcing, Blender preparation, and Unreal integration. The next proof is one Room 14 interaction; engine work and further uploads remain pending.",
  },
  {
    tag: "UNIVERSE",
    title: "Anthology restructure + cohesion pass",
    body: "Established the LIKENESS UNIVERSE as the umbrella: LIKENESS : THE GAME (Dellwood motel) as the flagship and TAPE 03 (the apartment) as a canonical tape, each tagged. Added a press fact sheet and quarantined the early sci-fi cut to a non-canon /alt page.",
  },
  {
    tag: "COMPANION",
    title: "Data-driven routes online",
    body: "Characters, Evidence, Tapes, and the Motel Map now read from the shared registry (src/lib/registry.ts), mirroring the game's CSV registries. Matching IDs across site and game; content expands without losing identity.",
  },
  {
    tag: "CANON",
    title: "Recharacterized to the LIKENESS world",
    body: "Stripped the generic sci-fi framing; rebuilt the front-of-site around THOREAU, DRYA, the double, the tapes, and the room that testifies. Visual DNA, color matrix, camera law, and the eight-beat architecture are all on the page.",
  },
  {
    tag: "ARCHIVE",
    title: "Real captures placed",
    body: "~35 in-engine frames threaded into Captured, the Apartment room tour, Identity Lock sheets, Recovered Footage, Evidence macros, the Choice closing band, and two motion clips. Authored atmosphere fills the frames still to shoot.",
  },
  {
    tag: "ENTRY",
    title: "Universe landing built",
    body: "A full-screen, mouse-scrub video entry (move to scrub the room), typewriter archive interface, and pill navigation — recustomized from the Mainframe interaction spec into the OVS dark cinematic system.",
  },
  {
    tag: "EXPANSION",
    title: "V002 modules registered",
    body: "Image-Blaster, NanoGS, Higgsfield, and the UE Guide logged as optional accelerators. Per the Expansion Law: they prototype, enrich, test, and market — they do not replace the authored story or the locked identities.",
  },
];

// ---- Phase build plan (§ 14) ----
export const PHASES: { n: string; action: string; done: boolean }[] = [
  { n: "0", action: "Preflight repo, docs, registries, web foundation", done: true },
  { n: "1", action: "Lock vertical-slice scope and task board", done: false },
  { n: "9", action: "Three.js companion alpha — routes load from shared JSON", done: true },
  { n: "10", action: "Lock the vertical slice — build, QA, captures, handoff", done: false },
];

// ---- The anthology · LIKENESS UNIVERSE works (§ 02 "open motel multiverse") ----
// One umbrella, distinct artifacts. The motel game is the flagship; TAPE 03 is a
// canonical tape/film; fashion + music are threads to come.
export type Work = {
  id: string;
  title: string;
  kind: "GAME" | "TAPE" | "THREAD";
  status: string;
  setting: string;
  blurb: string;
  route?: string;
};

export const WORKS: Work[] = [
  {
    id: "WORK_LIKENESS_GAME",
    title: "LIKENESS : THE GAME",
    kind: "GAME",
    status: "IN DEVELOPMENT",
    setting: "The Dellwood motel · Room 14",
    blurb: "The flagship. A psychological romantic horror where a motel room behaves like a memory editor. THOREAU and DRYA, the argument, and the double who answers for them.",
    route: "/room-14",
  },
  {
    id: "WORK_TAPE_03",
    title: "TAPE 03",
    kind: "TAPE",
    status: "BIBLE LOCKED",
    setting: "The apartment · 3:14 AM",
    blurb: "A recovered tape within the universe. A man wakes with a wound, a camcorder, and no memory of forty-eight hours. The apartment rearranges; a voice that is his own is already inside.",
    route: "/room-testifies",
  },
  {
    id: "WORK_OVS_FASHION",
    title: "OVS · Wardrobe",
    kind: "THREAD",
    status: "LOOKBOOK LIVE",
    setting: "Motel-noir lookbook",
    blurb: "The wardrobe language of the universe — lived-in, restrained, identity-locked. A fashion thread, not a model shoot.",
    route: "/wardrobe",
  },
  {
    id: "WORK_OVS_MUSIC",
    title: "OVS · Score",
    kind: "THREAD",
    status: "SOUND ARCHIVE",
    setting: "Room tone as music",
    blurb: "Tape hiss, fluorescent hum, a detuned piano under a drone. The sound archive the rooms are scored from.",
    route: "/score",
  },
];

// ---- Alternate cut — the discarded sci-fi direction (NON-CANON, quarantined) ----
export type AltFrame = { img: string; label: string; note: string };

export const ALT_FRAMES: AltFrame[] = [
  {
    img: "/stills/drya-main-menu.png",
    label: "MAIN MENU · OVS LAB",
    note: "A diegetic menu inside an OVS facility — the sci-fi framing the bible later retired.",
  },
  {
    img: "/stills/drya-customization.png",
    label: "BIOMECH LOADOUT",
    note: "Arm-configuration screen. The augment-as-mechanic idea, replaced by tape + memory.",
  },
  {
    img: "/stills/drya-corridor.png",
    label: "WET CORRIDOR · ARM ONLINE",
    note: "DRYA with a cybernetic arm in a flooded passage. Off the motel-noir line.",
  },
  {
    img: "/stills/drya-atrium.png",
    label: "ROOM 14 ATRIUM · RESONANCE",
    note: "An open-interior gameplay moment with the biomech arm — a louder game than LIKENESS became.",
  },
  {
    img: "/stills/open-world-city.png",
    label: "THE CITY · MARTIAL LAW",
    note: "The abandoned open-world expansion. LIKENESS locked to one location instead.",
  },
];
