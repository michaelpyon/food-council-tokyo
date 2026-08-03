import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const STORAGE_KEY = 'fct-saved-restaurants';

describe('blocked or malformed saved-trip storage', () => {
  it('starts normally when saved-trip storage contains valid JSON of the wrong shape', () => {
    // Regression: ISSUE-005 — non-array JSON crashed App during saved-trip initialization
    // Found by pre-landing review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'ben-fiddich' }));

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Verified directory' })).toBeTruthy();
    expect(screen.getByText('28 of 28 public records')).toBeTruthy();
  });

  it('starts normally when storage rejects initialization writes', () => {
    // Regression: ISSUE-005 — blocked storage writes crashed App before first paint
    // Found by pre-landing review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Verified directory' })).toBeTruthy();
    expect(screen.getByText('28 of 28 public records')).toBeTruthy();
  });

  it('keeps consecutive saves in memory when storage is blocked', async () => {
    // Regression: ISSUE-005 — blocked storage dropped earlier saves from the live trip
    // Found by pre-landing review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    const user = userEvent.setup();
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Save Ben Fiddich to My Trip' }));
    await user.click(screen.getByRole('button', { name: 'Save Tempura Kondo to My Trip' }));

    expect(screen.getByRole('button', { name: 'Open My Trip (2 saved)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove Ben Fiddich from My Trip' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove Tempura Kondo from My Trip' })).toBeTruthy();
  });
});
