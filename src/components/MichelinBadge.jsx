// Inline SVG star used for Michelin star ratings. Keeps rendering consistent
// across all OS/browser emoji engines.
function StarIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1.5l1.763 3.572 3.937.572-2.85 2.777.673 3.921L8 10.395l-3.523 1.947.673-3.921-2.85-2.777 3.937-.572L8 1.5z" />
    </svg>
  );
}

export default function MichelinBadge({ michelin, compact = false }) {
  if (!michelin) return null;

  if (michelin.stars > 0) {
    const stars = michelin.stars;
    return (
      <span
        className={`inline-flex items-center gap-0.5 font-body font-semibold text-gold ${compact ? 'text-xs' : 'text-sm'}`}
        title={`${stars} Michelin Star${stars > 1 ? 's' : ''}`}
      >
        {Array.from({ length: stars }, (_, i) => (
          <StarIcon
            key={i}
            className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}
          />
        ))}
        {!compact && (
          <span className="text-gold/70 ml-1">
            Michelin {stars === 1 ? 'Star' : 'Stars'}
          </span>
        )}
      </span>
    );
  }

  if (michelin.bib) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-body font-medium ${compact ? 'text-xs' : 'text-sm'}`}
        title="Bib Gourmand"
      >
        <span
          className={`inline-flex items-center justify-center rounded font-body font-bold text-accent bg-accent/10 border border-accent/25 leading-none ${compact ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'}`}
        >
          BIB
        </span>
        {!compact && <span className="text-accent/80">Bib Gourmand</span>}
      </span>
    );
  }

  if (michelin.plate) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-body font-medium text-muted ${compact ? 'text-xs' : 'text-sm'}`}
        title="Michelin Plate"
      >
        <span
          className={`inline-flex items-center justify-center rounded font-body font-bold text-muted bg-border/40 border border-border leading-none ${compact ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'}`}
        >
          PLATE
        </span>
        {!compact && <span>Michelin Plate</span>}
      </span>
    );
  }

  return null;
}
