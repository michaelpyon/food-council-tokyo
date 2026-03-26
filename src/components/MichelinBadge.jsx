export default function MichelinBadge({ michelin, compact = false }) {
  if (!michelin) return null;

  if (michelin.stars > 0) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 font-body font-semibold text-gold ${compact ? 'text-xs' : 'text-sm'}`}
        title={`${michelin.stars} Michelin Star${michelin.stars > 1 ? 's' : ''}`}
      >
        {'★'.repeat(michelin.stars)}
        {!compact && <span className="text-gold/70 ml-0.5">Michelin</span>}
      </span>
    );
  }

  if (michelin.bib) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-body font-medium text-accent ${compact ? 'text-xs' : 'text-sm'}`}
        title="Bib Gourmand"
      >
        <span>😋</span>
        {!compact && <span>Bib Gourmand</span>}
      </span>
    );
  }

  if (michelin.plate) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-body font-medium text-muted ${compact ? 'text-xs' : 'text-sm'}`}
        title="Michelin Plate"
      >
        <span>🍽️</span>
        {!compact && <span>Michelin Plate</span>}
      </span>
    );
  }

  return null;
}
