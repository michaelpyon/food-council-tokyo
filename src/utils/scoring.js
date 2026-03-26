/**
 * Composite scoring engine for Food Council: Tokyo
 *
 * Base weights:
 *   Tabelog: 40% (local authority, strictest grading)
 *   Michelin: 30% (international prestige)
 *   Google: 15% (volume/accessibility)
 *   Media: 15% (editorial curation from Eater, CNT, NYT, TimeOut)
 *
 * Confidence system:
 *   Raw scores are adjusted by a confidence multiplier (0.70 - 1.0)
 *   based on review volume and editorial backing.
 *
 *   - High review count on Tabelog/Google = high confidence
 *   - Michelin/Eater/CNT/NYT coverage = high confidence (expert-curated)
 *   - Low reviews + no editorial = score gets pulled down
 *
 *   This prevents a 4.8 Tabelog score from 30 reviews from outranking
 *   a 4.5 from 2,000 reviews.
 */

const WEIGHTS = {
  tabelog: 0.40,
  michelin: 0.30,
  google: 0.15,
  media: 0.15,
};

// Normalize Tabelog score (3.0-5.0) to 0-100
function normalizeTabelog(score) {
  if (!score) return null;
  return Math.min(100, Math.max(0, ((score - 3.0) / 2.0) * 100));
}

// Normalize Google rating (1.0-5.0) to 0-100
function normalizeGoogle(rating) {
  if (!rating) return null;
  return Math.min(100, Math.max(0, ((rating - 1.0) / 4.0) * 100));
}

// Michelin to 0-100
function normalizeMichelin(michelin) {
  if (!michelin) return null;
  if (michelin.stars === 3) return 100;
  if (michelin.stars === 2) return 85;
  if (michelin.stars === 1) return 70;
  if (michelin.bib) return 60;
  if (michelin.plate) return 45;
  return null;
}

// Media presence to 0-100
const MEDIA_SOURCES = ['eater', 'cnt', 'nyt', 'timeout'];

function normalizeMedia(sources) {
  if (!sources || sources.length === 0) return null;
  const mediaCount = sources.filter(s => MEDIA_SOURCES.includes(s)).length;
  if (mediaCount === 0) return null;
  return Math.min(100, (mediaCount / MEDIA_SOURCES.length) * 100);
}

/**
 * Confidence multiplier (0.70 - 1.0)
 *
 * Factors:
 *   1. Tabelog review volume: logarithmic scale, 500+ reviews = full confidence
 *   2. Google review volume: logarithmic scale, 1000+ reviews = full confidence
 *   3. Editorial backing: each expert source adds confidence
 *   4. Michelin recognition: instant high confidence
 *
 * A restaurant needs EITHER high review volume OR editorial backing to
 * reach full confidence. Having both doesn't stack beyond 1.0.
 */
function computeConfidence(restaurant) {
  let confidence = 0;

  // Tabelog review volume (0 - 0.35)
  // Uses log scale: 50 reviews = ~0.15, 200 = ~0.25, 500+ = 0.35
  const tabelogReviews = restaurant.tabelog?.reviews || 0;
  if (tabelogReviews > 0) {
    const tabelogConf = Math.min(1, Math.log10(tabelogReviews) / Math.log10(500));
    confidence += tabelogConf * 0.35;
  }

  // Google review volume (0 - 0.25)
  // Uses log scale: 100 reviews = ~0.12, 500 = ~0.18, 1000+ = 0.25
  const googleReviews = restaurant.google?.reviews || 0;
  if (googleReviews > 0) {
    const googleConf = Math.min(1, Math.log10(googleReviews) / Math.log10(1000));
    confidence += googleConf * 0.25;
  }

  // Michelin recognition (0.20 flat)
  // Any Michelin nod (stars, bib, plate) means experts vetted this place
  if (restaurant.michelin?.stars > 0 || restaurant.michelin?.bib || restaurant.michelin?.plate) {
    confidence += 0.20;
  }

  // Editorial sources (0.05 each, max 0.20)
  // Eater, CNT, NYT, TimeOut = curated by food journalists
  const editorialCount = (restaurant.sources || []).filter(s => MEDIA_SOURCES.includes(s)).length;
  confidence += Math.min(0.20, editorialCount * 0.05);

  // Clamp to 0.70 - 1.0 range
  // Floor of 0.70 prevents over-penalizing new or niche spots
  return Math.min(1.0, Math.max(0.70, confidence));
}

export function computeCompositeScore(restaurant) {
  const scores = {
    tabelog: normalizeTabelog(restaurant.tabelog?.score),
    michelin: normalizeMichelin(restaurant.michelin),
    google: normalizeGoogle(restaurant.google?.rating),
    media: normalizeMedia(restaurant.sources),
  };

  let totalWeight = 0;
  let weightedSum = 0;

  for (const [key, score] of Object.entries(scores)) {
    if (score !== null) {
      weightedSum += score * WEIGHTS[key];
      totalWeight += WEIGHTS[key];
    }
  }

  if (totalWeight === 0) return 0;

  // Raw score normalized to active weights
  const raw = weightedSum / totalWeight;

  // Apply confidence multiplier
  const confidence = computeConfidence(restaurant);
  const adjusted = raw * confidence;

  // Scale to 0.0 - 9.9 display range
  return Math.min(9.9, Math.max(0, (adjusted / 100) * 9.9));
}

// Export for display in detail panel
export function getConfidence(restaurant) {
  return computeConfidence(restaurant);
}

export function getConfidenceLabel(restaurant) {
  const c = computeConfidence(restaurant);
  if (c >= 0.95) return { label: 'Very High', color: 'text-accent' };
  if (c >= 0.85) return { label: 'High', color: 'text-text' };
  if (c >= 0.75) return { label: 'Moderate', color: 'text-muted' };
  return { label: 'Low', color: 'text-muted' };
}

export function getScoreTier(score) {
  if (score >= 9.0) return { label: 'Exceptional', color: 'text-accent' };
  if (score >= 8.0) return { label: 'Outstanding', color: 'text-accent' };
  if (score >= 7.0) return { label: 'Excellent', color: 'text-gold' };
  if (score >= 6.0) return { label: 'Very Good', color: 'text-text' };
  if (score >= 5.0) return { label: 'Good', color: 'text-muted' };
  return { label: 'Recommended', color: 'text-muted' };
}

export function getSourceCount(restaurant) {
  return restaurant.sources?.length || 0;
}
