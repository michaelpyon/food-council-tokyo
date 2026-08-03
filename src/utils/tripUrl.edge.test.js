import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildTripUrl,
  readFiltersFromUrl,
  readTripFromUrl,
  syncUrl,
} from './tripUrl';

const DEFAULT_FILTERS = {
  neighborhood: 'all',
  michelinOnly: false,
  query: '',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('trip URL edge cases', () => {
  it('distinguishes absent and empty trips while trimming and deduplicating IDs', () => {
    expect(readTripFromUrl('?hood=Ginza')).toBeNull();
    expect(readTripFromUrl('?trip=')).toEqual([]);
    expect(readTripFromUrl('?trip=%20alpha%20,beta,alpha,,%20')).toEqual(['alpha', 'beta']);
    expect(buildTripUrl([])).toBe('http://localhost:3000/');
  });

  it('hydrates allowlisted filters and caps shared queries at 100 characters', () => {
    const query = 'a'.repeat(120);
    const filters = readFiltersFromUrl(
      DEFAULT_FILTERS,
      `?hood=Ginza&michelin=1&q=${query}`,
      { neighborhoods: new Set(['Ginza']) },
    );

    expect(filters).toEqual({
      neighborhood: 'Ginza',
      michelinOnly: true,
      query: 'a'.repeat(100),
    });
  });

  it('drops a Michelin URL filter when the selected neighborhood has no verified distinctions', () => {
    const filters = readFiltersFromUrl(
      DEFAULT_FILTERS,
      '?hood=Asakusa&michelin=1',
      {
        neighborhoods: new Set(['Asakusa']),
        michelinNeighborhoods: new Set(['Ginza']),
      },
    );

    expect(filters).toEqual({
      neighborhood: 'Asakusa',
      michelinOnly: false,
      query: '',
    });
  });

  it('falls back on malformed input and treats URL replacement as progressive enhancement', () => {
    expect(readTripFromUrl(Symbol('invalid search'))).toBeNull();
    expect(readFiltersFromUrl(DEFAULT_FILTERS, Symbol('invalid search'))).toEqual(DEFAULT_FILTERS);

    syncUrl(['alpha'], {
      neighborhood: 'Ginza',
      michelinOnly: true,
      query: ' ramen ',
    });
    expect(window.location.search).toBe('?trip=alpha&hood=Ginza&michelin=1&q=ramen');

    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {
      throw new Error('history unavailable');
    });
    expect(() => syncUrl(['beta'], DEFAULT_FILTERS)).not.toThrow();
  });
});
