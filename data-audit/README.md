# Food Council Tokyo data audit

Status: publication blocked

Audit date: 2026-07-30

## Bottom line

The current 163-record dataset is not safe to publish as current. The audit resolves every source record against its exact zero-based index and ID, with 265 source links. It also finds 42 records that are not cleanly publishable and 16 moved venues whose location data needs correction.

The JSON files are research evidence. The app does not consume them yet, so they do not fix the production dataset by themselves.

## Coverage

- `audit-000-081.json`: 82 records, indices 0 through 81
- `audit-082-162.json`: 81 records, indices 82 through 162
- Combined records: 163
- Unique IDs: 163
- Index-to-source ID mismatches: 0
- Source links: 265
- Current Michelin distinctions directly verified: 19

The 2 audit files use different field names and status vocabularies. Normalize them before generating product data.

## Publication blockers

The audit found:

- 11 closed restaurants
- 1 closed or indefinitely suspended restaurant
- 1 temporarily closed restaurant
- 17 unverifiable records
- 4 branch-ambiguous records
- 3 conflated records
- 2 listing holds
- 1 duplicate
- 2 entries that are not dine-in restaurants
- 16 moved venues
- 46 neighborhood mismatch or stale-neighborhood flags
- 36 obsolete Michelin Plate taxonomy flags

These categories total 42 records that should be excluded or held until resolved. Moved venues can remain only after their branch and neighborhood fields are corrected.

## Required before launch

1. Normalize both audit schemas into 1 canonical record format.
2. Generate the product dataset from the audit, not the old hand-written claims.
3. Exclude closed, suspended, temporarily closed, unverifiable, ambiguous, conflated, duplicate, held, and non-restaurant records.
4. Correct branch names, Japanese names, neighborhoods, cuisine labels, and verified Michelin distinctions.
5. Refresh or remove exact Tabelog scores, Google ratings, review counts, prices, tags, descriptions, and reservation claims. This audit did not verify those fields for all 163 records.
6. Store a source URL and `lastVerified` date per published record.
7. Keep restaurant photos out until each image has exact branch identity, rights, attribution, and provenance.
8. Replace the social image that says 165 restaurants.
9. Run the full filter, mobile, keyboard, and link suite against the generated dataset.

## Files

- `audit-000-081.json`
- `audit-082-162.json`
