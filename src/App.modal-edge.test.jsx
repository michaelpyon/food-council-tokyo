import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('evidence modal edge behavior', () => {
  it('traps focus in both directions, exposes safe outbound links, and restores scroll after backdrop close', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /View evidence for Ben Fiddich/i }));
    const dialog = screen.getByRole('dialog', { name: 'Ben Fiddich' });
    const close = within(dialog).getByRole('button', { name: 'Close detail panel' });
    const evidence = within(dialog).getByRole('link', { name: 'Tabelog record for Ben Fiddich' });

    expect(document.body.style.overflow).toBe('hidden');
    expect(evidence.getAttribute('target')).toBe('_blank');
    expect(evidence.getAttribute('rel')).toBe('noopener noreferrer');
    await waitFor(() => expect(document.activeElement).toBe(close));

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(evidence);
    await user.tab();
    expect(document.activeElement).toBe(close);

    const backdrop = document.querySelector('div.fixed.inset-0[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog', { name: 'Ben Fiddich' })).toBeNull();
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  });

  it('keeps modal state and scroll locking correct across a rapid close and reopen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /View evidence for Ben Fiddich/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Close detail panel' }));
    fireEvent.click(screen.getByRole('button', { name: /View evidence for Tempura Kondo/i }));

    expect(screen.queryByRole('dialog', { name: 'Ben Fiddich' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Tempura Kondo' })).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Tempura Kondo' })).toBeNull();
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  });
});
