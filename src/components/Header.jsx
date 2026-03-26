import { useState } from 'react';

export default function Header({ totalCount, filteredCount, savedCount, onOpenSaved, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-text">
              Food Council
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-body font-semibold uppercase tracking-wider">
              Tokyo
            </span>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search restaurants..."
                className="w-40 sm:w-56 lg:w-72 h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm font-body text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Saved button */}
            <button
              onClick={onOpenSaved}
              className="relative flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-surface text-sm font-body font-medium text-text hover:bg-border/30 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="hidden sm:inline">My Trip</span>
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold px-1">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 pb-2 text-xs font-body text-muted">
          <span>{filteredCount} of {totalCount} restaurants</span>
          <span className="text-border">|</span>
          <span>Scores from Tabelog, Michelin, Google, and media sources</span>
        </div>
      </div>
    </header>
  );
}
