import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MichelinBadge from './MichelinBadge';

describe('MichelinBadge variants', () => {
  it('renders compact stars and non-star distinctions from the verified vocabulary', () => {
    const { container, rerender } = render(
      <MichelinBadge
        compact
        michelin={{ verified: true, distinction: 'three_stars', edition: 2026 }}
      />,
    );

    expect(screen.getByText('3 stars')).toBeTruthy();
    expect(container.querySelectorAll('svg')).toHaveLength(3);

    rerender(
      <MichelinBadge
        michelin={{ verified: true, distinction: 'selected', edition: 2026 }}
      />,
    );
    expect(screen.getByText('SELECTED')).toBeTruthy();
    expect(screen.getByTitle('Michelin Selected, verified for Michelin Guide 2026')).toBeTruthy();
  });

  it('renders nothing for unverified or unknown distinctions', () => {
    const { container, rerender } = render(
      <MichelinBadge michelin={{ verified: false, distinction: 'three_stars', edition: 2026 }} />,
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <MichelinBadge michelin={{ verified: true, distinction: 'legacy_plate', edition: 2026 }} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
