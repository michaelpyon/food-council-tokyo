# Normalized restaurant data

`restaurants.json` is the complete 163-record administrative audit. It preserves held records, normalized status, confidence, source URLs, and explicit hold reasons.

`publishable-restaurants.json` is the app-safe public artifact. It contains only records that pass the strict release gate:

```text
status=active AND confidence=high AND auditFlags=0
```

The public artifact omits held identities and all unsupported legacy claims, including ratings, review counts, prices, descriptions, tags, awards, images, and reservation URLs.

## Commands

Generate both artifacts:

```sh
node scripts/normalize-restaurant-audits.mjs
```

Confirm committed artifacts match a fresh deterministic generation:

```sh
node scripts/normalize-restaurant-audits.mjs --check
```

Validate coverage, IDs, schemas, vocabularies, source provenance, the strict public gate, and the expected 28-record public count:

```sh
node scripts/validate-normalized-restaurants.mjs
```
