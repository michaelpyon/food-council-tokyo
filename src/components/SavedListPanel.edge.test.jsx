import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavedListPanel from './SavedListPanel';

const { copyTextMock } = vi.hoisted(() => ({
  copyTextMock: vi.fn(),
}));

vi.mock('../utils/copyText', () => ({
  copyText: copyTextMock,
}));

const RESTAURANTS = [
  {
    id: 'alpha',
    name: 'Alpha',
    nameJa: 'アルファ',
    neighborhood: 'Ginza',
    lastVerified: '2026-07-30',
    sources: [{ type: 'official', url: 'https://example.com/alpha' }],
    michelin: null,
  },
  {
    id: 'beta',
    name: 'Beta',
    nameJa: 'ベータ',
    neighborhood: 'Shinjuku',
    lastVerified: '2026-07-30',
    sources: [{ type: 'tabelog', url: 'https://example.com/beta' }],
    michelin: null,
  },
];

afterEach(() => {
  copyTextMock.mockReset();
  vi.unstubAllGlobals();
});

function RemovableTrip() {
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  return (
    <SavedListPanel
      isOpen
      onClose={() => {}}
      savedRestaurants={restaurants}
      savedIds={restaurants.map(restaurant => restaurant.id)}
      omittedTripIds={[]}
      onRemove={id => setRestaurants(current => current.filter(restaurant => restaurant.id !== id))}
      onSelect={() => {}}
    />
  );
}

describe('My Trip edge cases', () => {
  it('shows an empty state without share controls', () => {
    render(
      <SavedListPanel
        isOpen
        onClose={() => {}}
        savedRestaurants={[]}
        savedIds={[]}
        omittedTripIds={[]}
        onRemove={() => {}}
        onSelect={() => {}}
      />,
    );

    expect(screen.getByText('No verified places saved')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Share trip' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Copy evidence' })).toBeNull();
  });

  it('groups multiple neighborhoods and reaches the empty state after removals', async () => {
    const user = userEvent.setup();
    render(<RemovableTrip />);

    expect(screen.getByRole('heading', { name: 'Ginza' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Shinjuku' })).toBeTruthy();
    expect(screen.getAllByText('1 stop')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Remove Alpha from My Trip' }));
    expect(screen.queryByText('Alpha')).toBeNull();
    expect(screen.getByText('1 verified place saved')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Remove Beta from My Trip' }));
    expect(screen.getByText('No verified places saved')).toBeTruthy();
    expect(screen.getByText('0 verified places saved')).toBeTruthy();
  });

  it('reports failed share fallback and evidence-copy attempts', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('navigator', {});
    copyTextMock.mockRejectedValue(new Error('clipboard blocked'));

    render(
      <SavedListPanel
        isOpen
        onClose={() => {}}
        savedRestaurants={[RESTAURANTS[0]]}
        savedIds={['alpha']}
        omittedTripIds={[]}
        onRemove={() => {}}
        onSelect={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Share trip' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copy failed' })).toBeTruthy());

    await user.click(screen.getByRole('button', { name: 'Copy evidence' }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Copy failed' })).toHaveLength(2));
    expect(copyTextMock).toHaveBeenCalledTimes(2);
  });
});
