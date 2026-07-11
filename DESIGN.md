# DESIGN.md - Food Council: Tokyo (source of truth)

Build skills honor this document. Core concept and name are fixed: a curated, scored guide to 163 real Tokyo restaurants with a shareable saved-trip artifact. Do not re-architect; the app converged over prior passes (V2 panel 5/5). This relaunch is polish, X-readiness, and data-honesty hardening.

## Layout / IA intent

Single-page Vite + React SPA, editorial paper aesthetic (see BRAND.md tokens in src/index.css).

1. **Header**: wordmark, trip counter (heart + count), Share. Sticky, hairline border.
2. **Hero**: POV statement ("High Tabelog scores, under the tourist radar"), 1-tap "Build me a first-timer trip" CTA when trip is empty, "How we score" expandable. Keep; do not genericize.
3. **Curated lists grid**: named lists (First Time in Tokyo, Hidden Gems, The Ramen Circuit, Date Night...) each with a 1-tap "Save these to my trip." This is the browse on-ramp; it stays above the full grid.
4. **FilterBar + 163-card grid**: neighborhood, cuisine, price, Michelin filters, all deep-linked in the URL.
5. **DetailPanel** (slide-over): scores by source, Tabelog + Google Maps links, save heart.
6. **SavedListPanel** (slide-over): picks grouped by neighborhood, share URL, copy-as-text export with per-pick Maps + Tabelog links.

IA rule: every state is a URL. Filters, active list, and ?trip= are already deep-linked; never regress this.

## Hero / landing concept

The landing must pass Hana's 5-second audit: POV headline, recognizable anchor names visible without scrolling (surface a "council picks" strip or ensure the first curated list shows Saito / Nakiryu / Den class names), and methodology 1 tap away. The hero is a magazine cover for a data product: big serif claim, exact count (163), source chips (Tabelog + Michelin + Google + editorial), 1 vermilion CTA. No photography in the hero; typography and data are the visual.

## Key screens list

1. Landing (hero + curated lists + grid) - default and empty-trip state
2. Filtered grid state (e.g. ?neighborhood=Shibuya&cuisine=Ramen) - shareable
3. Restaurant DetailPanel open
4. SavedListPanel with 8 to 12 picks grouped by neighborhood - the money screen
5. Shared-trip landing (arriving via ?trip=...) - must immediately show the received trip, with a clear "save a copy / start browsing" path, not a cold default landing
6. Curated list active state with "Save these to my trip" banner

## Empty / loading / error state intent

- **Empty trip**: SavedListPanel already instructs "tap the heart on any card"; keep the instruction pointing at the real glyph, and offer the first-timer starter CTA here too.
- **Loading**: data is bundled (no network fetch), so there is no data-loading state to design; keep first paint instant and never add a spinner or skeleton theater for local data.
- **Error / edge**: malformed or empty ?trip= param must fail soft: ignore invalid ids, render whatever resolves, never a blank screen or crash. Filter combinations with 0 results get an honest "0 match" state with a 1-tap clear-filters action, in council voice, no sad-face illustration.

## Metadata / OG intent (X-readiness mandatory)

Current state: index.html has full OG + Twitter summary_large_image tags pointing at static /og-image.png, canonical set, honest 163 count. Baseline is X-ready.

Relaunch requirements:
1. **og-image.png must be a designed card**, on-brand (paper, Playfair, vermilion seal, "163 Tokyo restaurants, scored" + source logos as text). Audit the current PNG against BRAND.md; regenerate if it reads generic.
2. Title/description stay exact-count honest. og:title may sharpen to the positioning line ("Food Council: Tokyo - 163 restaurants, scored like locals score them").
3. **Dynamic per-trip OG image is the carried-forward bigger bet** (requires api/og.js Vercel serverless fn on an otherwise static app; effort M). Until it ships, shared ?trip= links unfurl with the static card. That is acceptable for launch; do not fake it.
4. No SSR: the page is client-rendered, so all social metadata must live in static index.html. Any per-state metadata claims beyond that require the serverless route first.

## Data honesty (mandatory disclosure)

The product claims real data. The claim is **substantially true**: 163 real restaurants with real Tabelog / Michelin / Google scores, integrity verified in prior passes (scores spot-checked plausible, no fabrication, sources named, weighting formula published). However, 3 known stale facts must be handled before or at launch:

1. **Sukiyabashi Jiro is carried at 3 Michelin stars; Michelin delisted it from the guide in 2020** (reservation policy). Fix the record or annotate it.
2. **Den**: data says Jimbocho; current location is Gaienmae.
3. **Ryugin**: data says Roppongi; current location is Hibiya.

Policy: run the deliberate audit pass with live Michelin Guide + Tabelog open (do not hand-edit real-entity records from memory). Until corrected, ship a visible "scores and details verified as of [date]" line near "How we score." Placeholder gradient images are honest as-is (they do not impersonate real dishes); never swap in generic stock photography implying specific restaurants.

Deploy state (verified against the live bundle 2026-07-11): the live Vercel build includes everything through f27c2b7 (POV hero, 163 count in meta, SVG Michelin badges, share polish, first-timer trip CTA, static og-image.png serving at 200). Only HEAD ba3d78c (per-curated-list "Save these to my trip" CTA + heart save-icon unification) is undeployed. 1 deploy closes the gap (deploy is out of scope for planning agents; flag only).

## The screenshot-worthy moment to engineer

**The trip artifact.** SavedListPanel with a named 12-spot trip, grouped under neighborhood headers, Michelin gold badges and Tabelog scores visible, share button prominent. Engineer this panel to look composed at iPhone screenshot aspect ratio: tight header ("My Tokyo trip - 12 spots, 4 Michelin stars, 5 neighborhoods" style summary line), no dangling half-rows, brand wordmark subtly present so screenshots self-attribute. The companion moment is the pasted copy-as-text export in a Reddit comment that round-trips via its embedded URL; keep that export clean, plain-text, and self-contained. When the dynamic OG bet lands, the unfurl of a ?trip= link becomes the primary share surface; design the OG card layout now (title, counts, neighborhood list) so the serverless fn has a spec to hit.
