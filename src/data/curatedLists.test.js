import { describe, expect, it } from 'vitest';
import { restaurants as rawRestaurants } from './restaurants';
import { curatedLists, getCuratedListRestaurants } from './curatedLists';
import { computeCompositeScore } from '../utils/scoring';

const restaurants = rawRestaurants.map(restaurant => ({
  ...restaurant,
  _compositeScore: computeCompositeScore(restaurant),
}));

describe('curated lists', () => {
  it.each(curatedLists)('$title returns at least 1 restaurant', (list) => {
    // Regression: ISSUE-001 - First Time in Tokyo returned no restaurants.
    // Found by /qa on 2026-07-30
    // Report: .gstack/qa-reports/qa-report-localhost-2026-07-30.md
    expect(getCuratedListRestaurants(restaurants, list).length).toBeGreaterThan(0);
  });

  it('keeps the first-timer list useful and bounded', () => {
    const list = curatedLists.find(candidate => candidate.id === 'first-timers');
    const results = getCuratedListRestaurants(restaurants, list);

    expect(results).toHaveLength(20);
    expect(results.every(restaurant => restaurant.tags?.includes('walk-in-ok'))).toBe(true);
    expect(results.every(restaurant => restaurant.priceRange <= 3)).toBe(true);
  });
});
