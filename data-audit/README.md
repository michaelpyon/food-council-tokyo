# Food Council Tokyo data audit

Status: fail-closed public subset generated

Verified through: 2026-07-30

## Bottom line

The app doesn’t publish the raw 163-record dataset. The normalization pipeline joins `src/data/restaurants.js` with both audit files, reconciles the audit schemas, and generates 2 artifacts:

- A 163-record administrative dataset
- A 91-record public dataset, with 72 records held

Every public record is branch-resolved, operating, high-confidence, free of blocking hold reasons, and backed by at least 1 public-safe direct evidence URL. The app imports the generated public artifact.

## Coverage

- `audit-000-081.json`: 82 records, indices 0 through 81
- `audit-082-162.json`: 81 records, indices 82 through 162
- Combined records: 163
- Unique IDs: 163
- Index-to-source ID mismatches: 0
- Source links in the audit: 264

The 2 source files use different field names and status vocabularies. `scripts/normalize-restaurant-audits.mjs` converts them into 1 canonical format before product validation or build.

## Publication gate

The public artifact includes 91 records and holds 72. A record stays held if its status, access, identity, confidence, blocking flags, or evidence fails the gate. Corrected neighborhood, name, move, cuisine, and Michelin findings can pass only when normalization corrects the public field or omits the unsupported field. Unknown flags block by default.

The app publishes only the fields supported by this audit:

- Canonical and corrected Japanese names
- Resolved neighborhoods
- Operating status
- Direct evidence links
- Verification date
- Current Michelin distinctions when directly verified

Ratings, review counts, prices, descriptions, cuisine labels, reservation claims, and restaurant photos remain unpublished until each field receives direct evidence. The social image states the current 91-record count.

### HTTP evidence exception

Gen Yamamoto’s official source remains `http://www.genyamamoto.jp`. Both same-domain HTTPS variants fail certificate hostname verification, while the HTTP page and the record’s separate HTTPS Tabelog source remain reachable. The public-data contract contains an exact allowlist for this 1 URL and rejects HTTP for every other public evidence source. Remove the exception when the official site serves a valid same-domain HTTPS certificate.

## Release controls

The test and build commands fail if:

- Generated artifacts drift from `src/data/restaurants.js` or either source audit
- Record counts or provenance hashes change unexpectedly
- A public record fails the status, confidence, flag, identity, or source gate
- Unsupported ratings, prices, descriptions, restaurant photos, or stale counts enter the product

Browser QA covers filters, search, mobile layout, keyboard focus, shared trips, and evidence panels before deployment.

## Files

- `audit-000-081.json`
- `audit-082-162.json`
- `normalized/restaurants.json`
- `normalized/publishable-restaurants.json`
