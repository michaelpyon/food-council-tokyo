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

const RESTAURANT = {
  id: 'alpha',
  name: 'Alpha',
  nameJa: 'アルファ',
  neighborhood: 'Ginza',
  lastVerified: '2026-07-30',
  sources: [{ type: 'official', url: 'https://example.com/alpha' }],
  michelin: null,
};

afterEach(() => {
  copyTextMock.mockReset();
  vi.unstubAllGlobals();
});

function renderSavedTrip() {
  render(
    <SavedListPanel
      isOpen
      onClose={() => {}}
      savedRestaurants={[RESTAURANT]}
      savedIds={['alpha']}
      omittedTripIds={[]}
      onRemove={() => {}}
      onSelect={() => {}}
    />,
  );
}

describe('native trip sharing', () => {
  it('uses the native share API without touching the clipboard when sharing succeeds', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue();
    vi.stubGlobal('navigator', { share });
    renderSavedTrip();

    await user.click(screen.getByRole('button', { name: 'Share trip' }));

    await waitFor(() => expect(share).toHaveBeenCalledWith({
      title: 'My Tokyo trip',
      text: 'My Tokyo trip: 1 verified place from Food Council: Tokyo',
      url: 'http://localhost:3000/?trip=alpha',
    }));
    expect(copyTextMock).not.toHaveBeenCalled();
  });

  it('copies the trip URL when the user cancels native sharing', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'));
    copyTextMock.mockResolvedValue();
    vi.stubGlobal('navigator', { share });
    renderSavedTrip();

    await user.click(screen.getByRole('button', { name: 'Share trip' }));

    await waitFor(() => expect(copyTextMock).toHaveBeenCalledWith(
      'http://localhost:3000/?trip=alpha',
    ));
    expect(screen.getByRole('button', { name: 'Link copied' })).toBeTruthy();
  });
});
