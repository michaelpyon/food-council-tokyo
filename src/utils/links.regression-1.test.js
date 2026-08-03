import { describe, expect, it } from 'vitest';
import { sourceLabel } from './links';

describe('Michelin evidence labels', () => {
  // Regression: ISSUE-002 — Michelin feature articles were labeled as restaurant guide entries
  // Found by /qa on 2026-08-03
  // Report: .gstack/qa-reports/qa-report-localhost-verified91-2026-08-03.md
  it('distinguishes editorial articles from Michelin Guide restaurant pages', () => {
    expect(sourceLabel({
      type: 'michelin',
      url: 'https://guide.michelin.com/sg/en/article/features/nihonryori-ryugin-is-moving-to-hibiya-sg',
    })).toBe('Michelin article');

    expect(sourceLabel({
      type: 'michelin',
      url: 'https://guide.michelin.com/en/tokyo-region/tokyo/restaurant/ryugin-1194232',
    })).toBe('Michelin Guide');
  });
});
