# Food Council: Tokyo — Audience pass 2026-05-30

## Ideal evangelist (one paragraph)

Hana, 31, software designer in Brooklyn, lapsed Japanese minor, flying into Haneda in 6 weeks. She is 2 months deep into r/JapanTravel and r/Tokyo, has a Google Doc with 40 copy-pasted "best Tokyo ramen" listicles she doesn't trust, and a Notion page of Tabelog screenshots in Japanese she half-understands. She already uses Tabelog Web (English) for scores, Google Maps for saved pins, and the Eater 38 Tokyo guide as a sanity check. She bounces a "Tokyo food guide" in 5 seconds if the hero is generic ("Discover Tokyo's best restaurants"), if there are no recognizable names above the fold (Jiro, Saito, Nakiryu, Den), if the score methodology is hidden, or if the saved list is a dead-end localStorage trap. She screenshots and shares when she can hand a friend a clean URL with her 12 saved spots grouped by neighborhood and pre-linked to Tabelog + Maps — because that's the artifact her group chat actually wants. The single share that brings her tribe back is a Reddit comment on r/JapanTravel: "Here is my 8-day Tokyo food list, grouped by area, with Tabelog + Maps for each: <link>."

## Ground-truth verdict

Live URL: https://food-council-tokyo.vercel.app/ (per index.html canonical + og tags). Could not WebFetch live in this run (tool denied). Repo state is the converged iter3: 163 real restaurants (verified spot-check: Jiro Ginza/3-star, Saito Roppongi/3-star, Nakiryu Sugamo/1-star ramen, Tsuta former-star, Tabelog scores 3.15-4.78 all <4.8). Trip is URL-shareable (?trip=ids), copy-as-text exports grouped-by-neighborhood with per-pick Maps + Tabelog links, filters are deep-linkable, no fabrication, no exposed keys. Build is clean. Data integrity is the strongest in the portfolio sweep.

## Prior pass — already done (do not repeat)

iter1: URL-encoded ?trip share, navigator.share + clipboard fallback, copy-as-text, per-restaurant Maps + Tabelog links, SavedListPanel grouped by neighborhood, filters deep-linked.
iter2: POV hero ("High Tabelog scores, under the tourist radar"), CuratedLists card grid above 163 grid, "How we score" demoted to expandable.
iter3: emoji Michelin badges replaced with inline SVG stars + BIB/PLATE pills, ScoreBadge restyled (paper + tiered color), pipe-divider cleaned, card padding p-4.

## Quick wins (shipped this pass)

1. Meta count truthful. index.html meta description + og:description both said "165 Tokyo restaurants" while the data ships 163. Anyone who lands from a shared link sees the right number; integrity matters more than launch-copy roundness.
2. Empty saved-state icon copy matches reality. SavedListPanel told users to "tap the bookmark icon on any card" but RestaurantCard's save icon is a heart. Switched copy to "tap the heart on any card" so the instruction points at the right glyph.
3. Copy-as-text now round-trips. buildTripText prepended with the actual shareable trip URL so a pasted Reddit/Notes export is also a way back into the exact filtered + saved view. The single most valuable artifact a trip planner hands their group chat is now self-contained.

## Bigger bets (flagged for Michael, not shipped)

- Dynamic per-trip OG image. Today, a shared ?trip= link uses the static og-image.png so the unfurl on iMessage/Twitter/Discord says nothing about the actual trip. The 10-star version renders the trip title ("Hana's Tokyo trip — 12 spots, 4 Michelin, 5 neighborhoods") into an OG card. This is the single highest-leverage growth move, but it requires a Vercel serverless function (the rest of the app is static Vite). Files to add: api/og.js (Satori or @vercel/og), index.html dynamic og tag injection or per-trip route. Effort M, deploy needed.
- Real per-restaurant food photography. PlaceholderImage is a 2-color CSS gradient; cards ship an unused photoSeed. The honesty landmine is real (generic stock can't imply a specific restaurant's dish). The right shape is a curated photo per restaurant (commissioned or licensed). Effort L, content op not a code op.
- Restaurant data refresh sweep. Red-team flagged minor location/star quibbles: Den at Jimbocho in data vs current Gaienmae location, Ryugin at Roppongi in data vs current Hibiya, Jiro 3-star in data vs Michelin dropping it 2020. None are fabrication; all are stale-since-launch. A single audit pass against current Michelin Guide + Tabelog pages would refresh confidence. Effort S per record, M overall, deploy needed.
- Save-icon unification. Cards use a heart, header uses a bookmark/ribbon, saved-state copy now says "heart." Cleaner to pick one (heart everywhere) so the affordance reads consistently. Effort S, deploy needed.
- "Pack me a starter trip" CTA. New users see 10 curated-list cards but no obvious way to one-tap-build a trip. A "Build me a first-timer trip" button that pre-saves the 7 spots from the "First Time in Tokyo" list, then opens the trip panel, would turn a browse session into a share-ready artifact in 1 click. Effort S, deploy needed.

## Items deliberately not done

- Restaurant location / Michelin corrections. Without a verified current source loaded in this session, editing real-entity data would risk introducing new errors. Better as a deliberate audit pass with the live Michelin Guide + Tabelog open. Flagged above.
- Photography. Honesty landmine + content op, not a quick win.
- Dynamic OG. Requires deploy + serverless and the rest of the app is static; out of scope for an additive code-only pass.
