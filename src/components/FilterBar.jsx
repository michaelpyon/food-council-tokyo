import { CUISINES, NEIGHBORHOODS, PRICE_LABELS } from '../data/restaurants';
import { SORT_OPTIONS } from '../utils/filters';

export default function FilterBar({ filters, onFilterChange, sortKey, onSortChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const togglePrice = (price) => {
    const current = filters.priceRange || [];
    const next = current.includes(price)
      ? current.filter(p => p !== price)
      : [...current, price];
    handleChange('priceRange', next);
  };

  const activeFilterCount = [
    filters.cuisine && filters.cuisine !== 'all',
    filters.neighborhood && filters.neighborhood !== 'all',
    filters.priceRange && filters.priceRange.length > 0,
    filters.michelinOnly,
    filters.source && filters.source !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFilterChange({
      cuisine: 'all',
      neighborhood: 'all',
      priceRange: [],
      michelinOnly: false,
      source: 'all',
      tags: [],
      query: filters.query || '',
    });
  };

  return (
    <div className="border-b border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Cuisine */}
          <select
            value={filters.cuisine || 'all'}
            onChange={(e) => handleChange('cuisine', e.target.value)}
            className="h-8 px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
          >
            <option value="all">All Cuisines</option>
            {CUISINES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Neighborhood */}
          <select
            value={filters.neighborhood || 'all'}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            className="h-8 px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
          >
            <option value="all">All Neighborhoods</option>
            {NEIGHBORHOODS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* Price toggles */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4].map(p => (
              <button
                key={p}
                onClick={() => togglePrice(p)}
                className={`h-8 px-2.5 rounded-md border text-xs font-body font-semibold transition-colors cursor-pointer ${
                  (filters.priceRange || []).includes(p)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-surface text-muted hover:text-text hover:border-text/20'
                }`}
              >
                {PRICE_LABELS[p]}
              </button>
            ))}
          </div>

          {/* Michelin toggle */}
          <button
            onClick={() => handleChange('michelinOnly', !filters.michelinOnly)}
            className={`h-8 px-3 rounded-md border text-xs font-body font-medium transition-colors cursor-pointer ${
              filters.michelinOnly
                ? 'border-gold bg-gold-light text-gold'
                : 'border-border bg-surface text-muted hover:text-text hover:border-text/20'
            }`}
          >
            ⭐ Michelin
          </button>

          {/* Source filter */}
          <select
            value={filters.source || 'all'}
            onChange={(e) => handleChange('source', e.target.value)}
            className="h-8 px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="tabelog">Tabelog</option>
            <option value="google">Google</option>
            <option value="michelin">Michelin</option>
            <option value="eater">Eater</option>
            <option value="cnt">CN Traveler</option>
            <option value="nyt">NYT</option>
            <option value="timeout">Time Out</option>
          </select>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-8 px-3 rounded-md border border-border bg-surface text-xs font-body font-medium text-text focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer ml-auto"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="h-8 px-3 rounded-md text-xs font-body font-medium text-accent hover:bg-accent/5 transition-colors cursor-pointer"
            >
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
