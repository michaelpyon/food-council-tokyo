/**
 * localStorage wrapper for saved restaurants ("My Trip" list)
 */

const STORAGE_KEY = 'fct-saved-restaurants';

export function getSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRestaurant(id) {
  const ids = getSavedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  return ids;
}

export function unsaveRestaurant(id) {
  const ids = getSavedIds().filter(i => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids;
}

export function isSaved(id) {
  return getSavedIds().includes(id);
}

export function clearSaved() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
