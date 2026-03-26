import { motion, AnimatePresence } from 'motion/react';
import ScoreBadge from './ScoreBadge';
import MichelinBadge from './MichelinBadge';
import SourceChips from './SourceChips';
import { getScoreTier, getConfidence, getConfidenceLabel } from '../utils/scoring';
import { PRICE_LABELS } from '../data/restaurants';

function ScoreRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs font-body font-medium text-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm font-body font-bold text-text">{value}</span>
    </div>
  );
}

function ConfidenceBar({ restaurant }) {
  const confidence = getConfidence(restaurant);
  const { label, color } = getConfidenceLabel(restaurant);
  const pct = Math.round(confidence * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-body font-medium text-muted uppercase tracking-wider">Confidence</span>
        <span className={`text-xs font-body font-semibold ${color}`}>{label} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] font-body text-muted mt-1">
        Based on review volume ({(restaurant.tabelog?.reviews || 0).toLocaleString()} Tabelog, {(restaurant.google?.reviews || 0).toLocaleString()} Google) and editorial backing.
      </p>
    </div>
  );
}

export default function DetailPanel({ restaurant, onClose, onSave, isSaved }) {
  return (
    <AnimatePresence>
      {restaurant && (
        <>
          {/* Backdrop */}
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.aside
            key="detail-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-surface border-l border-border z-[51] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between z-10">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-border/30 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close detail panel"
              >
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => onSave(restaurant.id)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-sm font-body font-medium transition-colors cursor-pointer ${
                  isSaved
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text hover:bg-border/30'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isSaved ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isSaved ? 'Saved' : 'Save to Trip'}
              </button>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Name + Score */}
              <div className="flex items-start gap-4">
                <ScoreBadge score={restaurant._compositeScore || 0} size="lg" />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-text leading-tight">
                    {restaurant.name}
                  </h2>
                  <p className="text-sm font-body text-muted mt-0.5">{restaurant.nameJa}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-body font-medium text-text">{restaurant.cuisine}</span>
                    {restaurant.subCuisine && (
                      <>
                        <span className="text-border">·</span>
                        <span className="text-sm font-body text-muted">{restaurant.subCuisine}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tier label */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-body font-semibold ${getScoreTier(restaurant._compositeScore || 0).color}`}>
                  {getScoreTier(restaurant._compositeScore || 0).label}
                </span>
                <span className="text-border">·</span>
                <span className="text-sm font-body text-muted">{restaurant.neighborhood}</span>
                <span className="text-border">·</span>
                <span className="text-sm font-body font-semibold text-text">{PRICE_LABELS[restaurant.priceRange]}</span>
              </div>

              {/* Michelin */}
              {restaurant.michelin && (restaurant.michelin.stars > 0 || restaurant.michelin.bib || restaurant.michelin.plate) && (
                <div className="bg-gold-light/50 border border-gold/20 rounded-lg px-4 py-3">
                  <MichelinBadge michelin={restaurant.michelin} />
                </div>
              )}

              {/* Description */}
              <p className="text-sm font-body text-text leading-relaxed">
                {restaurant.description}
              </p>

              {/* Score breakdown */}
              <div className="bg-bg rounded-lg p-4 space-y-0">
                <h4 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-2">Score Breakdown</h4>
                <ScoreRow label="Tabelog" value={restaurant.tabelog?.score?.toFixed(2)} />
                <ScoreRow label="Google" value={restaurant.google?.rating?.toFixed(1)} />
                {restaurant.michelin?.stars > 0 && (
                  <ScoreRow label="Michelin" value={`${restaurant.michelin.stars} Star${restaurant.michelin.stars > 1 ? 's' : ''}`} />
                )}
                {restaurant.tabelog?.reviews && (
                  <ScoreRow label="Tabelog Reviews" value={restaurant.tabelog.reviews.toLocaleString()} />
                )}
                {restaurant.google?.reviews && (
                  <ScoreRow label="Google Reviews" value={restaurant.google.reviews.toLocaleString()} />
                )}
              </div>

              {/* Confidence */}
              <div className="bg-bg rounded-lg p-4">
                <ConfidenceBar restaurant={restaurant} />
              </div>

              {/* Sources */}
              <div>
                <h4 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-2">Featured In</h4>
                <SourceChips sources={restaurant.sources} />
              </div>

              {/* Awards */}
              {restaurant.awards && restaurant.awards.length > 0 && (
                <div>
                  <h4 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-2">Awards</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {restaurant.awards.map(award => (
                      <span
                        key={award}
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold-light text-gold text-xs font-body font-medium"
                      >
                        🏆 {award}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {restaurant.tags && restaurant.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-2">Details</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {restaurant.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-bg border border-border text-xs font-body text-muted"
                      >
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reservation link */}
              {restaurant.reservationUrl && (
                <a
                  href={restaurant.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-lg bg-accent text-white text-sm font-body font-semibold hover:bg-accent-hover transition-colors"
                >
                  Reserve on Tabelog →
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
