import { motion, AnimatePresence } from 'motion/react';
import ScoreBadge from './ScoreBadge';
import MichelinBadge from './MichelinBadge';
import { PRICE_LABELS } from '../data/restaurants';

export default function SavedListPanel({ isOpen, onClose, savedRestaurants, onRemove, onSelect }) {
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
            <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center justify-between z-10">
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

            {/* List */}
            <div className="p-4 space-y-2">
              {savedRestaurants.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🗾</div>
                  <p className="text-sm font-body text-muted">No restaurants saved yet.</p>
                  <p className="text-xs font-body text-muted mt-1">Tap the bookmark icon on any card to start building your trip.</p>
                </div>
              ) : (
                savedRestaurants.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring', duration: 0.3, bounce: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-bg/50 cursor-pointer transition-colors"
                    onClick={() => { onClose(); onSelect(r); }}
                  >
                    <ScoreBadge score={r._compositeScore || 0} size="sm" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-semibold text-text truncate">{r.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-body text-muted">{r.cuisine}</span>
                        <span className="text-border">·</span>
                        <span className="text-xs font-body text-muted">{r.neighborhood}</span>
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
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
