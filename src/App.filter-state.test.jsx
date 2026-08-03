import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('verified filter state', () => {
  it('filters by neighborhood and only enables possible Michelin combinations', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('91 of 91 verified records')).toBeTruthy();

    const neighborhoodFilter = screen.getByRole('combobox', { name: 'Neighborhood' });
    await user.selectOptions(neighborhoodFilter, 'Ginza');
    expect(screen.getByText('9 of 91 verified records')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Michelin verified (3)' }));
    expect(screen.getByText('3 of 91 verified records')).toBeTruthy();
    expect(screen.getByText('Tempura Kondo')).toBeTruthy();

    expect(screen.getByRole('option', { name: 'Asakusa (0)' }).disabled).toBe(true);
  });

  it('clears an empty search without leaving hidden state behind', async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole('searchbox', { name: 'Search verified places' });
    await user.type(search, 'no verified place has this name');

    expect(screen.getByText('No verified records match')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(screen.queryByText('No verified records match')).toBeNull();
    expect(screen.getByText('91 of 91 verified records')).toBeTruthy();
    expect(search.value).toBe('');
  });

  it('ignores and removes legacy filter parameters', async () => {
    window.history.replaceState(null, '', '/?cuisine=Sushi&source=eater&hood=Unknown&price=4');
    render(<App />);

    expect(screen.getByText('91 of 91 verified records')).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Highest Rated' })).toBeNull();
    expect(screen.queryByRole('option', { name: 'Tabelog Score' })).toBeNull();

    await waitFor(() => expect(window.location.search).toBe(''));
  });
});
