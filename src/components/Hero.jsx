import { useState } from 'react';

function formatVerifiedDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function Hero({ totalCount, sourceRecordCount, heldCount, verifiedThrough }) {
  const [showMethod, setShowMethod] = useState(false);
  const verifiedDate = formatVerifiedDate(verifiedThrough);

  return (
    <section className="border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-text leading-none tracking-tighter text-balance">
              {totalCount} Tokyo food and drink places, verified branch by branch.
            </h2>
            <p className="mt-5 max-w-[62ch] text-base sm:text-lg font-body text-muted leading-relaxed">
              These records cleared a strict {sourceRecordCount}-place audit. {heldCount} remain off the site until their identity, status, or evidence is resolved.
            </p>
          </div>

          <div className="border-t border-text pt-4 lg:mb-1">
            <p className="text-sm font-body font-semibold text-text">
              Verified <time dateTime={verifiedThrough}>{verifiedDate}</time>
            </p>
            <p className="mt-1 text-xs font-body leading-relaxed text-muted">
              Every public record is operating, high-confidence, free of blocking issues, and backed by at least 1 direct source.
            </p>
            <button
              type="button"
              onClick={() => setShowMethod(value => !value)}
              className="mt-3 inline-flex min-h-11 items-center text-xs font-body font-semibold text-accent underline underline-offset-4 hover:text-accent-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
              aria-expanded={showMethod}
              aria-controls="verification-method"
            >
              How we verified
            </button>
          </div>
        </div>

        {showMethod && (
          <div
            id="verification-method"
            className="mt-8 max-w-3xl border-l-2 border-accent bg-surface px-5 py-4"
          >
            <p className="text-sm font-body leading-relaxed text-text">
              We matched each entry to a current branch, operating status, neighborhood, and direct evidence URL. Scores, review counts, prices, descriptions, cuisine labels, reservation claims, and photos stay out until they receive field-level verification.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
