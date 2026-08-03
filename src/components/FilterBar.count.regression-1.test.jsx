import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from './FilterBar';

const EXPANDED_NEIGHBORHOODS = [
  { value: 'Asakusa', label: 'Asakusa', totalCount: 9, michelinCount: 0 },
  { value: 'Ginza', label: 'Ginza', totalCount: 12, michelinCount: 4 },
];

function ExpandedDirectoryFilters() {
  const [filters, setFilters] = useState({
    neighborhood: 'all',
    michelinOnly: false,
    query: '',
  });

  return (
    <FilterBar
      filters={filters}
      onFilterChange={setFilters}
      sortKey="name-asc"
      onSortChange={() => {}}
      neighborhoods={EXPANDED_NEIGHBORHOODS}
      michelinCount={17}
    />
  );
}

describe('Michelin filter count', () => {
  it('shows the count available in the selected neighborhood as the directory expands', async () => {
    // Regression: ISSUE-007 — the Michelin button showed the global count after choosing a neighborhood
    // Found by /qa on 2026-08-03
    // Report: .gstack/qa-reports/qa-report-localhost-expansion-2026-08-03.md
    const user = userEvent.setup();
    render(<ExpandedDirectoryFilters />);

    expect(screen.getByRole('button', { name: 'Michelin verified (17)' })).toBeTruthy();

    const neighborhood = screen.getByRole('combobox', { name: 'Neighborhood' });
    await user.selectOptions(neighborhood, 'Ginza');
    expect(screen.getByRole('button', { name: 'Michelin verified (4)' })).toBeTruthy();

    await user.selectOptions(neighborhood, 'Asakusa');
    const unavailableMichelin = screen.getByRole('button', { name: 'Michelin verified (0)' });
    expect(unavailableMichelin.disabled).toBe(true);

    await user.selectOptions(neighborhood, 'all');
    expect(screen.getByRole('button', { name: 'Michelin verified (17)' })).toBeTruthy();
  });
});
