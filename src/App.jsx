import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  restaurants,
  VERIFIED_THROUGH,
  SOURCE_RECORD_COUNT,
  HELD_RECORD_COUNT,
} from './data/verifiedRestaurants';
import { filterRestaurants, sortRestaurants } from './utils/filters';
import { getSavedIds, setSavedIds } from './utils/storage';
import { readTripFromUrl, readFiltersFromUrl, syncUrl } from './utils/tripUrl';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import RestaurantCard from './components/RestaurantCard';
import DetailPanel from './components/DetailPanel';
import SavedListPanel from './components/SavedListPanel';

const VALID_IDS = new Set(restaurants.map(restaurant => restaurant.id));
const VALID_NEIGHBORHOODS = new Set(
  restaurants.map(restaurant => restaurant.neighborhood).filter(Boolean),
);
const MICHELIN_NEIGHBORHOODS = new Set(
  restaurants
    .filter(restaurant => restaurant.michelin?.verified && restaurant.michelin.distinction)
    .map(restaurant => restaurant.neighborhood)
    .filter(Boolean),
);

const DEFAULT_FILTERS = {
  neighborhood: 'all',
  michelinOnly: false,
  query: '',
};

function getInitialSavedState() {
  const fromUrl = readTripFromUrl();
  const storedIds = [...new Set(getSavedIds())].filter(id => VALID_IDS.has(id));
  const importedIds = fromUrl === null ? [] : [...new Set(fromUrl)];
  const currentImportedIds = importedIds.filter(id => VALID_IDS.has(id));
  const omittedIds = importedIds.filter(id => !VALID_IDS.has(id));
  const ids = fromUrl !== null && currentImportedIds.length > 0
    ? currentImportedIds
    : storedIds;
  setSavedIds(ids);

  return {
    ids,
    omittedIds,
    openedFromSharedTrip: fromUrl !== null,
  };
}

export default function App() {
  const [initialSavedState] = useState(getInitialSavedState);
  const [filters, setFilters] = useState(() => readFiltersFromUrl(
    DEFAULT_FILTERS,
    window.location.search,
    {
      neighborhoods: VALID_NEIGHBORHOODS,
      michelinNeighborhoods: MICHELIN_NEIGHBORHOODS,
    },
  ));
  const [sortKey, setSortKey] = useState('name-asc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [savedIds, setSavedIdsState] = useState(initialSavedState.ids);
  const [omittedTripIds] = useState(initialSavedState.omittedIds);
  const [showSaved, setShowSaved] = useState(initialSavedState.openedFromSharedTrip);
  const detailTriggerRef = useRef(null);
  const savedTriggerRef = useRef(null);

  const filtered = useMemo(() => {
    const result = filterRestaurants(restaurants, filters);
    return sortRestaurants(result, sortKey);
  }, [filters, sortKey]);

  const neighborhoodOptions = useMemo(() => {
    const counts = new Map();
    restaurants.forEach(restaurant => {
      const current = counts.get(restaurant.neighborhood) || {
        value: restaurant.neighborhood,
        label: restaurant.neighborhood,
        totalCount: 0,
        michelinCount: 0,
      };
      current.totalCount += 1;
      if (restaurant.michelin?.verified && restaurant.michelin.distinction) {
        current.michelinCount += 1;
      }
      counts.set(restaurant.neighborhood, current);
    });
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const michelinCount = useMemo(
    () => restaurants.filter(restaurant => restaurant.michelin?.verified && restaurant.michelin.distinction).length,
    [],
  );

  const savedRestaurants = useMemo(() => (
    savedIds
      .map(id => restaurants.find(restaurant => restaurant.id === id))
      .filter(Boolean)
  ), [savedIds]);

  const handleSearch = useCallback((query) => {
    setFilters(previous => ({ ...previous, query }));
  }, []);

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
  }, []);

  const handleClearAllFilters = useCallback(() => {
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

  const handleSelectSavedRestaurant = useCallback((restaurant) => {
    const tripTrigger = savedTriggerRef.current;
    tripTrigger?.focus();
    detailTriggerRef.current = tripTrigger;
    setShowSaved(false);
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedRestaurant(null);
    window.setTimeout(() => detailTriggerRef.current?.focus(), 0);
  }, []);

  const handleDetailExitComplete = useCallback(() => {
    detailTriggerRef.current?.focus();
  }, []);

  const handleCloseSaved = useCallback(() => {
    setShowSaved(false);
    window.setTimeout(() => savedTriggerRef.current?.focus(), 0);
  }, []);

  const handleSave = useCallback((id) => {
    setSavedIdsState((previous) => {
      const next = previous.includes(id)
        ? previous.filter(savedId => savedId !== id)
        : [...previous, id];
      setSavedIds(next);
      return next;
    });
  }, []);

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
        savedButtonRef={savedTriggerRef}
      />

      <Hero
        totalCount={restaurants.length}
        sourceRecordCount={SOURCE_RECORD_COUNT}
        heldCount={HELD_RECORD_COUNT}
        verifiedThrough={VERIFIED_THROUGH}
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        sortKey={sortKey}
        onSortChange={setSortKey}
        neighborhoods={neighborhoodOptions}
        michelinCount={michelinCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-display text-2xl font-semibold text-text">
            Verified directory
          </h2>
          <p className="text-xs font-body text-muted">
            {filtered.length} of {restaurants.length} public records
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="max-w-xl border-t border-text py-12">
            <h2 className="font-display text-2xl text-text">No verified records match</h2>
            <p className="mt-2 text-sm font-body leading-relaxed text-muted">
              Search covers restaurant names, Japanese names, and neighborhoods. Reset the current filters to return to all {restaurants.length} records.
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="mt-5 h-11 px-4 rounded-lg border border-border bg-surface text-sm font-body font-semibold text-text hover:border-text/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={handleSelectRestaurant}
                onSave={handleSave}
                isSaved={savedIds.includes(restaurant.id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-body leading-relaxed text-muted">
            Food Council: Tokyo publishes {restaurants.length} records from a {SOURCE_RECORD_COUNT}-place audit. Verified through {VERIFIED_THROUGH}. No restaurant photography, ratings, prices, or descriptions are published without field-level evidence.
          </p>
        </div>
      </footer>

      <DetailPanel
        restaurant={selectedRestaurant}
        onClose={handleCloseDetail}
        onExitComplete={handleDetailExitComplete}
        onSave={handleSave}
        isSaved={selectedRestaurant ? savedIds.includes(selectedRestaurant.id) : false}
      />

      <SavedListPanel
        isOpen={showSaved}
        onClose={handleCloseSaved}
        savedRestaurants={savedRestaurants}
        savedIds={savedIds}
        omittedTripIds={omittedTripIds}
        onRemove={handleSave}
        onSelect={handleSelectSavedRestaurant}
      />
    </div>
  );
}
