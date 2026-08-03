export const MICHELIN_DISTINCTIONS = {
  three_stars: { label: '3 Michelin stars', stars: 3 },
  two_stars: { label: '2 Michelin stars', stars: 2 },
  one_star: { label: '1 Michelin star', stars: 1 },
  bib_gourmand: { label: 'Michelin Bib Gourmand', short: 'BIB' },
  selected: { label: 'Michelin Selected', short: 'SELECTED' },
};

export function michelinLabel(michelin) {
  if (!michelin?.verified) return null;
  return MICHELIN_DISTINCTIONS[michelin.distinction]?.label || null;
}
