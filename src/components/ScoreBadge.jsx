import { getScoreTier } from '../utils/scoring';

export default function ScoreBadge({ score, size = 'md' }) {
  const tier = getScoreTier(score);
  const display = score.toFixed(1);

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-lg bg-text flex items-center justify-center font-body font-bold text-surface shrink-0`}
      title={`${display} — ${tier.label}`}
    >
      {display}
    </div>
  );
}
