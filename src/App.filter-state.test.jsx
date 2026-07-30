import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('filter state', () => {
  it('treats a manual filter as a new global search', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /The Ramen Circuit/i }));
    expect(screen.getByText('16 of 163 restaurants')).toBeTruthy();

    const cuisineFilter = screen.getAllByRole('combobox')[0];
    await user.selectOptions(cuisineFilter, 'Sushi');

    // Regression: ISSUE-002 - the Sushi filter was invisibly intersected with
    // the active Ramen Circuit list and returned 0.
    // Found by /qa on 2026-07-30
    // Report: .gstack/qa-reports/qa-report-localhost-2026-07-30.md
    expect(screen.queryByText('No restaurants match your filters')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Clear list filter' })).toBeNull();
    expect(screen.getByRole('button', { name: /View details for Sukiyabashi Jiro/i })).toBeTruthy();
  });

  it('clears every active filter from the empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole('searchbox', { name: 'Search restaurants' });
    await user.type(search, 'no restaurant has this name');

    expect(screen.getByText('No restaurants match your filters')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(screen.queryByText('No restaurants match your filters')).toBeNull();
    expect(screen.getByText('163 of 163 restaurants')).toBeTruthy();
    expect(search.value).toBe('');
  });
});
