import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScoreBadge from './ScoreBadge';
import MichelinBadge from './MichelinBadge';
import { PRICE_LABELS } from '../data/restaurants';
import { mapsUrl, tabelogUrl } from '../utils/links';
import { buildTripUrl, buildTripText, groupByNeighborhood } from '../utils/tripUrl';

export default function SavedListPanel({ isOpen, onClose, savedRestaurants, savedIds, filters, onRemove, onSelect }) {
  const [shareMsg, setShareMsg] = useState('');
  const [copyMsg, setCopyMsg] = useState('');

  const flash = useCallback((setter, text) => {
    setter(text);
    setTimeout(() => setter(''), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    const url = buildTripUrl(savedIds, filters);
    const title = 'My Tokyo trip';
    const text = `My Tokyo trip: ${savedRestaurants.length} restaurant${savedRestaurants.length !== 1 ? 's' : ''} from Food Council: Tokyo`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash(setShareMsg, 'Link copied');
    } catch {
      flash(setShareMsg, 'Copy failed');
    }
  }, [savedIds, filters, savedRestaurants.length, flash]);

  const handleCopyText = useCallback(async () => {
    const text = buildTripText(savedRestaurants, savedIds, filters);
    try {
      await navigator.clipboard.writeText(text);
      flash(setCopyMsg, 'Copied');
    } catch {
      flash(setCopyMsg, 'Copy failed');
    }
  }, [savedRestaurants, savedIds, filters, flash]);

  const groups = groupByNeighborhood(savedRestaurants);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-surface border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-5 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-text">My Trip</h2>
                  <p className="text-xs font-body text-muted mt-0.5">
                    {savedRestaurants.length} restaurant{savedRestaurants.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-border/30 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close saved list"
                >
                  <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Share + Export actions */}
              {savedRestaurants.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-accent text-white text-sm font-body font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {shareMsg || 'Share my trip'}
                  </button>
                  <button
                    onClick={handleCopyText}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border text-sm font-body font-medium text-text hover:bg-bg/60 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copyMsg || 'Copy as text'}
                  </button>
                </div>
              )}
            </div>

            {/* Itinerary grouped by neighborhood */}
            <div className="p-4 space-y-5">
              {savedRestaurants.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🗾</div>
                  <p className="text-sm font-body text-muted">No restaurants saved yet.</p>
                  <p className="text-xs font-body text-muted mt-1">Tap the heart on any card to start building your trip.</p>
                </div>
              ) : (
                groups.map((group, gi) => (
                  <div key={group.neighborhood}>
                    <div className="flex items-baseline justify-between mb-2 px-1">
                      <h3 className="font-display text-sm font-semibold text-text uppercase tracking-wider">
                        {group.neighborhood}
                      </h3>
                      <span className="text-xs font-body text-muted">
                        {group.items.length} stop{group.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.items.map((r, i) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (gi * 0.04) + (i * 0.04), type: 'spring', duration: 0.3, bounce: 0 }}
                          className="rounded-lg border border-border hover:bg-bg/50 transition-colors"
                        >
                          <div
                            className="flex items-center gap-3 p-3 cursor-pointer"
                            onClick={() => { onClose(); onSelect(r); }}
                          >
                            <ScoreBadge score={r._compositeScore || 0} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-display text-sm font-semibold text-text truncate">{r.name}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-body text-muted">{r.cuisine}</span>
                                <span className="text-border">·</span>
                                <span className="text-xs font-body font-medium text-text">{PRICE_LABELS[r.priceRange]}</span>
                              </div>
                              {r.michelin?.stars > 0 && (
                                <MichelinBadge michelin={r.michelin} compact />
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(r.id);
                              }}
                              className="shrink-0 w-7 h-7 rounded-md hover:bg-accent/10 flex items-center justify-center transition-colors cursor-pointer"
                              aria-label="Remove from saved"
                            >
                              <svg className="w-3.5 h-3.5 text-muted hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Per-pick outbound links */}
                          <div className="flex items-center gap-2 px-3 pb-3">
                            <a
                              href={mapsUrl(r)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 h-7 rounded-md border border-border text-xs font-body font-medium text-text hover:bg-surface transition-colors"
                              aria-label={`Find ${r.name} on Google Maps`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Map
                            </a>
                            <a
                              href={tabelogUrl(r)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 h-7 rounded-md border border-border text-xs font-body font-medium text-text hover:bg-surface transition-colors"
                              aria-label={`Search ${r.name} on Tabelog`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Tabelog
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
