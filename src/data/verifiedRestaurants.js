import verifiedData from '../../data-audit/normalized/publishable-restaurants.json';

export const VERIFIED_THROUGH = verifiedData.verifiedThrough;
export const SOURCE_RECORD_COUNT = verifiedData.sourceRecordCount;
export const HELD_RECORD_COUNT = verifiedData.heldCount;

export const restaurants = verifiedData.records.map(record => ({
  id: record.id,
  auditIndex: record.index,
  name: record.name,
  nameJa: record.nameJa,
  neighborhood: record.neighborhood,
  status: 'operating',
  lastVerified: record.lastVerified,
  sources: record.sources,
  michelin: record.michelin?.verified && record.michelin.distinction
    ? record.michelin
    : null,
}));

export const NEIGHBORHOODS = [...new Set(
  restaurants.map(restaurant => restaurant.neighborhood).filter(Boolean),
)].sort((a, b) => a.localeCompare(b));
