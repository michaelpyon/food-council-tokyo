# Normalized restaurant data

`restaurants.json` is the complete 163-record administrative audit. It preserves held records, normalized status, confidence, source URLs, and explicit hold reasons.

`publishable-restaurants.json` is the app-safe public artifact. It contains only records that pass the fail-closed release gate. Cuisine stays in the administrative audit and is excluded from the public contract.

```text
status=active AND confidence=high AND blockingHoldReasons=0
```

The policy contains an explicit allowlist for audit findings that normalization has corrected or that affect fields omitted from the public artifact. Every unknown audit flag remains blocking.

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

Validate coverage, IDs, schemas, vocabularies, source provenance, the fail-closed public gate, and the expected 91-record public count:

```sh
node scripts/validate-normalized-restaurants.mjs
```
