import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.unmock('motion/react');

describe('filter result layout', () => {
  it('removes nonmatching cards as soon as a neighborhood filter is applied', async () => {
    // Regression: ISSUE-001 — exiting cards left large blank gaps after filtering
    // Found by /qa on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    const { default: App } = await import('./App');
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Neighborhood' }),
      'Asakusa',
    );

    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Namiki Yabusoba' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Grill Grand' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Suzukien Asakusa Honten' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Yoshikami' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Ben Fiddich' })).toBeNull();
  });
});
