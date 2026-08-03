# Food Council Tokyo data audit

Status: strict public subset generated

Verified through: 2026-07-30

## Bottom line

The app doesn’t publish the raw 163-record dataset. The normalization pipeline reads both audit files, reconciles their schemas, and generates 2 artifacts:

- A 163-record administrative dataset
- A 28-record public dataset, with 135 records held

Every public record is branch-resolved, operating, high-confidence, free of unresolved flags, and backed by at least 1 direct evidence URL. The app imports the generated public artifact.

## Coverage

- `audit-000-081.json`: 82 records, indices 0 through 81
- `audit-082-162.json`: 81 records, indices 82 through 162
- Combined records: 163
- Unique IDs: 163
- Index-to-source ID mismatches: 0
- Source links in the original audit: 265

The 2 source files use different field names and status vocabularies. `scripts/normalize-restaurant-audits.mjs` converts them into 1 canonical format before product validation or build.

## Publication gate

The public artifact includes 28 records and holds 135. A record stays held if its status, identity, confidence, flags, or evidence fails the strict gate.

The app publishes only the fields supported by this audit:

- Canonical and Japanese names
- Resolved neighborhoods
- Operating status
- Direct evidence links
- Verification date
- Current Michelin distinctions when directly verified

Ratings, review counts, prices, descriptions, cuisine labels, reservation claims, and restaurant photos remain unpublished until each field receives direct evidence. The social image states the current 28-record count.

## Release controls

The test and build commands fail if:

- Generated artifacts drift from the 2 source audits
- Record counts or provenance hashes change unexpectedly
- A public record fails the status, confidence, flag, identity, or source gate
- Unsupported ratings, prices, descriptions, restaurant photos, or stale counts enter the product

Browser QA covers filters, search, mobile layout, keyboard focus, shared trips, and evidence panels before deployment.

## Files

- `audit-000-081.json`
- `audit-082-162.json`
- `normalized/restaurants.json`
- `normalized/publishable-restaurants.json`
