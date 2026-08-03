import { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import MichelinBadge from './MichelinBadge';
import SourceChips from './SourceChips';
import { buildTripUrl, buildTripText, groupByNeighborhood } from '../utils/tripUrl';
import { copyText } from '../utils/copyText';
import { useModalPanel } from '../hooks/useModalPanel';

export default function SavedListPanel({
  isOpen,
  onClose,
  savedRestaurants,
  savedIds,
  omittedTripIds,
  onRemove,
  onSelect,
}) {
  const [shareMsg, setShareMsg] = useState('');
  const [copyMsg, setCopyMsg] = useState('');
  const { panelRef, initialFocusRef } = useModalPanel(isOpen, onClose);

  const flash = useCallback((setter, text) => {
    setter(text);
    window.setTimeout(() => setter(''), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    const url = buildTripUrl(savedIds);
    const title = 'My Tokyo trip';
    const text = `My Tokyo trip: ${savedRestaurants.length} verified place${savedRestaurants.length !== 1 ? 's' : ''} from Food Council: Tokyo`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fall back to copying the verified trip URL.
      }
    }
    try {
      await copyText(url);
      flash(setShareMsg, 'Link copied');
    } catch {
      flash(setShareMsg, 'Copy failed');
    }
  }, [savedIds, savedRestaurants.length, flash]);

  const handleCopyText = useCallback(async () => {
    try {
      await copyText(buildTripText(savedRestaurants, savedIds));
      flash(setCopyMsg, 'Copied');
    } catch {
      flash(setCopyMsg, 'Copy failed');
    }
  }, [savedRestaurants, savedIds, flash]);

  const groups = groupByNeighborhood(savedRestaurants);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-list-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-surface border-l border-border z-[51] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-5 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="saved-list-title" className="font-display text-xl font-semibold text-text">My Trip</h2>
                  <p className="text-xs font-body text-muted mt-0.5">
                    {savedRestaurants.length} verified place{savedRestaurants.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
                <button
                  ref={initialFocusRef}
                  type="button"
                  onClick={onClose}
                  className="w-11 h-11 rounded-lg hover:bg-border/30 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  aria-label="Close saved list"
                >
                  <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {savedRestaurants.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-lg bg-accent text-white text-sm font-body font-semibold hover:bg-accent-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {shareMsg || 'Share trip'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-lg border border-border text-sm font-body font-semibold text-text hover:bg-bg/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copyMsg || 'Copy evidence'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 space-y-5">
              {omittedTripIds.length > 0 && (
                <div role="status" className="rounded-lg border border-accent/25 bg-accent/5 px-4 py-3">
                  <p className="text-sm font-body font-semibold text-text">
                    {omittedTripIds.length} legacy place{omittedTripIds.length !== 1 ? 's were' : ' was'} left out
                  </p>
                  <p className="mt-1 text-xs font-body leading-relaxed text-muted">
                    Those IDs didn’t pass the current verification gate. They weren’t added to this trip.
                  </p>
                </div>
              )}

              {savedRestaurants.length === 0 ? (
                <div className="border-t border-text py-12">
                  <p className="font-display text-xl text-text">No verified places saved</p>
                  <p className="text-sm font-body text-muted mt-2">Use the heart on a directory record to build a shareable trip.</p>
                </div>
              ) : (
                groups.map((group, groupIndex) => (
                  <section key={group.neighborhood}>
                    <div className="flex items-baseline justify-between mb-2 px-1">
                      <h3 className="font-display text-base font-semibold text-text">
                        {group.neighborhood}
                      </h3>
                      <span className="text-xs font-body text-muted">
                        {group.items.length} stop{group.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.items.map((restaurant, index) => (
                        <Motion.article
                          key={restaurant.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupIndex * 0.04) + (index * 0.04), type: 'spring', duration: 0.3, bounce: 0 }}
                          className="rounded-lg border border-border p-3"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                              onClick={() => onSelect(restaurant)}
                              aria-label={`Review evidence for ${restaurant.name}`}
                            >
                              <h4 className="font-display text-base font-semibold text-text">{restaurant.name}</h4>
                              {restaurant.nameJa && (
                                <p lang="ja" className="mt-0.5 text-xs font-body text-muted">{restaurant.nameJa}</p>
                              )}
                              <p className="mt-2 text-[11px] font-body text-muted">
                                Verified {restaurant.lastVerified}
                              </p>
                              {restaurant.michelin && (
                                <div className="mt-2">
                                  <MichelinBadge michelin={restaurant.michelin} compact />
                                </div>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemove(restaurant.id)}
                              className="shrink-0 w-11 h-11 rounded-md hover:bg-accent/10 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                              aria-label={`Remove ${restaurant.name} from My Trip`}
                            >
                              <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-3 border-t border-border pt-3">
                            <SourceChips restaurant={restaurant} compact />
                          </div>
                        </Motion.article>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
