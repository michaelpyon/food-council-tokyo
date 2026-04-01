import { motion } from 'motion/react';
import ScoreBadge from './ScoreBadge';
import MichelinBadge from './MichelinBadge';
import { PRICE_LABELS } from '../data/restaurants';

// Deterministic color from cuisine for placeholder images
const CUISINE_COLORS = {
  Sushi: ['#1a365d', '#2a4a7f'],
  Ramen: ['#7c2d12', '#9a3412'],
  Kaiseki: ['#064e3b', '#065f46'],
  Tempura: ['#78350f', '#92400e'],
  Yakitori: ['#581c87', '#6b21a8'],
  Tonkatsu: ['#9a3412', '#b45309'],
  Udon: ['#1e3a5f', '#2563eb'],
  Soba: ['#374151', '#4b5563'],
  Unagi: ['#3f6212', '#4d7c0f'],
  Izakaya: ['#7c2d12', '#b91c1c'],
  Teppanyaki: ['#1f2937', '#374151'],
  Wagyu: ['#450a0a', '#7f1d1d'],
  Curry: ['#92400e', '#b45309'],
  Okonomiyaki: ['#9d174d', '#be185d'],
  Yoshoku: ['#4c1d95', '#5b21b6'],
  French: ['#1e3a5f', '#1e40af'],
  Italian: ['#064e3b', '#047857'],
  Chinese: ['#991b1b', '#b91c1c'],
  Korean: ['#7c2d12', '#c2410c'],
  Cafe: ['#78350f', '#a16207'],
  Bakery: ['#92400e', '#d97706'],
  Bar: ['#1f2937', '#111827'],
  Dessert: ['#831843', '#be185d'],
};

function PlaceholderImage({ cuisine, name }) {
  const colors = CUISINE_COLORS[cuisine] || ['#374151', '#1f2937'];
  return (
    <div
      className="w-full h-full flex items-end p-3"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      <span className="text-white/60 text-xs font-body font-medium uppercase tracking-wider">
        {cuisine}
      </span>
    </div>
  );
}

export default function RestaurantCard({ restaurant, onClick, onSave, isSaved }) {
  const r = restaurant;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      onClick={() => onClick(r)}
      className="group bg-surface rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md hover:border-border/80 transition-shadow"
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <PlaceholderImage cuisine={r.cuisine} name={r.name} />

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(r.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
          aria-label={isSaved ? 'Remove from My Trip' : 'Save to My Trip'}
        >
          <svg
            className={`w-4 h-4 ${isSaved ? 'text-accent fill-accent' : 'text-white'}`}
            fill={isSaved ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Price badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-xs font-body font-semibold">
          {PRICE_LABELS[r.priceRange]}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Top row: score + name */}
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

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 text-xs font-body text-muted">
          <span className="font-medium text-text">{r.cuisine}</span>
          {r.subCuisine && (
            <>
              <span className="text-border">·</span>
              <span>{r.subCuisine}</span>
            </>
          )}
          <span className="text-border">·</span>
          <span>{r.neighborhood}</span>
        </div>

        {/* Michelin badge */}
        {r.michelin && (r.michelin.stars > 0 || r.michelin.bib) && (
          <div className="mt-2">
            <MichelinBadge michelin={r.michelin} compact />
          </div>
        )}

        {/* Scores row */}
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
      </div>
    </motion.article>
  );
}
