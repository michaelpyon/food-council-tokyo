import { SORT_OPTIONS } from '../utils/filters';

export default function FilterBar({
  filters,
  onFilterChange,
  sortKey,
  onSortChange,
  neighborhoods,
  michelinCount,
}) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.neighborhood && filters.neighborhood !== 'all',
    filters.michelinOnly,
  ].filter(Boolean).length;

  const selectedNeighborhood = neighborhoods.find(
    option => option.value === filters.neighborhood,
  );
  const michelinUnavailable = Boolean(
    selectedNeighborhood && selectedNeighborhood.michelinCount === 0,
  );

  const clearFilters = () => {
    onFilterChange({
      neighborhood: 'all',
      michelinOnly: false,
      query: filters.query || '',
    });
  };

  return (
    <div className="border-y border-border bg-surface/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="neighborhood-filter">Neighborhood</label>
          <select
            id="neighborhood-filter"
            value={filters.neighborhood || 'all'}
            onChange={(event) => handleChange('neighborhood', event.target.value)}
            className="h-9 max-w-full px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/25 cursor-pointer"
          >
            <option value="all">
              All neighborhoods ({filters.michelinOnly ? michelinCount : neighborhoods.reduce((sum, option) => sum + option.totalCount, 0)})
            </option>
            {neighborhoods.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={filters.michelinOnly && option.michelinCount === 0}
              >
                {option.label} ({filters.michelinOnly ? option.michelinCount : option.totalCount})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleChange('michelinOnly', !filters.michelinOnly)}
            disabled={michelinUnavailable && !filters.michelinOnly}
            aria-pressed={filters.michelinOnly}
            className={`h-9 px-3 rounded-md border text-xs font-body font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/35 disabled:cursor-not-allowed disabled:opacity-45 ${
              filters.michelinOnly
                ? 'border-gold bg-gold-light text-gold'
                : 'border-border bg-surface text-muted hover:text-text hover:border-text/20'
            }`}
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 1.5l1.763 3.572 3.937.572-2.85 2.777.673 3.921L8 10.395l-3.523 1.947.673-3.921-2.85-2.777 3.937-.572L8 1.5z" />
            </svg>
            Michelin verified ({michelinCount})
          </button>

          <label className="sr-only" htmlFor="restaurant-sort">Sort restaurants</label>
          <select
            id="restaurant-sort"
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/25 cursor-pointer sm:ml-auto"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-9 px-3 rounded-md text-xs font-body font-semibold text-accent hover:bg-accent/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
