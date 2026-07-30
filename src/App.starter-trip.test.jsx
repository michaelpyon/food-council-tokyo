import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('first-timer flows', () => {
  it('shows restaurants for the First Time in Tokyo list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /First Time in Tokyo/i }));

    // Regression: ISSUE-001 - First Time in Tokyo returned an empty grid.
    // Found by /qa on 2026-07-30
    // Report: .gstack/qa-reports/qa-report-localhost-2026-07-30.md
    expect(screen.queryByText('No restaurants match your filters')).toBeNull();
    expect(screen.getByText('20 of 163 restaurants')).toBeTruthy();
  });

  it('builds a non-empty first-timer trip from the hero', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Build me a first-timer trip' }));

    const tripPanel = screen.getByRole('complementary');
    expect(within(tripPanel).getByText(/20 restaurants saved/i)).toBeTruthy();
    expect(within(tripPanel).queryByText('No restaurants saved yet.')).toBeNull();
  });
});
