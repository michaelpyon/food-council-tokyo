import { motion as Motion } from 'motion/react';
import MichelinBadge from './MichelinBadge';
import SourceChips from './SourceChips';
import { michelinLabel } from '../utils/michelin';

function formatVerifiedDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function RestaurantCard({ restaurant, onClick, onSave, isSaved }) {
  const verifiedDate = formatVerifiedDate(restaurant.lastVerified);
  const detailsLabel = [
    `View evidence for ${restaurant.name}`,
    restaurant.nameJa,
    restaurant.neighborhood,
    `operating status verified ${verifiedDate}`,
    michelinLabel(restaurant.michelin),
  ].filter(Boolean).join(', ');

  return (
    <Motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      className="group flex min-h-64 flex-col justify-between rounded-xl border border-border bg-surface p-5 hover:border-text/25"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-body font-semibold text-accent">
              {restaurant.neighborhood}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-text">
              {restaurant.name}
            </h2>
            {restaurant.nameJa && (
              <p lang="ja" className="mt-1 text-sm font-body text-muted">
                {restaurant.nameJa}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSave(restaurant.id)}
            className={`w-11 h-11 shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
              isSaved
                ? 'border-accent/30 bg-accent/10 text-accent'
                : 'border-border bg-surface text-muted hover:text-accent hover:border-accent/30'
            }`}
            aria-label={isSaved ? `Remove ${restaurant.name} from My Trip` : `Save ${restaurant.name} to My Trip`}
          >
            <svg
              className={`w-4 h-4 ${isSaved ? 'fill-accent' : ''}`}
              fill={isSaved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {restaurant.michelin && (
          <div className="mt-4">
            <MichelinBadge michelin={restaurant.michelin} compact />
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-body leading-relaxed text-muted">
            Operating status verified{' '}
            <time dateTime={restaurant.lastVerified}>{verifiedDate}</time>.
          </p>
          <div className="mt-3">
            <SourceChips restaurant={restaurant} compact />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={event => onClick(restaurant, event.currentTarget)}
        aria-label={detailsLabel}
        className="mt-5 inline-flex h-11 items-center justify-between rounded-md border border-border px-3 text-left text-xs font-body font-semibold text-text hover:border-accent/35 hover:text-accent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        Review evidence
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m6 3 5 5-5 5" />
        </svg>
      </button>
    </Motion.article>
  );
}
