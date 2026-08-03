/**
 * localStorage wrapper for saved restaurants ("My Trip" list)
 */

const STORAGE_KEY = 'fct-saved-restaurants';

function writeSavedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Keep My Trip usable in memory when storage is blocked or full.
  }
  return ids;
}

export function getSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(id => typeof id === 'string' && id)
      : [];
  } catch {
    return [];
  }
}

export function saveRestaurant(id) {
  const ids = getSavedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    writeSavedIds(ids);
  }
  return ids;
}

export function setSavedIds(ids) {
  const clean = Array.isArray(ids)
    ? ids.filter(id => typeof id === 'string' && id)
    : [];
  return writeSavedIds(clean);
}

export function unsaveRestaurant(id) {
  const ids = getSavedIds().filter(i => i !== id);
  return writeSavedIds(ids);
}

export function isSaved(id) {
  return getSavedIds().includes(id);
}

export function clearSaved() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Clearing a blocked store is already equivalent to an empty readable trip.
  }
  return [];
}
