import { sourceLabel, verifiedSources } from './links';

const TRIP_PARAM = 'trip';
const FILTER_PARAMS = {
  neighborhood: 'hood',
  michelinOnly: 'michelin',
  query: 'q',
};

function baseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function appendTrip(params, savedIds) {
  if (savedIds?.length > 0) params.set(TRIP_PARAM, savedIds.join(','));
}

function appendFilterParams(params, filters) {
  if (filters?.neighborhood && filters.neighborhood !== 'all') {
    params.set(FILTER_PARAMS.neighborhood, filters.neighborhood);
  }
  if (filters?.michelinOnly) params.set(FILTER_PARAMS.michelinOnly, '1');
  if (filters?.query?.trim()) params.set(FILTER_PARAMS.query, filters.query.trim());
}

export function readTripFromUrl(search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    if (!params.has(TRIP_PARAM)) return null;
    return [...new Set(
      (params.get(TRIP_PARAM) || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
    )];
  } catch {
    return null;
  }
}

export function buildTripUrl(savedIds) {
  const params = new URLSearchParams();
  appendTrip(params, savedIds);
  const query = params.toString();
  return query ? `${baseUrl()}?${query}` : baseUrl();
}

function buildStateUrl(savedIds, filters) {
  const params = new URLSearchParams();
  appendTrip(params, savedIds);
  appendFilterParams(params, filters);
  const query = params.toString();
  return query ? `${baseUrl()}?${query}` : baseUrl();
}

export function readFiltersFromUrl(defaults, search = window.location.search, allowlist = {}) {
  try {
    const params = new URLSearchParams(search);
    const next = { ...defaults };
    const neighborhood = params.get(FILTER_PARAMS.neighborhood);

    if (neighborhood && allowlist.neighborhoods?.has(neighborhood)) {
      next.neighborhood = neighborhood;
    }
    if (params.get(FILTER_PARAMS.michelinOnly) === '1') {
      next.michelinOnly = true;
    }
    if (params.has(FILTER_PARAMS.query)) {
      next.query = (params.get(FILTER_PARAMS.query) || '').slice(0, 100);
    }
    return next;
  } catch {
    return { ...defaults };
  }
}

export function syncUrl(savedIds, filters) {
  try {
    window.history.replaceState(null, '', buildStateUrl(savedIds, filters));
  } catch {
    // URL sync is a progressive enhancement.
  }
}

export function buildTripText(savedRestaurants, savedIds) {
  if (!savedRestaurants?.length) {
    return 'My Tokyo trip (Food Council: Tokyo)\n\nNo verified places saved yet.';
  }

  const lines = [
    'My Tokyo trip (Food Council: Tokyo)',
    buildTripUrl(savedIds),
    '',
  ];

  for (const { neighborhood, items } of groupByNeighborhood(savedRestaurants)) {
    lines.push(neighborhood);
    for (const restaurant of items) {
      lines.push(`  ${restaurant.name}`);
      lines.push(`    Verified: ${restaurant.lastVerified}`);
      for (const source of verifiedSources(restaurant)) {
        lines.push(`    ${sourceLabel(source)}: ${source.url}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

export function groupByNeighborhood(savedRestaurants) {
  const order = [];
  const map = new Map();
  for (const restaurant of savedRestaurants) {
    const key = restaurant.neighborhood || 'Other';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(restaurant);
  }
  return order.map(neighborhood => ({ neighborhood, items: map.get(neighborhood) }));
}
