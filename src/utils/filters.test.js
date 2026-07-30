import { describe, expect, it } from 'vitest';
import { filterRestaurants } from './filters';

const defaults = {
  cuisine: 'all',
  neighborhood: 'all',
  priceRange: [],
  michelinOnly: false,
  source: 'all',
  tags: [],
  query: '',
};

describe('Michelin filter', () => {
  it('includes starred and Bib restaurants but excludes legacy Plate entries', () => {
    const restaurants = [
      { id: 'star', michelin: { stars: 1, bib: false, plate: false } },
      { id: 'bib', michelin: { stars: 0, bib: true, plate: false } },
      { id: 'plate', michelin: { stars: 0, bib: false, plate: true } },
      { id: 'none', michelin: { stars: 0, bib: false, plate: false } },
    ];

    const results = filterRestaurants(restaurants, {
      ...defaults,
      michelinOnly: true,
    });

    expect(results.map(restaurant => restaurant.id)).toEqual(['star', 'bib']);
  });
});
