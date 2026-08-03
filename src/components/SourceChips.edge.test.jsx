import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SourceChips from './SourceChips';

describe('SourceChips edge cases', () => {
  it('filters unusable and duplicate sources, labels unknown types, and renders nothing when empty', () => {
    const { container, rerender } = render(
      <SourceChips
        restaurant={{
          name: 'Fallback Place',
          sources: [
            null,
            { type: 'official' },
            { type: 'other', url: '' },
            { type: 'unknown', url: 'https://example.com/evidence' },
            { type: 'official', url: 'https://example.com/evidence' },
          ],
        }}
      />,
    );

    const link = screen.getByRole('link', { name: 'Evidence source for Fallback Place' });
    expect(link.getAttribute('href')).toBe('https://example.com/evidence');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getAllByRole('link')).toHaveLength(1);

    rerender(<SourceChips restaurant={{ name: 'No Sources', sources: [null, { url: '' }] }} />);
    expect(container.querySelector('a')).toBeNull();
  });
});
