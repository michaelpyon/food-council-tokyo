import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('modal panels', () => {
  it('opens verification details as a labeled dialog and restores focus on close', async () => {
    const user = userEvent.setup();
    render(<App />);

    const detailsButton = screen.getByRole('button', {
      name: /View evidence for Ben Fiddich/i,
    });
    await user.click(detailsButton);

    const dialog = screen.getByRole('dialog', { name: 'Ben Fiddich' });
    expect(dialog).toBeTruthy();
    expect(screen.getByText('Verification record')).toBeTruthy();

    const closeButton = screen.getByRole('button', { name: 'Close detail panel' });
    await waitFor(() => expect(document.activeElement).toBe(closeButton));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Ben Fiddich' })).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(detailsButton));
  });
});
