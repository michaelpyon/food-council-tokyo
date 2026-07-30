# Food Council: Tokyo

A verification-first Tokyo food and drink directory. The public app contains 28 branch-level records cleared from a 163-record audit dated 2026-07-30.

The app publishes only:

- Canonical and Japanese names
- Resolved neighborhoods
- Operating status
- Direct evidence links
- Current Michelin distinctions when directly verified
- Saveable, shareable trip lists

Ratings, review counts, prices, descriptions, cuisine labels, reservation claims, and restaurant photos remain unpublished until they receive field-level evidence.

## Stack

- Vite 8 and React 19
- Tailwind CSS 4
- Motion
- Vitest and Testing Library
- LocalStorage plus URL-encoded shared trips

## Local commands

```bash
npm install
npm run data:check
npm test
npm run lint
npm run build
npm run dev
```

`npm test` and `npm run build` fail if the generated public dataset drifts from the audit inputs.

## Data flow

```text
data-audit/audit-000-081.json
data-audit/audit-082-162.json
                 |
                 v
scripts/normalize-restaurant-audits.mjs
                 |
                 +--> data-audit/normalized/restaurants.json
                 |    Full 163-record administrative audit
                 |
                 +--> data-audit/normalized/publishable-restaurants.json
                      Strict 28-record public dataset
```

The publication gate requires an operating status, high confidence, zero unresolved audit flags, and at least 1 direct evidence URL.

The legacy hand-written dataset remains in `src/data/restaurants.js` for audit traceability. The app doesn’t import it.

## Deployment

Production is hosted on Vercel. Building locally doesn’t publish changes. Deployment requires Michael’s explicit approval.
