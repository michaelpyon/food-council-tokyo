import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { restaurants as rawRestaurants } from './data/restaurants';
import { curatedLists, getCuratedListRestaurants } from './data/curatedLists';
import { computeCompositeScore } from './utils/scoring';
import { filterRestaurants, sortRestaurants } from './utils/filters';
import { getSavedIds, saveRestaurant, unsaveRestaurant, setSavedIds } from './utils/storage';
import { readTripFromUrl, readFiltersFromUrl, syncUrl } from './utils/tripUrl';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import CuratedLists from './components/CuratedLists';
import RestaurantCard from './components/RestaurantCard';
import DetailPanel from './components/DetailPanel';
import SavedListPanel from './components/SavedListPanel';

// Pre-compute composite scores
const restaurants = rawRestaurants.map(r => ({
  ...r,
  _compositeScore: computeCompositeScore(r),
}));

const VALID_IDS = new Set(restaurants.map(r => r.id));

// Hydrate the saved list once: a shared ?trip= link wins over localStorage so
// the exact trip reopens on any device. Unknown ids are dropped, never crash.
function getInitialSavedIds() {
  const fromUrl = readTripFromUrl();
  const base = fromUrl !== null ? fromUrl : getSavedIds();
  const clean = base.filter(id => VALID_IDS.has(id));
  if (fromUrl !== null) setSavedIds(clean);
  return clean;
}

const DEFAULT_FILTERS = {
  cuisine: 'all',
  neighborhood: 'all',
  priceRange: [],
  michelinOnly: false,
  source: 'all',
  tags: [],
  query: '',
};

export default function App() {
  const [filters, setFilters] = useState(() => readFiltersFromUrl(DEFAULT_FILTERS));
  const [sortKey, setSortKey] = useState('composite-desc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [savedIds, setSavedIdsState] = useState(getInitialSavedIds);
  const [showSaved, setShowSaved] = useState(false);
  const [activeListId, setActiveListId] = useState(null);
  const detailTriggerRef = useRef(null);
  const savedTriggerRef = useRef(null);

  // Apply curated list filter if active
  const curatedFiltered = useMemo(() => {
    if (!activeListId) return restaurants;
    const list = curatedLists.find(l => l.id === activeListId);
    return getCuratedListRestaurants(restaurants, list);
  }, [activeListId]);

  // Apply user filters on top
  const filtered = useMemo(() => {
    const result = filterRestaurants(curatedFiltered, filters);
    return sortRestaurants(result, sortKey);
  }, [curatedFiltered, filters, sortKey]);

  // Saved restaurants resolved
  const savedRestaurants = useMemo(() => {
    return savedIds
      .map(id => restaurants.find(r => r.id === id))
      .filter(Boolean);
  }, [savedIds]);

  const handleSearch = useCallback((query) => {
    setActiveListId(null);
    setFilters(prev => ({ ...prev, query }));
  }, []);

  const handleFilterChange = useCallback((nextFilters) => {
    setActiveListId(null);
    setFilters(nextFilters);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveListId(null);
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const handleSelectRestaurant = useCallback((restaurant, trigger) => {
    detailTriggerRef.current = trigger || null;
    setSelectedRestaurant(restaurant);
  }, []);

  const handleOpenSaved = useCallback(trigger => {
    savedTriggerRef.current = trigger || null;
    setShowSaved(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedRestaurant(null);
    window.setTimeout(() => detailTriggerRef.current?.focus(), 0);
  }, []);

  const handleCloseSaved = useCallback(() => {
    setShowSaved(false);
    window.setTimeout(() => savedTriggerRef.current?.focus(), 0);
  }, []);

  const handleSave = useCallback((id) => {
    setSavedIdsState(prev => {
      if (prev.includes(id)) {
        return unsaveRestaurant(id);
      }
      return saveRestaurant(id);
    });
  }, []);

  const handleSelectList = useCallback((listId) => {
    setActiveListId(listId);
    // Reset filters when switching lists
    setFilters(DEFAULT_FILTERS);
  }, []);

  // One tap: pre-save a starter trip from a curated list, then open the trip
  // panel so a browse session becomes a share-ready artifact immediately.
  // Additive: merges into whatever is already saved, never drops existing picks.
  const handleStarterTrip = useCallback((listId) => {
    const list = curatedLists.find(l => l.id === listId);
    if (!list) return;
    const picks = getCuratedListRestaurants(restaurants, list);
    const ids = picks.map(r => r.id);
    setSavedIdsState(prev => {
      const merged = [...prev];
      ids.forEach(id => {
        if (!merged.includes(id)) merged.push(id);
      });
      return setSavedIds(merged);
    });
    setShowSaved(true);
  }, []);

  // Keep the address bar in sync so the trip and filtered view are deep-linkable.
  useEffect(() => {
    syncUrl(savedIds, filters);
  }, [savedIds, filters]);

  return (
    <div className="min-h-screen bg-bg">
      <Header
        totalCount={restaurants.length}
        filteredCount={filtered.length}
        savedCount={savedIds.length}
        query={filters.query}
        onOpenSaved={handleOpenSaved}
        onSearch={handleSearch}
      />

      <Hero
        totalCount={restaurants.length}
        savedCount={savedIds.length}
        onStarterTrip={() => handleStarterTrip('first-timers')}
      />

      <CuratedLists
        lists={curatedLists}
        onSelectList={handleSelectList}
        onStarterTrip={handleStarterTrip}
        activeListId={activeListId}
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      {/* Main grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-display text-text">No restaurants match your filters</p>
            <p className="text-sm font-body text-muted mt-1">This combination has no matches.</p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="mt-4 h-9 px-4 rounded-lg border border-border bg-surface text-sm font-body font-semibold text-text hover:border-text/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={handleSelectRestaurant}
                  onSave={handleSave}
                  isSaved={savedIds.includes(restaurant.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs font-body text-muted">
          Food Council: Tokyo. {restaurants.length} restaurants from Tabelog, Michelin, Google, and editorial sources.
        </p>
      </footer>

      {/* Detail panel */}
      <DetailPanel
        restaurant={selectedRestaurant}
        onClose={handleCloseDetail}
        onSave={handleSave}
        isSaved={selectedRestaurant ? savedIds.includes(selectedRestaurant.id) : false}
      />

      {/* Saved list panel */}
      <SavedListPanel
        isOpen={showSaved}
        onClose={handleCloseSaved}
        savedRestaurants={savedRestaurants}
        savedIds={savedIds}
        filters={filters}
        onRemove={handleSave}
        onSelect={handleSelectRestaurant}
      />
    </div>
  );
}
