/**
 * Filter and sort logic for restaurant list
 */

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'neighborhood-asc', label: 'Neighborhood: A-Z' },
];

export function filterRestaurants(restaurants, filters) {
  return restaurants.filter(r => {
    if (filters.neighborhood && filters.neighborhood !== 'all' && r.neighborhood !== filters.neighborhood) {
      return false;
    }

    if (filters.michelinOnly) {
      if (!r.michelin?.verified || !r.michelin.distinction) return false;
    }

    if (filters.query) {
      const q = filters.query.trim().toLocaleLowerCase();
      const searchable = [
        r.name,
        r.nameJa,
        r.neighborhood,
      ].filter(Boolean).join(' ').toLocaleLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

export function sortRestaurants(restaurants, sortKey) {
  const sorted = [...restaurants];
  const byName = (a, b) => (
    a.name.localeCompare(b.name) || (a.auditIndex ?? 0) - (b.auditIndex ?? 0)
  );

  switch (sortKey) {
    case 'neighborhood-asc':
      return sorted.sort((a, b) => (
        a.neighborhood.localeCompare(b.neighborhood) || byName(a, b)
      ));
    case 'name-asc':
      return sorted.sort(byName);
    default:
      return sorted.sort(byName);
  }
}
