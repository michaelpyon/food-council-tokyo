/**
 * Curated editorial lists
 * Each list filters restaurants by specific criteria
 */

export const curatedLists = [
  {
    id: 'first-timers',
    title: 'First Time in Tokyo',
    subtitle: 'The essential hits. No reservations needed for most.',
    emoji: '🗼',
    filter: (r) =>
      r.tags?.includes('walk-in-ok') &&
      r.priceRange <= 3 &&
      (r._compositeScore || 0) >= 6.0,
    limit: 20,
  },
  {
    id: 'michelin-stars',
    title: 'Michelin Stars',
    subtitle: 'Every starred restaurant in the database.',
    emoji: '⭐',
    filter: (r) => r.michelin?.stars >= 1,
    sort: (a, b) => (b.michelin?.stars || 0) - (a.michelin?.stars || 0),
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    subtitle: 'High Tabelog scores, under the tourist radar.',
    emoji: '💎',
    filter: (r) =>
      (r.tabelog?.score || 0) >= 3.7 &&
      (r.google?.reviews || 0) < 500 &&
      !r.sources?.includes('eater') &&
      !r.sources?.includes('cnt'),
    limit: 20,
  },
  {
    id: 'under-1000',
    title: 'Under ¥1,000',
    subtitle: 'Outstanding food that costs less than a subway ride home.',
    emoji: '💰',
    filter: (r) => r.priceRange === 1 && (r._compositeScore || 0) >= 4.5,
  },
  {
    id: 'late-night',
    title: 'Late Night',
    subtitle: 'Open past 11pm. For post-izakaya ramen runs.',
    emoji: '🌙',
    filter: (r) => r.tags?.includes('late-night'),
  },
  {
    id: 'ramen-circuit',
    title: 'The Ramen Circuit',
    subtitle: 'Every style, every broth. Mapped by neighborhood.',
    emoji: '🍜',
    filter: (r) => r.cuisine === 'Ramen',
    sort: (a, b) => (b._compositeScore || 0) - (a._compositeScore || 0),
  },
  {
    id: 'sushi-counter',
    title: 'Sushi Counter Guide',
    subtitle: 'From ¥3,000 kaitenzushi to ¥50,000 omakase.',
    emoji: '🍣',
    filter: (r) => r.cuisine === 'Sushi',
    sort: (a, b) => a.priceRange - b.priceRange,
  },
  {
    id: 'date-night',
    title: 'Date Night',
    subtitle: 'Impressive without trying too hard.',
    emoji: '🕯️',
    filter: (r) =>
      r.priceRange >= 3 &&
      (r._compositeScore || 0) >= 7.0 &&
      ['Kaiseki', 'French', 'Italian', 'Sushi', 'Teppanyaki'].includes(r.cuisine),
    limit: 15,
  },
  {
    id: 'english-friendly',
    title: 'English Friendly',
    subtitle: 'English menus and staff who can help navigate.',
    emoji: '🗣️',
    filter: (r) => r.tags?.includes('english-menu'),
  },
  {
    id: 'bib-gourmand',
    title: 'Bib Gourmand',
    subtitle: 'Michelin-recognized value. Great food, fair prices.',
    emoji: '😋',
    filter: (r) => r.michelin?.bib === true,
  },
];
