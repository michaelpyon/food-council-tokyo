import { describe, expect, it } from 'vitest';
import { filterRestaurants, sortRestaurants } from './filters';

const records = [
  {
    id: 'b',
    auditIndex: 2,
    name: 'Beta',
    nameJa: 'ベータ',
    neighborhood: 'Ginza',
    michelin: null,
  },
  {
    id: 'a',
    auditIndex: 1,
    name: 'Alpha',
    nameJa: 'アルファ',
    neighborhood: 'Kagurazaka',
    michelin: {
      distinction: 'three_stars',
      verified: true,
    },
  },
];

describe('verified directory filters', () => {
  it('searches only verified identity and neighborhood fields', () => {
    expect(filterRestaurants(records, {
      neighborhood: 'all',
      michelinOnly: false,
      query: 'アルファ',
    }).map(record => record.id)).toEqual(['a']);
  });

  it('filters only directly verified Michelin distinctions', () => {
    expect(filterRestaurants(records, {
      neighborhood: 'all',
      michelinOnly: true,
      query: '',
    }).map(record => record.id)).toEqual(['a']);
  });

  it('uses a stable alphabetical default sort', () => {
    expect(sortRestaurants(records, 'name-asc').map(record => record.id)).toEqual(['a', 'b']);
  });
});
