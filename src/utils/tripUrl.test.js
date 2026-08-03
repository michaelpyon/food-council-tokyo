import { describe, expect, it } from 'vitest';
import { buildTripText, buildTripUrl, readFiltersFromUrl } from './tripUrl';

const restaurant = {
  id: 'verified-place',
  name: 'Verified Place',
  neighborhood: 'Ginza',
  lastVerified: '2026-07-30',
  sources: [
    { type: 'official', url: 'https://example.com/verified-place' },
  ],
};

describe('verified trip URLs and exports', () => {
  it('builds a trip URL without browse filters', () => {
    expect(buildTripUrl(['verified-place'])).toBe(
      'http://localhost:3000/?trip=verified-place',
    );
  });

  it('exports evidence instead of scores or inferred map links', () => {
    const text = buildTripText([restaurant], [restaurant.id]);
    expect(text).toContain('Verified Place');
    expect(text).toContain('Verified: 2026-07-30');
    expect(text).toContain('Official site: https://example.com/verified-place');
    expect(text).not.toMatch(/score|Google Maps|Tabelog:/i);
  });

  it('allowlists neighborhood URL values and ignores legacy parameters', () => {
    const result = readFiltersFromUrl(
      { neighborhood: 'all', michelinOnly: false, query: '' },
      '?hood=Unknown&source=eater&price=4',
      { neighborhoods: new Set(['Ginza']) },
    );

    expect(result).toEqual({
      neighborhood: 'all',
      michelinOnly: false,
      query: '',
    });
  });
});
