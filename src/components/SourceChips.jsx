import { sourceLabel, verifiedSources } from '../utils/links';

export default function SourceChips({ restaurant, compact = false }) {
  const sources = verifiedSources(restaurant);
  if (sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map(source => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${sourceLabel(source)} for ${restaurant.name}`}
          className={`inline-flex min-h-11 items-center gap-1 rounded-md border border-border bg-surface font-body font-semibold text-text hover:border-accent/40 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 ${
            compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-2 text-xs'
          }`}
        >
          {sourceLabel(source)}
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 3h7v7M13 3 5 11" />
            <path d="M11 9v4H3V5h4" />
          </svg>
        </a>
      ))}
    </div>
  );
}
