# LIKENESS — the Room 14 short (V01)

**OVS OS · LIKENESS : UNIVERSE · FILM REGISTRATION · 2026-11-05**
Source: `OVS_LIKENESS_BIBLE_V01_2026` (Project Bible V01, 29 pp.), written and directed by Brandon Thoreau.

## Status

**REGISTERED / PRE-PRODUCTION / NOT YET RECONCILED.**

- This is the first LIKENESS : UNIVERSE film. Brandon wrote it before the heavy work on
  LIKENESS : SECOND HAND, and he wants it made.
- Brandon says this film is closely connected to **LIKENESS : SKIN OF ANOTHER**. The repo
  doesn't yet record *how* they connect (see "Open founder questions").
- This branch registers the film so it isn't lost. It doesn't change any existing canon, any
  locked screenplay (SECOND HAND V008), any game gate (G02, GL-16/17/18) or the site.
- **Zero paid generation is authorized** by this registration.

## Logline

Stranded in a motel on a rainy night, a couple begins to see dark versions of each other —
perfectly familiar, impossibly honest — and the doubles won't stop until each of them looks
at the thing they've been refusing to see about themselves.

## Premise (short)

A two-hour drive that has taken five. The only light is the sign for **The Dellwood**, a
motel that's on no map. They take **Room 14**. The room is wrong in ways that don't announce
themselves: too quiet when the rain stops, a layout that doesn't match itself, a bathroom
mirror that reflects the room half a second late. After midnight each of them starts to
see the other one *wrong*: same face, same gait, saying the thing the real person has
avoided. The doubles don't threaten. They are the person you love with nothing left to
protect.

- **Cast:** THOREAU (the one who manages things) and DRYA (the one who reads the room), plus
  each one's dark double.
- **Location:** one location, Room 14 at the Dellwood, with sub-spaces: main room, kitchen,
  bathroom, hallway.
- **Shape:** ten shots, about 88 seconds plus a title card. The film's only score arrives in
  the last shot.
- **DNA:** Serling × Aronofsky × Hitchcock × Lynch. It shifts tone from VIGIL (restrained grief)
  and ESTATE (dark comedy) to psychological fracture, with intimacy as the threat.
- **End:** the empty room. The rain starts again.

## What's in this folder

| File | What it holds |
|---|---|
| [`PRODUCTION_PACKAGE.md`](PRODUCTION_PACKAGE.md) | The bible's production content, carried over faithfully: visual DNA lock, identity locks, location lock, 10-shot skeleton, all ten master shot prompts, the doubles grammar, and what's still needed |
| [`CANON_COLLISIONS.md`](CANON_COLLISIONS.md) | Where this film disagrees with what the repo already holds (Room 14 geometry, the doubles' truth layer, the mirror rule, identity locks, the tool versions). **Read this before generating anything.** |
| [`film.json`](film.json) | A machine-readable pointer: IDs, status, sources, gates |

### Held out of this public repo on purpose

`likeness-universe` is a **public** repository. Two things stay out of it until Brandon says
otherwise:

1. **The Unseen Twist** (bible §01, marked *DIRECTOR EYES ONLY*). It explains what the dark
   doubles actually are. It lives only in the source PDF. If it's committed here, it's public
   in git history for good.
2. **The source PDF itself**, because it contains the twist. Store it in a private location
   (for example `ovs-likeness-room14`, which is private) or in Drive.

The ten shot prompts don't reveal the twist and are carried over in full.

## Lineage

| Film | Relationship (as recorded) |
|---|---|
| LIKENESS (this film, V01) | The first LIKENESS : UNIVERSE film |
| LIKENESS : SKIN OF ANOTHER | "Closely connected," per Brandon (2026-11-05). An approved 4K sequence archive exists off-repo (`LIKENESS_SKIN_OF_ANOTHER_APPROVED_4K_SEQUENCE_V001.zip`, Drive, 2026-08-23). The nature of the connection is **not defined yet** |
| LIKENESS : SECOND HAND | Later. Its V008 ends at the Dellwood Motel, pigeonhole 14, 2:11 a.m. That shared location needs a ruling (see collisions) |
| LIKENESS : THE GAME ("A Night for Four") | Shares the Dellwood, Room 14, THOREAU, DRYA and a dark Thoreau, but with a **different truth layer**. See collisions C2 and C3 |

## Open founder questions

1. **SKIN OF ANOTHER:** is it a sequel, a prequel, the same night from another angle, the
   doubles' side of the story, or a sibling film that shares the doubles grammar? Which
   elements does it inherit (cast, Room 14, the twist)?
2. **Canon ruling:** does this film's Room 14 sit in the *same* continuity as the game and
   SECOND HAND, or is it its own continuity (an elseworld, as THE OBSERVERS is)? Every
   collision in `CANON_COLLISIONS.md` follows from this one answer.
3. **Stills provenance:** the bible locks both leads and the location "from the production
   stills" (Images 1–10). Those stills aren't in any repo. Who and what do they depict, and
   is a likeness/rights record on file for DRYA's reference under the Character Reference
   Pack rights gate?
4. **The twist:** should it stay off the public repo (the default) or be committed?

## Next gate

**G01 — Founder reconciliation.** Brandon rules on the four questions above and on each row
of `CANON_COLLISIONS.md`. Nothing moves to generation until then.

After G01: generate the two missing references (`OVS_LIKENESS_ENV_ROOM14WIDE_V01_2026`,
`OVS_LIKENESS_ENV_MIRROR_V01_2026`); port the shot prompts to the current Higgsfield /
Seedance 2.5 grammar (the bible's prompts target Seedance 2.0 and Kling 3.0); then run a
480p scout of Shot 05 (the key shot) before any paid full-resolution run.
