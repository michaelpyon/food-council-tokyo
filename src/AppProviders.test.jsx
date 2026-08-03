import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppProviders from './AppProviders';

describe('app motion policy', () => {
  it('passes the user reduced-motion preference to MotionConfig', () => {
    render(
      <AppProviders>
        <span>Application</span>
      </AppProviders>,
    );

    expect(screen.getByTestId('motion-config').dataset.reducedMotion).toBe('user');
  });
});
