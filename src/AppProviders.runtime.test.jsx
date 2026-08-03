import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.unmock('motion/react');

describe('real MotionConfig runtime', () => {
  it('provides the user reduced-motion policy through motion/react context', async () => {
    const [{ default: AppProviders }, { MotionConfigContext }] = await Promise.all([
      import('./AppProviders'),
      import('motion/react'),
    ]);

    function MotionPolicyProbe() {
      const config = useContext(MotionConfigContext);
      return <span data-testid="runtime-motion-policy">{config.reducedMotion}</span>;
    }

    render(
      <AppProviders>
        <MotionPolicyProbe />
      </AppProviders>,
    );

    expect(screen.getByTestId('runtime-motion-policy').textContent).toBe('user');
  });
});
