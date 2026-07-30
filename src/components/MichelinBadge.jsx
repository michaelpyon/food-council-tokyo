import { MICHELIN_DISTINCTIONS } from '../utils/michelin';

function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.763 3.572 3.937.572-2.85 2.777.673 3.921L8 10.395l-3.523 1.947.673-3.921-2.85-2.777 3.937-.572L8 1.5z" />
    </svg>
  );
}

export default function MichelinBadge({ michelin, compact = false }) {
  const config = michelin?.verified ? MICHELIN_DISTINCTIONS[michelin.distinction] : null;
  if (!config) return null;

  if (config.stars) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-body font-semibold text-gold ${compact ? 'text-xs' : 'text-sm'}`}
        title={`${config.label}, verified for Michelin Guide ${michelin.edition}`}
      >
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: config.stars }, (_, index) => (
            <StarIcon key={index} className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          ))}
        </span>
        <span>{compact ? config.label.replace(' Michelin', '') : config.label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded border border-gold/30 bg-gold-light font-body font-bold text-gold ${
        compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]'
      }`}
      title={`${config.label}, verified for Michelin Guide ${michelin.edition}`}
    >
      {config.short}
    </span>
  );
}
