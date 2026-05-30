/**
 * Honest outbound links for each restaurant.
 *
 * There are no addresses or coordinates in the dataset, so these are
 * by-name searches that resolve to the real place on Google Maps and
 * Tabelog. If a restaurant ever gains a real reservationUrl, prefer it.
 */

export function mapsUrl(restaurant) {
  const query = `${restaurant.name} ${restaurant.neighborhood} Tokyo`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function tabelogUrl(restaurant) {
  return `https://tabelog.com/en/rstLst/?sw=${encodeURIComponent(restaurant.name)}`;
}

/**
 * Prefer a real reservation link when one exists; today all are null.
 */
export function bookingUrl(restaurant) {
  return restaurant.reservationUrl || tabelogUrl(restaurant);
}
