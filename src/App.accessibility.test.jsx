import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('modal panels', () => {
  it('opens restaurant details as a labeled dialog and restores focus on close', async () => {
    const user = userEvent.setup();
    render(<App />);

    const detailsButton = screen.getByRole('button', {
      name: /View details for Sukiyabashi Jiro/i,
    });
    await user.click(detailsButton);

    const dialog = screen.getByRole('dialog', { name: 'Sukiyabashi Jiro' });
    expect(dialog).toBeTruthy();

    const closeButton = screen.getByRole('button', { name: 'Close detail panel' });
    await waitFor(() => expect(document.activeElement).toBe(closeButton));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Sukiyabashi Jiro' })).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(detailsButton));
  });
});
