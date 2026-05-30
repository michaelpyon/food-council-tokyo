/**
 * Portable trip encoding.
 *
 * Restaurant ids are url-safe slugs (e.g. "sushi-saito"), so the trip is
 * encoded as a comma-joined list in the ?trip= query param. The URL is the
 * shareable form; localStorage stays the local persistence layer.
 */

import { mapsUrl, tabelogUrl } from './links';

const TRIP_PARAM = 'trip';
const FILTER_PARAMS = {
  cuisine: 'cuisine',
  neighborhood: 'hood',
  source: 'source',
  michelinOnly: 'michelin',
  query: 'q',
};

/**
 * Read saved ids from the current URL. Returns an array of slugs, or null if
 * the param is absent. Decoding never throws and drops empty entries; the
 * caller is responsible for discarding ids that do not match a real
 * restaurant.
 */
export function readTripFromUrl(search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    if (!params.has(TRIP_PARAM)) return null;
    const raw = params.get(TRIP_PARAM) || '';
    const ids = raw
      .split(',')
      .map(s => decodeURIComponent(s.trim()))
      .filter(Boolean);
    return ids;
  } catch {
    return null;
  }
}

/**
 * Build a shareable absolute URL for a set of saved ids. Pass the active
 * filters to also deep-link the filtered view.
 */
export function buildTripUrl(savedIds, filters) {
  const params = new URLSearchParams();
  if (savedIds && savedIds.length > 0) {
    params.set(TRIP_PARAM, savedIds.join(','));
  }
  if (filters) appendFilterParams(params, filters);
  const base = `${window.location.origin}${window.location.pathname}`;
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function appendFilterParams(params, filters) {
  if (filters.cuisine && filters.cuisine !== 'all') {
    params.set(FILTER_PARAMS.cuisine, filters.cuisine);
  }
  if (filters.neighborhood && filters.neighborhood !== 'all') {
    params.set(FILTER_PARAMS.neighborhood, filters.neighborhood);
  }
  if (filters.source && filters.source !== 'all') {
    params.set(FILTER_PARAMS.source, filters.source);
  }
  if (filters.michelinOnly) {
    params.set(FILTER_PARAMS.michelin, '1');
  }
  if (filters.query) {
    params.set(FILTER_PARAMS.query, filters.query);
  }
}

/**
 * Read filters from the current URL, merged onto a set of defaults. Unknown
 * values are ignored upstream by the filter logic, so this stays permissive.
 */
export function readFiltersFromUrl(defaults, search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    const next = { ...defaults };
    if (params.has(FILTER_PARAMS.cuisine)) next.cuisine = params.get(FILTER_PARAMS.cuisine);
    if (params.has(FILTER_PARAMS.neighborhood)) next.neighborhood = params.get(FILTER_PARAMS.neighborhood);
    if (params.has(FILTER_PARAMS.source)) next.source = params.get(FILTER_PARAMS.source);
    if (params.has(FILTER_PARAMS.michelin)) next.michelinOnly = params.get(FILTER_PARAMS.michelin) === '1';
    if (params.has(FILTER_PARAMS.query)) next.query = params.get(FILTER_PARAMS.query) || '';
    return next;
  } catch {
    return { ...defaults };
  }
}

/**
 * Replace the address bar URL without adding history entries.
 */
export function syncUrl(savedIds, filters) {
  try {
    const url = buildTripUrl(savedIds, filters);
    window.history.replaceState(null, '', url);
  } catch {
    // ignore: URL sync is a progressive enhancement
  }
}

/**
 * Plain-text itinerary, grouped by neighborhood, ready to paste into Notes,
 * a group chat, or an r/JapanTravel post. The exported text leads with the
 * shareable trip URL so a pasted itinerary is also a round-trip back into the
 * exact saved + filtered view.
 */
export function buildTripText(savedRestaurants, savedIds, filters) {
  if (!savedRestaurants || savedRestaurants.length === 0) {
    return 'My Tokyo trip (Food Council: Tokyo)\n\nNo restaurants saved yet.';
  }

  const lines = ['My Tokyo trip (Food Council: Tokyo)'];

  // Lead with the shareable URL when we have enough context to build it. Falls
  // back gracefully when called without ids/filters (older callers).
  if (savedIds && savedIds.length > 0) {
    try {
      lines.push(buildTripUrl(savedIds, filters));
    } catch {
      // ignore: URL is a nice-to-have, the itinerary is the load-bearing part
    }
  }
  lines.push('');

  const groups = groupByNeighborhood(savedRestaurants);
  for (const { neighborhood, items } of groups) {
    lines.push(`${neighborhood}`);
    for (const r of items) {
      const score = (r._compositeScore || 0).toFixed(1);
      lines.push(`  ${r.name} (${score})`);
      lines.push(`    Map: ${mapsUrl(r)}`);
      lines.push(`    Tabelog: ${tabelogUrl(r)}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/**
 * Group restaurants by neighborhood, preserving save order within each group
 * and ordering groups by first appearance.
 */
export function groupByNeighborhood(savedRestaurants) {
  const order = [];
  const map = new Map();
  for (const r of savedRestaurants) {
    const key = r.neighborhood || 'Other';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(r);
  }
  return order.map(neighborhood => ({ neighborhood, items: map.get(neighborhood) }));
}
