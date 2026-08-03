import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('My Trip evidence focus', () => {
  it('returns focus to the My Trip trigger after closing saved-place evidence', async () => {
    // Regression: ISSUE-004 — closing evidence opened from My Trip stranded focus on the page body
    // Found by exact Opus 5 review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Save Ben Fiddich to My Trip' }));
    const tripTrigger = screen.getByRole('button', { name: 'Open My Trip (1 saved)' });
    await user.click(tripTrigger);

    const tripPanel = screen.getByRole('dialog', { name: 'My Trip' });
    await user.click(within(tripPanel).getByRole('button', { name: 'Review evidence for Ben Fiddich' }));
    await user.click(screen.getByRole('button', { name: 'Close detail panel' }));

    await waitFor(() => expect(document.activeElement).toBe(tripTrigger));
  });
});
