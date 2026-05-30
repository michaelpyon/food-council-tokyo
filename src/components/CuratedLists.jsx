import { motion, AnimatePresence } from 'motion/react';

export default function CuratedLists({ lists, onSelectList, activeListId }) {
  const activeList = activeListId ? lists.find(l => l.id === activeListId) : null;

  return (
    <section className="border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2">
        <h3 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-4">
          Start here
        </h3>

        {/* Card grid - primary entry point */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {lists.map(list => {
            const isActive = activeListId === list.id;
            return (
              <button
                key={list.id}
                onClick={() => onSelectList(isActive ? null : list.id)}
                className={`group text-left px-4 py-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                  isActive
                    ? 'border-text bg-text text-surface shadow-sm'
                    : 'border-border bg-surface text-text hover:border-text/40 hover:shadow-sm'
                }`}
              >
                <div className="text-xl mb-2">{list.emoji}</div>
                <div className={`text-sm font-body font-semibold leading-snug mb-1 ${isActive ? 'text-surface' : 'text-text'}`}>
                  {list.title}
                </div>
                <div className={`text-xs font-body leading-snug line-clamp-2 ${isActive ? 'text-surface/70' : 'text-muted'}`}>
                  {list.subtitle}
                </div>
              </button>
            );
          })}

          {/* "See all" reset card */}
          {activeListId && (
            <button
              onClick={() => onSelectList(null)}
              className="group text-left px-4 py-4 rounded-xl border border-dashed border-border bg-transparent text-muted hover:border-text/30 hover:text-text transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <div className="text-xl mb-2">&#8592;</div>
              <div className="text-sm font-body font-semibold leading-snug mb-1">All 163</div>
              <div className="text-xs font-body leading-snug">Clear filter, see everything</div>
            </button>
          )}
        </div>

        {/* Active list banner */}
        <AnimatePresence>
          {activeList && (
            <motion.div
              key={activeListId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-4 flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-accent bg-accent/8 border border-accent/20 rounded-full px-3 py-1">
                <span>{activeList.emoji}</span>
                <span>{activeList.title}</span>
                <button
                  onClick={() => onSelectList(null)}
                  aria-label="Clear list filter"
                  className="ml-1 text-accent/60 hover:text-accent cursor-pointer"
                >
                  &times;
                </button>
              </span>
              <span className="text-xs font-body text-muted">{activeList.subtitle}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
