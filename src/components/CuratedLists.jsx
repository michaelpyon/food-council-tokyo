import { motion } from 'motion/react';

export default function CuratedLists({ lists, onSelectList, activeListId }) {
  return (
    <div className="border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h3 className="text-xs font-body font-semibold text-muted uppercase tracking-wider mb-3">
          Curated Lists
        </h3>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {/* All restaurants pill */}
          <button
            onClick={() => onSelectList(null)}
            className={`shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm font-body font-medium transition-colors cursor-pointer ${
              !activeListId
                ? 'border-text bg-text text-surface'
                : 'border-border bg-surface text-text hover:bg-border/30'
            }`}
          >
            All
          </button>
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm font-body font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeListId === list.id
                  ? 'border-text bg-text text-surface'
                  : 'border-border bg-surface text-text hover:bg-border/30'
              }`}
            >
              <span>{list.emoji}</span>
              <span>{list.title}</span>
            </button>
          ))}
        </div>
        {/* Active list description */}
        {activeListId && (
          <motion.p
            key={activeListId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-body text-muted mt-2"
          >
            {lists.find(l => l.id === activeListId)?.subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
