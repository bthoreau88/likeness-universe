# Public-domain, free and paid asset layer

## Decision rule

Reuse existing approved assets first; search public-domain/CC0 next; evaluate other free licenses and paid candidates; adapt or create only when the available option fails story, identity, technical or total-cost requirements. Expensive to buy does not automatically mean cheaper to make.

```text
source_total = price + (search + cleanup + integration + review hours) * internal_hourly_rate
custom_total = (reference + modeling + material + rig + iteration + integration hours) * internal_hourly_rate
```

Include subscription duration, seats, engine compatibility, attribution, redistribution and derivative limitations, and expected repair risk. Example planning assumptions only: at $30/hour, a $40 prop needing 2 hours costs $100; a free prop needing 5 hours costs $150; a custom prop needing 8 hours costs $240. Replace estimates with actual timed trial results. A 30-minute search timebox is an initial production policy, not a market claim.

## Shortlist lanes (checked 2026-10-22)

| Lane | Source | First LIKENESS use | Required check |
|---|---|---|---|
| Public-domain / CC0 | [Poly Haven](https://polyhaven.com/) | neutral HDRIs, rough wall/floor materials, generic furniture | [Official FAQ](https://docs.polyhaven.com/en/faq); record exact asset URL/hash; CC0 asset scope, not site logos |
| Public-domain / CC0 | [ambientCG](https://ambientcg.com/) | carpet, plaster, concrete, tile | [License](https://docs.ambientcg.com/license/); select exact maps/resolution; no invented asset entitlement |
| Public-domain / CC0 | [Kenney](https://kenney.nl/assets) | blockout props, input prompts, provisional UI sounds | [Support/license](https://kenney.nl/support); useful for prototype, not a photoreal final-art promise |
| Free, license varies | [Freesound](https://freesound.org/) | HVAC, room tone, mechanical transients | [FAQ/license](https://freesound.org/help/faq/); each recording differs; prefer CC0 or suitable CC-BY; do not assume noncommercial files work for a commercial game |
| Free or paid, listing-specific | [Fab](https://www.fab.com/) | modular motel pieces, vintage prop shells, animation candidates | [EULA](https://www.fab.com/eula); record exact listing, tier, entitlement, supported engine and download formats |
| Owned / original | existing OVS media and recordings | story tape, character performance, unique evidence details | Verify source authority, consent and intended use; prior possession is not proof of third-party rights |

These are sourcing channels, not acquired assets. No prices, ownership, compatibility or full-project savings are asserted. See `../../data/production/asset-plan.json` for per-item decisions, all still candidates. No purchases or paid generations are authorized by this plan alone.

## Distribution lanes

- **Public site/repo**: only originals or third-party derivatives explicitly permitted for this downloadable use. A GLB in `public/` is accessible to visitors; hiding its link does not protect it.
- **Free licensed assets**: free is a price, not a rights category. Record attribution and restrictions per file.
- **Paid/restricted source**: keep acquisition proofs and originals in access-controlled storage. Public repo stores a sanitized source/license record and permitted captures only. Fab's standard license permits incorporated projects, but prohibits standalone resale/redistribution. Do not commit source meshes to this public repository.
- **Runtime game**: cook/package assets according to the acquired license; approval for a cooked game does not automatically allow redistributing raw files as a web demo.

For each acquired asset capture provider, listing ID/URL, author, license/version and retrieval date, exact downloaded file hash, attribution, commercial use, web/source distribution, engine/platform restrictions, price/currency and private receipt location. Unknown rights stay `unverified`; candidates cannot be promoted as approved.

## What to author

Reserve custom work for identity-critical faces and performance, impossible room geometry, evidence details whose wording or silhouette matters, and bespoke mirror/tape behavior. Buy or adapt mundane furniture/materials when their total cost wins. Do not generate every prop, buy a giant pack to use one item, or invest in final art before the inspect loop works.

## Asset acceptance

Source candidate -> recorded license -> staged cleanup -> Blender QC -> engine/web import test -> manifest entry -> approved target-specific promotion. Keep acquisition status, rights status and technical QC separate. Every accepted derivative retains source lineage; no candidate entry silently becomes `ENGINE_READY`.
