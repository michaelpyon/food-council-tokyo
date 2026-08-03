import { describe, expect, it } from 'vitest';
import publicData from '../../data-audit/normalized/publishable-restaurants.json';
import { PUBLIC_HTTP_SOURCE_ALLOWLIST } from '../../scripts/restaurant-normalization-contract.mjs';
import { restaurants } from './verifiedRestaurants';

const FORBIDDEN_FIELDS = [
  'tabelog',
  'google',
  'priceRange',
  'description',
  'tags',
  'awards',
  'cuisine',
  'subCuisine',
  'photoSeed',
  'reservationUrl',
  '_compositeScore',
];

describe('verified restaurant contract', () => {
  it('publishes the fail-closed 91-record cut and holds the other 72', () => {
    expect(publicData.sourceRecordCount).toBe(163);
    expect(publicData.count).toBe(91);
    expect(publicData.heldCount).toBe(72);
    expect(restaurants).toHaveLength(91);
    expect(new Set(restaurants.map(restaurant => restaurant.id)).size).toBe(91);
  });

  it('contains direct evidence and no unsupported enrichment', () => {
    const httpSources = [];
    for (const record of publicData.records) {
      expect(record.lastVerified).toBe('2026-07-30');
      expect(record.sources.length).toBeGreaterThan(0);
      for (const source of record.sources) {
        if (source.url.startsWith('http://')) httpSources.push(source.url);
        expect(
          source.url.startsWith('https://') || PUBLIC_HTTP_SOURCE_ALLOWLIST.includes(source.url),
        ).toBe(true);
      }
      for (const field of FORBIDDEN_FIELDS) {
        expect(Object.hasOwn(record, field)).toBe(false);
      }
    }
    expect(httpSources).toEqual(PUBLIC_HTTP_SOURCE_ALLOWLIST);
  });

  it('publishes only the 19 directly verified Michelin distinctions', () => {
    const michelin = publicData.records.filter(
      record => record.michelin.verified && record.michelin.distinction,
    );

    expect(michelin).toHaveLength(19);
    expect(michelin.every(record => record.michelin.sourceUrl)).toBe(true);
  });
});
