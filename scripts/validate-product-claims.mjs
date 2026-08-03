import { readFile, stat } from 'node:fs/promises';

const EXPECTED = Object.freeze({
  publicCount: 28,
  sourceCount: 163,
  heldCount: 135,
  width: 1200,
  height: 630,
});

const FORBIDDEN_PUBLIC_FIELDS = new Set([
  'awards',
  'cuisine',
  'description',
  'google',
  'photoSeed',
  'priceRange',
  'reservationUrl',
  'subCuisine',
  'tabelog',
  'tags',
  '_compositeScore',
]);

const STALE_PUBLIC_CLAIMS = [
  /165 restaurants/i,
  /scored like locals/i,
  /scored on Tabelog/i,
  /every place gets a composite score/i,
];

const projectTextFiles = [
  'README.md',
  'BRAND.md',
  'DESIGN.md',
  'PERSONA.md',
  'SUGGESTIONS.md',
  'index.html',
  'public/og-image.svg',
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function pngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  invariant(signature === '89504e470d0a1a0a', 'public/og-image.png is not a PNG file');
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

const publicData = JSON.parse(
  await readFile('data-audit/normalized/publishable-restaurants.json', 'utf8'),
);

invariant(publicData.count === EXPECTED.publicCount, `Expected ${EXPECTED.publicCount} public records`);
invariant(publicData.sourceRecordCount === EXPECTED.sourceCount, `Expected ${EXPECTED.sourceCount} audited records`);
invariant(publicData.heldCount === EXPECTED.heldCount, `Expected ${EXPECTED.heldCount} held records`);
invariant(publicData.records.length === EXPECTED.publicCount, 'Public record count does not match metadata');

for (const record of publicData.records) {
  for (const field of FORBIDDEN_PUBLIC_FIELDS) {
    invariant(!Object.hasOwn(record, field), `${record.id} exposes unsupported field "${field}"`);
  }
  invariant(record.sources?.length > 0, `${record.id} has no direct evidence URL`);
}

for (const path of projectTextFiles) {
  const text = await readFile(path, 'utf8');
  for (const pattern of STALE_PUBLIC_CLAIMS) {
    invariant(!pattern.test(text), `${path} contains stale public claim ${pattern}`);
  }
}

const html = await readFile('index.html', 'utf8');
invariant(html.includes('28 Tokyo food and drink places'), 'index.html is missing the verified public count');
invariant(html.includes('163-record audit'), 'index.html is missing the audit count');

const socialSvg = await readFile('public/og-image.svg', 'utf8');
invariant(socialSvg.includes('Verified 28'), 'Social image is missing the verified public count');
invariant(socialSvg.includes('163-place audit'), 'Social image is missing the audit count');

const socialPng = await readFile('public/og-image.png');
const socialPngStat = await stat('public/og-image.png');
const dimensions = pngDimensions(socialPng);
invariant(socialPngStat.size > 10_000, 'Social image PNG is unexpectedly small');
invariant(
  dimensions.width === EXPECTED.width && dimensions.height === EXPECTED.height,
  `Social image must be ${EXPECTED.width}x${EXPECTED.height}`,
);

console.log(
  `Product claims validated: ${EXPECTED.publicCount} public, ${EXPECTED.heldCount} held, ${EXPECTED.sourceCount} audited.`,
);
