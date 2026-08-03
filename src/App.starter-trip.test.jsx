import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('verified trip flows', () => {
  it('saves a verified record and shows direct evidence in My Trip', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Save Ben Fiddich to My Trip' }));
    await user.click(screen.getByRole('button', { name: 'Open My Trip (1 saved)' }));

    const tripPanel = screen.getByRole('dialog', { name: 'My Trip' });
    expect(within(tripPanel).getByText('1 verified place saved')).toBeTruthy();
    expect(within(tripPanel).getByText('Ben Fiddich')).toBeTruthy();
    expect(
      within(tripPanel).getByRole('link', { name: 'Tabelog record for Ben Fiddich' }),
    ).toBeTruthy();
    expect(within(tripPanel).queryByText(/score/i)).toBeNull();
  });

  it('opens a shared trip immediately and discloses omitted legacy IDs', () => {
    window.history.replaceState(null, '', '/?trip=ben-fiddich,tempura-yamanoue');
    render(<App />);

    const tripPanel = screen.getByRole('dialog', { name: 'My Trip' });
    expect(within(tripPanel).getByText('Ben Fiddich')).toBeTruthy();
    expect(within(tripPanel).getByText('1 legacy place was left out')).toBeTruthy();
    expect(within(tripPanel).queryByText('Yamanoue Tempura')).toBeNull();
  });
});
