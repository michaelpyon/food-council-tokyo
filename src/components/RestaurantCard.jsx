import { motion as Motion } from 'motion/react';
import ScoreBadge from './ScoreBadge';
import MichelinBadge from './MichelinBadge';
import { PRICE_LABELS } from '../data/restaurants';
import { mapsUrl, tabelogUrl } from '../utils/links';

export default function RestaurantCard({ restaurant, onClick, onSave, isSaved }) {
  const r = restaurant;

  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      className="group bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-border/80 transition-shadow"
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-[11px] font-body font-semibold uppercase tracking-wider">
            <span className="text-accent">{r.cuisine}</span>
            <span className="w-px h-3 bg-border" aria-hidden="true" />
            <span className="text-muted">{PRICE_LABELS[r.priceRange]}</span>
          </div>

          <button
            type="button"
            onClick={() => onSave(r.id)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
              isSaved
                ? 'border-accent/30 bg-accent/10 text-accent'
                : 'border-border bg-surface text-muted hover:text-accent hover:border-accent/30'
            }`}
            aria-label={isSaved ? 'Remove from My Trip' : 'Save to My Trip'}
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

        <button
          type="button"
          onClick={() => onClick(r)}
          aria-label={`View details for ${r.name}`}
          className="block w-full text-left rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <div className="flex items-start gap-2.5">
            <ScoreBadge score={r._compositeScore || 0} size="sm" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-semibold text-text leading-tight truncate">
                {r.name}
              </h3>
              <p className="text-xs font-body text-muted mt-0.5 truncate">
                {r.nameJa}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs font-body text-muted">
            {r.subCuisine && (
              <>
                <span>{r.subCuisine}</span>
                <span className="text-border">·</span>
              </>
            )}
            <span>{r.neighborhood}</span>
          </div>

          {r.michelin && (r.michelin.stars > 0 || r.michelin.bib) && (
            <div className="mt-2">
              <MichelinBadge michelin={r.michelin} compact />
            </div>
          )}

          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
            {r.tabelog?.score && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-body font-medium text-muted uppercase tracking-wider">Tab</span>
                <span className="text-xs font-body font-bold text-text">{r.tabelog.score.toFixed(2)}</span>
              </div>
            )}
            {r.google?.rating && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-body font-medium text-muted uppercase tracking-wider">Ggl</span>
                <span className="text-xs font-body font-bold text-text">{r.google.rating.toFixed(1)}</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[10px] font-body text-muted">{r.sources?.length || 0} sources</span>
            </div>
          </div>
        </button>

        {/* Outbound actions */}
        <div className="flex items-center gap-2 mt-2">
          <a
            href={mapsUrl(r)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1 h-7 rounded-md border border-border text-xs font-body font-medium text-text hover:bg-bg/60 transition-colors"
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
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1 h-7 rounded-md border border-border text-xs font-body font-medium text-text hover:bg-bg/60 transition-colors"
            aria-label={`Search ${r.name} on Tabelog`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tabelog
          </a>
        </div>
      </div>
    </Motion.article>
  );
}
