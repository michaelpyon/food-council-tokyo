const SOURCE_CONFIG = {
  tabelog: { label: 'Tabelog', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  google: { label: 'Google', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  michelin: { label: 'Michelin', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  eater: { label: 'Eater', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cnt: { label: 'CN Traveler', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  nyt: { label: 'NYT', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  timeout: { label: 'Time Out', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

export default function SourceChips({ sources, compact = false }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {sources.map(source => {
        const config = SOURCE_CONFIG[source];
        if (!config) return null;
        return (
          <span
            key={source}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-body font-medium ${config.bg} ${config.text} ${config.border} ${compact ? 'text-[10px]' : 'text-xs'}`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
}
