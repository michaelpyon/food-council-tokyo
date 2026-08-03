import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { sortRestaurants } from './utils/filters';

describe('directory control boundaries', () => {
  it('handles whitespace and single-character search, preserves search when clearing filters, and changes sort order', async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole('searchbox', { name: 'Search verified places' });
    const neighborhood = screen.getByRole('combobox', { name: 'Neighborhood' });
    const sort = screen.getByRole('combobox', { name: 'Sort restaurants' });

    await user.type(search, '   ');
    expect(screen.getByText('28 of 28 verified records')).toBeTruthy();

    await user.clear(search);
    await user.type(search, 'b');
    expect(screen.getByText('14 of 28 verified records')).toBeTruthy();

    await user.clear(search);
    await user.type(search, 'Ben');
    await user.selectOptions(neighborhood, 'Ginza');
    expect(screen.getByText('No verified records match')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Clear filters (1)' }));
    expect(search.value).toBe('Ben');
    expect(neighborhood.value).toBe('all');
    expect(screen.getByRole('heading', { name: 'Ben Fiddich' })).toBeTruthy();

    await user.clear(search);
    await user.selectOptions(sort, 'neighborhood-asc');
    const firstCard = screen.getAllByRole('article')[0];
    expect(within(firstCard).getByRole('heading', { name: 'Grill Grand' })).toBeTruthy();

    const tiedRecords = [
      { id: 'later', name: 'Same', neighborhood: 'Ginza', auditIndex: 2 },
      { id: 'earlier', name: 'Same', neighborhood: 'Ginza', auditIndex: 1 },
    ];
    expect(sortRestaurants(tiedRecords, 'neighborhood-asc').map(record => record.id)).toEqual([
      'earlier',
      'later',
    ]);
    expect(sortRestaurants(tiedRecords, 'unexpected').map(record => record.id)).toEqual([
      'earlier',
      'later',
    ]);

    await user.click(screen.getByRole('button', { name: 'How we verified' }));
    expect(screen.getByText(/We matched each entry to a current branch/i)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'How we verified' }));
    expect(screen.queryByText(/We matched each entry to a current branch/i)).toBeNull();
  });
});
