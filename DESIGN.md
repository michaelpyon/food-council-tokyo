# Food Council: Tokyo design source of truth

The current product contract is the Verified 28 release. It supersedes the prior scored 163-record concept.

Canonical design context lives in `.impeccable.md`. Canonical product data lives in `data-audit/normalized/publishable-restaurants.json`.

## Information architecture

1. Sticky header with search, live result count, and My Trip.
2. Left-aligned verification hero with exact audit counts and methodology.
3. Neighborhood and verified-Michelin filters with stable alphabetical sorting.
4. 2-column editorial directory on desktop and 1 column on mobile.
5. Evidence panel with branch identity, check date, audit index, Michelin status, and direct links.
6. Saved-trip panel grouped by resolved neighborhood.

## Data display contract

Public records show:

- Canonical name
- Unflagged Japanese name
- Resolved neighborhood
- Verified operating status and date
- Direct evidence links
- Current Michelin distinction when directly verified

Public records don’t show ratings, review counts, composite scores, confidence percentages, price estimates, descriptions, tags, cuisine labels, inferred maps, reservation claims, or restaurant photos.

## Filters

Search covers name, Japanese name, and neighborhood. Neighborhood options derive from the 28-record public dataset. The Michelin toggle covers only directly verified distinctions. A-Z is the default sort.

Impossible Michelin and neighborhood combinations are disabled. Empty search results provide a 1-tap reset. Unknown legacy URL parameters are ignored and removed.

## Trip behavior

Shared trip URLs contain only public IDs and open My Trip on arrival. Old or held IDs are omitted with a visible notice.

Text exports include the canonical name, resolved neighborhood, verification date, and exact evidence links. Browse filters never enter the copied trip URL.

## Metadata and images

All public metadata and social assets use the exact 28-record count and verification framing. The static social image is an editorial data card, not restaurant imagery.

Restaurant photography remains blocked until the image-provenance contract in `BRAND.md` is met.

## Accessibility and motion

- WCAG AA contrast
- Keyboard-complete dialogs with focus return
- Visible focus rings
- Japanese names marked with `lang="ja"`
- Reduced-motion support
- Motion limited to state changes using transform and opacity
