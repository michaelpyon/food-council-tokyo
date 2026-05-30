import { getScoreTier } from '../utils/scoring';

export default function ScoreBadge({ score, size = 'md' }) {
  const tier = getScoreTier(score);
  const display = score.toFixed(1);

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  // Vermilion accent ring for top-tier scores (8.5+), gold for strong (7.5+),
  // paper-toned background for all so it reads as an editorial mark.
  const isTop = score >= 8.5;
  const isStrong = score >= 7.5 && score < 8.5;

  const ringClass = isTop
    ? 'border-accent/70'
    : isStrong
    ? 'border-gold/60'
    : 'border-border';

  const numClass = isTop
    ? 'text-accent'
    : isStrong
    ? 'text-gold'
    : 'text-text';

  return (
    <div
      className={`${sizes[size]} rounded-lg bg-surface border-2 ${ringClass} flex items-center justify-center font-body font-bold ${numClass} shrink-0`}
      title={`${display}, ${tier.label}`}
    >
      {display}
    </div>
  );
}
