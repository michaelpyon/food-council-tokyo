import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DetailPanel from './DetailPanel';

describe('publication gate explanation', () => {
  // Regression: ISSUE-003 — the detail panel claimed corrected audit flags did not exist
  // Found by /qa on 2026-08-03
  // Report: .gstack/qa-reports/qa-report-localhost-verified91-2026-08-03.md
  it('describes blocking issues instead of claiming every audit flag is absent', () => {
    render(
      <DetailPanel
        restaurant={{
          id: 'ryugin',
          name: 'Nihonryori RyuGin',
          nameJa: '日本料理 龍吟',
          neighborhood: 'Hibiya',
          lastVerified: '2026-07-30',
          auditIndex: 22,
          michelin: null,
          sources: [{ type: 'tabelog', url: 'https://tabelog.com/example' }],
        }}
        onClose={vi.fn()}
        onExitComplete={vi.fn()}
        onSave={vi.fn()}
        isSaved={false}
      />,
    );

    expect(screen.getByText(/free of blocking issues/)).toBeTruthy();
    expect(screen.queryByText(/no unresolved flags/)).toBeNull();
  });
});
