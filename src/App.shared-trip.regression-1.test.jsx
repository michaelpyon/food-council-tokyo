import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from './App';

const STORAGE_KEY = 'fct-saved-restaurants';

function seedSavedTrip() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['ben-fiddich']));
}

describe('empty shared trip imports', () => {
  it('preserves a stored trip when the shared trip parameter is empty', () => {
    // Regression: ISSUE-002 — an empty shared-trip URL erased the recipient's saved trip
    // Found by exact Opus 5 review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    seedSavedTrip();
    window.history.replaceState(null, '', '/?trip=');

    render(<App />);

    const tripPanel = screen.getByRole('dialog', { name: 'My Trip' });
    expect(within(tripPanel).getByText('Ben Fiddich')).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(['ben-fiddich']);
  });

  it('preserves a stored trip when every imported ID is legacy', () => {
    // Regression: ISSUE-002 — an all-legacy shared trip erased current saved places
    // Found by exact Opus 5 review on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-verified28-2026-08-03.md
    seedSavedTrip();
    window.history.replaceState(null, '', '/?trip=tempura-yamanoue');

    render(<App />);

    const tripPanel = screen.getByRole('dialog', { name: 'My Trip' });
    expect(within(tripPanel).getByText('Ben Fiddich')).toBeTruthy();
    expect(within(tripPanel).getByText('1 legacy place was left out')).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(['ben-fiddich']);
  });
});
