/**
 * Filter and sort logic for restaurant list
 */

export const SORT_OPTIONS = [
  { value: 'composite-desc', label: 'Highest Rated' },
  { value: 'composite-asc', label: 'Lowest Rated' },
  { value: 'tabelog-desc', label: 'Tabelog Score' },
  { value: 'google-desc', label: 'Google Rating' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

export function filterRestaurants(restaurants, filters) {
  return restaurants.filter(r => {
    // Cuisine filter
    if (filters.cuisine && filters.cuisine !== 'all' && r.cuisine !== filters.cuisine) {
      return false;
    }

    // Neighborhood filter
    if (filters.neighborhood && filters.neighborhood !== 'all' && r.neighborhood !== filters.neighborhood) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(r.priceRange)) return false;
    }

    // Michelin filter
    if (filters.michelinOnly) {
      if (!r.michelin || (r.michelin.stars === 0 && !r.michelin.bib && !r.michelin.plate)) {
        return false;
      }
    }

    // Michelin stars specifically
    if (filters.michelinStars !== undefined && filters.michelinStars !== null) {
      if (!r.michelin || r.michelin.stars < filters.michelinStars) return false;
    }

    // Source filter
    if (filters.source && filters.source !== 'all') {
      if (!r.sources || !r.sources.includes(filters.source)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.every(tag => r.tags?.includes(tag))) return false;
    }

    // Search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const searchable = [
        r.name, r.nameJa, r.cuisine, r.subCuisine,
        r.neighborhood, r.description, ...(r.tags || []),
      ].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

export function sortRestaurants(restaurants, sortKey) {
  const sorted = [...restaurants];

  switch (sortKey) {
    case 'composite-desc':
      return sorted.sort((a, b) => (b._compositeScore || 0) - (a._compositeScore || 0));
    case 'composite-asc':
      return sorted.sort((a, b) => (a._compositeScore || 0) - (b._compositeScore || 0));
    case 'tabelog-desc':
      return sorted.sort((a, b) => (b.tabelog?.score || 0) - (a.tabelog?.score || 0));
    case 'google-desc':
      return sorted.sort((a, b) => (b.google?.rating || 0) - (a.google?.rating || 0));
    case 'price-asc':
      return sorted.sort((a, b) => a.priceRange - b.priceRange);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceRange - a.priceRange);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort((a, b) => (b._compositeScore || 0) - (a._compositeScore || 0));
  }
}
