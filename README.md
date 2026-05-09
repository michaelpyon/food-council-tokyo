# Food Council: Tokyo

A curated guide to 163 Tokyo restaurants, scored across Tabelog, Michelin, Google, and editorial sources. Filter by neighborhood, cuisine, price, or Michelin status. Save picks to your trip list.

## Stack

- Vite 8 + React 19
- Tailwind CSS 4
- Motion (animations)
- LocalStorage for saved restaurants

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # eslint
```

## Project structure

```
src/
  App.jsx              top-level state, routing of filters and panels
  components/          UI components (Header, FilterBar, RestaurantCard, DetailPanel, ...)
  data/
    restaurants.js     163 restaurants with scores, neighborhood, cuisine, sources
    curatedLists.js    pre-built lists (Michelin only, by neighborhood, etc.)
  utils/
    scoring.js         composite score: Tabelog 40%, Michelin 30%, Google 15%, Media 15%
    filters.js         filter and sort helpers
    storage.js         localStorage wrappers for saved restaurants
public/
  favicon.svg
  og-image.svg         social share image
```

## Restaurant data shape

```js
{
  id: 'sukiyabashi-jiro',
  name: 'Sukiyabashi Jiro',
  nameJa: 'すきやばし次郎',
  cuisine: 'Sushi',
  subCuisine: 'Edomae',
  neighborhood: 'Ginza',
  priceRange: 4,                       // 1 to 4 ($ to $$$$)
  michelin: { stars: 3, bib: false },
  tabelog: { score: 4.55, reviews: 1200 },
  google: { rating: 4.6, reviews: 850 },
  sources: ['tabelog', 'michelin', 'nyt', 'eater'],
  tags: ['omakase', 'reservation-only'],
}
```

## Scoring

Composite scores combine four signals:

- Tabelog (40%): Japan's largest food review site
- Michelin (30%): stars and Bib Gourmand
- Google (15%): tourist-weighted rating
- Media (15%): editorial coverage in Eater, NYT, CN Traveler, Time Out

See `src/utils/scoring.js` for the formula.

## Deploy

Vercel:

```bash
npx vercel --prod
```
