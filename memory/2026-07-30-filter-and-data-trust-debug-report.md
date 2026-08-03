# Filter and data trust debug report

Status: DONE_WITH_CONCERNS

Date: 2026-07-30

## Symptom

- `First Time in Tokyo` returned no restaurants.
- A curated list followed by a manual filter could return no restaurants because both states remained active.
- Restaurant cards looked like they contained photos, but they used cuisine-colored gradients.
- The site looked current while carrying stale or incorrect restaurant identities, locations, Michelin claims, and operating statuses.

## Root cause

1. The first-timer predicate required walk-in access, price at or below tier 3, and a composite score at or above 6. No record met all 3 conditions.
2. Curated-list state and manual filters were combined as hidden AND conditions.
3. `photoSeed` existed on all 163 records but no photo renderer used it. `RestaurantCard` drew a CSS gradient in a large image-shaped area.
4. `restaurants.js` had no stable place ID, source URL, per-field verification date, image provenance, or closure state. Precise scores and review counts had no refresh trail.

## Fix

- Reworked the first-timer list to rank eligible walk-in records and cap the result at 20.
- Made search and manual filters clear the active curated list.
- Added a clear-all recovery action to the empty state.
- Removed the misleading image-shaped gradients.
- Limited the Michelin award filter to stars and Bib Gourmand entries.
- Removed Tabelog and Google from the source selector because both matched all 163 records and did not narrow results.
- Added dialog semantics, focus trapping, Escape handling, scroll lock, focus return, Japanese language markers, reduced-motion CSS, and higher-contrast muted and gold colors.
- Added regression tests for curated lists, state reset, empty-state recovery, source options, Michelin behavior, starter trips, and modal behavior.

## Evidence

- Local first-timer result: 20 restaurants
- Ramen list followed by Sushi filter: 15 Sushi restaurants, active list cleared
- Automated tests: 18 passed across 5 files
- Lint: passed
- Production build: passed
- Dependency audit: 0 vulnerabilities
- Browser console: 0 errors in prior local and production checks
- Data audit: 163 source records, 163 unique IDs, exact index alignment, 265 source links
- Data audit result: 42 records not cleanly publishable, 16 moved venues, 11 confirmed closures, 17 unverifiable records

## Regression tests

- `src/data/curatedLists.test.js`
- `src/App.filter-state.test.jsx`
- `src/App.starter-trip.test.jsx`
- `src/utils/filters.test.js`
- `src/App.accessibility.test.jsx`

## Related

- `data-audit/README.md`
- `data-audit/audit-000-081.json`
- `data-audit/audit-082-162.json`
- `.gstack/qa-reports/qa-report-localhost-2026-07-30.md`

## Remaining concern

The interaction fixes pass, but the app still reads from the old restaurant records. Do not deploy or describe the guide as current until the audit is normalized into product data and every unsupported score, price, tag, description, and image claim is refreshed or removed.
