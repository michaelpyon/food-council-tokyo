import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSavedIds,
  isSaved,
  saveRestaurant,
  setSavedIds,
  unsaveRestaurant,
} from './storage';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('saved restaurant storage edge cases', () => {
  it('returns an empty trip for corrupt JSON or inaccessible storage', () => {
    localStorage.setItem('fct-saved-restaurants', '{not valid JSON');
    expect(getSavedIds()).toEqual([]);
    expect(isSaved('alpha')).toBe(false);

    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    expect(getSavedIds()).toEqual([]);
  });

  it('sanitizes replacement lists, removes IDs, and exposes write failures', () => {
    expect(setSavedIds(['alpha', '', null, 'beta'])).toEqual(['alpha', 'beta']);
    expect(unsaveRestaurant('alpha')).toEqual(['beta']);
    expect(isSaved('alpha')).toBe(false);

    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage quota exceeded');
    });
    expect(() => saveRestaurant('gamma')).toThrow('storage quota exceeded');
  });
});
