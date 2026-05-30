import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Hero({ totalCount, savedCount = 0, onStarterTrip }) {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <section className="border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text leading-tight tracking-tight">
            High Tabelog scores,<br className="hidden sm:block" /> under the tourist radar.
          </h2>
          <p className="mt-3 text-base sm:text-lg font-body text-muted leading-relaxed">
            {totalCount} Tokyo restaurants, actually curated. Not a listicle.
          </p>

          {onStarterTrip && savedCount === 0 && (
            <div className="mt-5">
              <button
                onClick={onStarterTrip}
                className="inline-flex items-center gap-2 rounded-full bg-text text-surface text-sm font-body font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <span aria-hidden="true">&#x2605;</span>
                Build me a first-timer trip
              </button>
              <p className="mt-2 text-xs font-body text-muted">
                Saves the essential first-visit spots to a shareable trip in 1 tap.
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-body text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                Tabelog + Michelin + Google + editorial sources
              </span>
            </div>
            <span className="w-px h-3 bg-border inline-block" aria-hidden="true" />
            <button
              onClick={() => setShowScoring(v => !v)}
              className="text-xs font-body text-muted underline underline-offset-2 hover:text-text transition-colors cursor-pointer"
              aria-expanded={showScoring}
            >
              How we score
            </button>
          </div>

          <AnimatePresence>
            {showScoring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-xs font-body text-muted leading-relaxed bg-surface border border-border rounded-lg px-4 py-3 max-w-sm">
                  Composite score weighted: Tabelog 40%, Michelin 30%, Google 15%, Media 15%. Higher weight on Tabelog because it reflects regular Japanese diners, not tourists.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
