import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { restaurants as rawRestaurants } from './data/restaurants';
import { curatedLists } from './data/curatedLists';
import { computeCompositeScore } from './utils/scoring';
import { filterRestaurants, sortRestaurants } from './utils/filters';
import { getSavedIds, saveRestaurant, unsaveRestaurant } from './utils/storage';
import Header from './components/Header';
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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState('composite-desc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [savedIds, setSavedIds] = useState(() => getSavedIds());
  const [showSaved, setShowSaved] = useState(false);
  const [activeListId, setActiveListId] = useState(null);

  // Apply curated list filter if active
  const curatedFiltered = useMemo(() => {
    if (!activeListId) return restaurants;
    const list = curatedLists.find(l => l.id === activeListId);
    if (!list) return restaurants;
    let result = restaurants.filter(list.filter);
    if (list.sort) result = result.sort(list.sort);
    if (list.limit) result = result.slice(0, list.limit);
    return result;
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
    setFilters(prev => ({ ...prev, query }));
  }, []);

  const handleSave = useCallback((id) => {
    setSavedIds(prev => {
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

  // Close detail panel on escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedRestaurant) setSelectedRestaurant(null);
        else if (showSaved) setShowSaved(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedRestaurant, showSaved]);

  return (
    <div className="min-h-screen bg-bg">
      <Header
        totalCount={restaurants.length}
        filteredCount={filtered.length}
        savedCount={savedIds.length}
        onOpenSaved={() => setShowSaved(true)}
        onSearch={handleSearch}
      />

      <CuratedLists
        lists={curatedLists}
        onSelectList={handleSelectList}
        activeListId={activeListId}
      />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      {/* Main grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍙</div>
            <p className="text-lg font-display text-text">No restaurants match your filters</p>
            <p className="text-sm font-body text-muted mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={setSelectedRestaurant}
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
          Food Council: Tokyo — {restaurants.length} restaurants from Tabelog, Michelin, Google, and editorial sources.
        </p>
        <p className="text-xs font-body text-muted mt-1">
          Scores are composite ratings weighted: Tabelog 40%, Michelin 30%, Google 15%, Media 15%.
        </p>
      </footer>

      {/* Detail panel */}
      <DetailPanel
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onSave={handleSave}
        isSaved={selectedRestaurant ? savedIds.includes(selectedRestaurant.id) : false}
      />

      {/* Saved list panel */}
      <SavedListPanel
        isOpen={showSaved}
        onClose={() => setShowSaved(false)}
        savedRestaurants={savedRestaurants}
        onRemove={handleSave}
        onSelect={setSelectedRestaurant}
      />
    </div>
  );
}
