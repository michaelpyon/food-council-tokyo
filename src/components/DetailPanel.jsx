import { motion as Motion, AnimatePresence } from 'motion/react';
import MichelinBadge from './MichelinBadge';
import SourceChips from './SourceChips';
import { useModalPanel } from '../hooks/useModalPanel';

function formatVerifiedDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function DetailPanel({ restaurant, onClose, onSave, isSaved }) {
  const { panelRef, initialFocusRef } = useModalPanel(Boolean(restaurant), onClose);

  return (
    <AnimatePresence>
      {restaurant && (
        <>
          <Motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-text/30 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <Motion.aside
            ref={panelRef}
            key="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`detail-title-${restaurant.id}`}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-surface border-l border-border z-[51] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between z-10">
              <button
                ref={initialFocusRef}
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-lg hover:bg-border/30 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                aria-label="Close detail panel"
              >
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onSave(restaurant.id)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-body font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
                  isSaved
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text hover:bg-border/30'
                }`}
                aria-label={isSaved ? `Remove ${restaurant.name} from My Trip` : `Save ${restaurant.name} to My Trip`}
              >
                <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isSaved ? 'Saved' : 'Save to Trip'}
              </button>
            </div>

            <div className="px-5 py-6">
              <p className="text-xs font-body font-semibold text-accent">
                {restaurant.neighborhood}
              </p>
              <h2
                id={`detail-title-${restaurant.id}`}
                className="mt-2 font-display text-3xl font-semibold text-text leading-tight"
              >
                {restaurant.name}
              </h2>
              {restaurant.nameJa && (
                <p lang="ja" className="mt-1 text-base font-body text-muted">
                  {restaurant.nameJa}
                </p>
              )}

              {restaurant.michelin && (
                <div className="mt-5 rounded-lg border border-gold/20 bg-gold-light/55 px-4 py-3">
                  <MichelinBadge michelin={restaurant.michelin} />
                </div>
              )}

              <section className="mt-8 border-t border-border pt-6" aria-labelledby={`verification-title-${restaurant.id}`}>
                <h3
                  id={`verification-title-${restaurant.id}`}
                  className="font-display text-xl font-semibold text-text"
                >
                  Verification record
                </h3>
                <dl className="mt-4 divide-y divide-border border-y border-border">
                  <div className="flex items-start justify-between gap-5 py-3">
                    <dt className="text-xs font-body font-semibold text-muted">Operating status</dt>
                    <dd className="text-sm font-body font-semibold text-text">Verified operating</dd>
                  </div>
                  <div className="flex items-start justify-between gap-5 py-3">
                    <dt className="text-xs font-body font-semibold text-muted">Checked</dt>
                    <dd className="text-sm font-body font-semibold text-text">
                      <time dateTime={restaurant.lastVerified}>{formatVerifiedDate(restaurant.lastVerified)}</time>
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-5 py-3">
                    <dt className="text-xs font-body font-semibold text-muted">Audit record</dt>
                    <dd className="text-sm font-body font-semibold text-text">#{restaurant.auditIndex + 1}</dd>
                  </div>
                </dl>
              </section>

              <section className="mt-8" aria-labelledby={`evidence-title-${restaurant.id}`}>
                <h3
                  id={`evidence-title-${restaurant.id}`}
                  className="font-display text-xl font-semibold text-text"
                >
                  Direct evidence
                </h3>
                <p className="mt-2 text-sm font-body leading-relaxed text-muted">
                  These links support the branch identity, operating status, location, or current Michelin distinction. They don’t support ratings or prices.
                </p>
                <div className="mt-4">
                  <SourceChips restaurant={restaurant} />
                </div>
              </section>

              <section className="mt-8 rounded-lg border border-border bg-bg px-4 py-4">
                <h3 className="text-sm font-body font-semibold text-text">Why this record is public</h3>
                <p className="mt-1.5 text-xs font-body leading-relaxed text-muted">
                  It passed the strict audit gate: operating, high confidence, no unresolved flags, and at least 1 direct evidence URL.
                </p>
              </section>
            </div>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
