const SOURCE_LABELS = {
  official: 'Official site',
  tabelog: 'Tabelog record',
  michelin: 'Michelin Guide',
  other: 'Supporting source',
};

export function sourceLabel(source) {
  return SOURCE_LABELS[source?.type] || 'Evidence source';
}

export function verifiedSources(restaurant) {
  const seen = new Set();
  return (restaurant.sources || []).filter(source => {
    if (!source?.url || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}
