export const STATUS_VOCABULARY = [
  "active",
  "temporarily_closed",
  "closed",
  "ambiguous",
  "unverified",
  "duplicate",
  "non_restaurant",
];

export const MICHELIN_VOCABULARY = [
  "three_stars",
  "two_stars",
  "one_star",
  "bib_gourmand",
  "selected",
];

export const CONFIDENCE_VOCABULARY = [
  "high",
  "moderate",
  "low",
  "unknown",
];

export const SOURCE_TYPE_VOCABULARY = [
  "official",
  "michelin",
  "tabelog",
  "other",
];

export const NON_BLOCKING_AUDIT_FLAGS = [
  // The canonical neighborhood comes from the resolved audit field.
  "stale_neighborhood",
  "neighborhood_mismatch",
  "neighborhood_imprecise",
  "neighborhood_too_broad",
  // Michelin data is published only when the audit verifies a current distinction.
  "stale_michelin",
  "obsolete_michelin_plate",
  "obsolete_plate_taxonomy",
  "michelin_changed",
  "michelin_category_updated",
  "michelin_stale",
  "michelin_stale_unverified",
  "michelin_false",
  "michelin_current_status_unverified",
  // Cuisine is retained for administration but omitted from the public artifact.
  "wrong_cuisine",
  "cuisine_too_narrow",
  "cuisine_imprecise",
  "cuisine_description_mismatch",
  // These Japanese names are corrected by explicit normalization overrides.
  "wrong_japanese_name",
  "nameJa_mismatch",
  "nameJa_incorrect",
  "nameJa_imprecise",
  // The audit resolves the current operating branch; stale IDs remain stable URL keys.
  "moved",
  "moved_within_neighborhood",
  "renamed",
  "stale_id",
];

export const NAME_JA_CORRECTION_FLAGS = [
  "wrong_japanese_name",
  "nameJa_mismatch",
  "nameJa_incorrect",
  "nameJa_imprecise",
];

const NON_BLOCKING_AUDIT_FLAG_SET = new Set(NON_BLOCKING_AUDIT_FLAGS);

export function isBlockingAuditFlag(flag) {
  return !NON_BLOCKING_AUDIT_FLAG_SET.has(flag);
}

export function isBlockingHoldReason(reason) {
  if (typeof reason !== "string" || !reason.startsWith("audit_flag:")) return true;
  return isBlockingAuditFlag(reason.slice("audit_flag:".length));
}

export function needsNameJaCorrectionHold(auditFlags, hasExplicitOverride) {
  return !hasExplicitOverride && auditFlags.some(
    (flag) => NAME_JA_CORRECTION_FLAGS.includes(flag),
  );
}

export const PUBLIC_HTTP_SOURCE_ALLOWLIST = [
  "http://www.genyamamoto.jp",
];

export const PUBLIC_SOURCE_EXCLUSIONS = [
  { url: "https://www.nihonryori-ryugin.com/", reason: "expired_certificate" },
  { url: "https://yakitori-imai.jp/", reason: "dns_failure" },
  { url: "https://www.kanda-matsuya.jp/", reason: "hostname_mismatch" },
  { url: "https://www.nodaiwa.co.jp/", reason: "https_connection_failure" },
  { url: "https://yoroniku.jp/", reason: "dns_failure" },
];

export const SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS = [
  { url: "https://tabelog.com/tokyo/A1307/A130701/13001859/", reason: "superseded_listing" },
  { url: "https://tabelog.com/tokyo/A1302/A130202/13000488/", reason: "superseded_listing" },
  { url: "https://tabelog.com/tokyo/A1318/A131810/13164031/", reason: "superseded_listing" },
  { url: "https://tabelog.com/tokyo/A1301/A130103/13060358/", reason: "superseded_listing" },
  { url: "https://tabelog.com/tokyo/A1306/A130603/13035758/", reason: "superseded_listing" },
];

const PUBLIC_SOURCE_EXCLUSION_SET = new Set(
  [...PUBLIC_SOURCE_EXCLUSIONS, ...SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS].map(
    (source) => source.url,
  ),
);

export const ACCESS_RESTRICTED_IDS = [
  // The audit confirms operation but says ordinary public reservations are unavailable.
  "sukiyabashi-jiro",
];

export const ACCESS_RESTRICTED_AUDIT_FLAGS = [
  "members_or_introduction_only",
  "access_restricted",
];

const ACCESS_RESTRICTED_ID_SET = new Set(ACCESS_RESTRICTED_IDS);
const ACCESS_RESTRICTED_AUDIT_FLAG_SET = new Set(ACCESS_RESTRICTED_AUDIT_FLAGS);

export function isAccessRestricted(recordId, auditFlags = []) {
  return ACCESS_RESTRICTED_ID_SET.has(recordId) || auditFlags.some(
    (flag) => ACCESS_RESTRICTED_AUDIT_FLAG_SET.has(flag),
  );
}

export const BASE_HOLD_REASONS = [
  "not_currently_operating",
  "temporarily_closed",
  "identity_or_branch_ambiguous",
  "status_unverified",
  "duplicate_record",
  "not_a_restaurant",
  "access_restricted",
  "confidence_not_high",
  "missing_canonical_name",
  "missing_canonical_name_ja",
  "missing_canonical_cuisine",
  "missing_canonical_neighborhood",
  "missing_direct_source",
];

export const EXCLUDED_LEGACY_FIELDS = [
  "tabelog",
  "google",
  "priceRange",
  "description",
  "tags",
  "awards",
  "photoSeed",
  "image",
  "reservationUrl",
];

const TOP_LEVEL_KEYS = [
  "schemaVersion",
  "verifiedThrough",
  "policy",
  "sourceInputs",
  "counts",
  "records",
];

const POLICY_KEYS = [
  "publishableRule",
  "accessRestrictedIds",
  "accessRestrictedAuditFlags",
  "nonBlockingAuditFlags",
  "publicSourceExclusions",
  "supersededPublicSourceExclusions",
  "statusVocabulary",
  "michelinVocabulary",
  "excludedLegacyFields",
];

const INPUT_KEYS = ["path", "sha256"];
const COUNT_KEYS = ["total", "publishable", "held", "byStatus"];
const RECORD_KEYS = [
  "index",
  "id",
  "canonical",
  "status",
  "publishable",
  "holdReasons",
  "michelin",
  "lastVerified",
  "confidence",
  "sources",
];
const CANONICAL_KEYS = ["name", "nameJa", "branch", "cuisine", "neighborhood"];
const MICHELIN_KEYS = ["distinction", "edition", "verified", "sourceUrl"];
const SOURCE_KEYS = ["type", "url"];
const PUBLIC_TOP_LEVEL_KEYS = [
  "schemaVersion",
  "verifiedThrough",
  "sourceRecordCount",
  "count",
  "heldCount",
  "records",
];
const PUBLIC_RECORD_KEYS = [
  "index",
  "id",
  "name",
  "nameJa",
  "branch",
  "neighborhood",
  "michelin",
  "lastVerified",
  "sources",
];

function sameKeys(value, expected) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  return JSON.stringify(actual) === JSON.stringify([...expected].sort());
}

function isNullableString(value) {
  return value === null || (typeof value === "string" && value.length > 0);
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isAllowedPublicSourceUrl(value) {
  if (!isUrl(value)) return false;
  if (PUBLIC_SOURCE_EXCLUSION_SET.has(value)) return false;
  const url = new URL(value);
  return url.protocol === "https:" || PUBLIC_HTTP_SOURCE_ALLOWLIST.includes(value);
}

export function toPublicMichelin(michelin) {
  if (!michelin?.verified || !isAllowedPublicSourceUrl(michelin?.sourceUrl)) {
    return {
      distinction: null,
      edition: null,
      verified: false,
      sourceUrl: null,
    };
  }

  return {
    distinction: michelin.distinction,
    edition: michelin.edition,
    verified: true,
    sourceUrl: michelin.sourceUrl,
  };
}

function isHoldReason(value) {
  return BASE_HOLD_REASONS.includes(value) || /^audit_flag:[A-Za-z0-9_]+$/.test(value);
}

function push(errors, condition, message) {
  if (!condition) errors.push(message);
}

export function validateNormalizedArtifact(artifact, sourceRecords) {
  const errors = [];

  push(errors, sameKeys(artifact, TOP_LEVEL_KEYS), "Top-level keys do not match the contract");
  push(errors, artifact?.schemaVersion === "1.0.0", "schemaVersion must be 1.0.0");
  push(errors, isDate(artifact?.verifiedThrough), "verifiedThrough must be an ISO date");
  push(errors, sameKeys(artifact?.policy, POLICY_KEYS), "policy keys do not match the contract");
  push(
    errors,
    artifact?.policy?.publishableRule === "status=active AND confidence=high AND blockingHoldReasons=0",
    "publishableRule must match the strict release gate",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.accessRestrictedIds) === JSON.stringify(ACCESS_RESTRICTED_IDS),
    "accessRestrictedIds does not match the access policy",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.accessRestrictedAuditFlags) === JSON.stringify(ACCESS_RESTRICTED_AUDIT_FLAGS),
    "accessRestrictedAuditFlags does not match the access policy",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.nonBlockingAuditFlags) === JSON.stringify(NON_BLOCKING_AUDIT_FLAGS),
    "nonBlockingAuditFlags does not match the fail-closed allowlist",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.publicSourceExclusions) === JSON.stringify(PUBLIC_SOURCE_EXCLUSIONS),
    "publicSourceExclusions does not match the browser-health exclusion list",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.supersededPublicSourceExclusions) === JSON.stringify(SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS),
    "supersededPublicSourceExclusions does not match the resolved-branch exclusion list",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.statusVocabulary) === JSON.stringify(STATUS_VOCABULARY),
    "statusVocabulary does not match the contract",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.michelinVocabulary) === JSON.stringify(MICHELIN_VOCABULARY),
    "michelinVocabulary does not match the contract",
  );
  push(
    errors,
    JSON.stringify(artifact?.policy?.excludedLegacyFields) === JSON.stringify(EXCLUDED_LEGACY_FIELDS),
    "excludedLegacyFields does not match the contract",
  );

  push(errors, Array.isArray(artifact?.sourceInputs), "sourceInputs must be an array");
  for (const [inputIndex, input] of (artifact?.sourceInputs || []).entries()) {
    push(errors, sameKeys(input, INPUT_KEYS), `sourceInputs[${inputIndex}] keys are invalid`);
    push(errors, typeof input?.path === "string" && input.path.length > 0, `sourceInputs[${inputIndex}].path is invalid`);
    push(errors, /^[a-f0-9]{64}$/.test(input?.sha256 || ""), `sourceInputs[${inputIndex}].sha256 is invalid`);
  }

  push(errors, sameKeys(artifact?.counts, COUNT_KEYS), "counts keys do not match the contract");
  push(errors, Array.isArray(artifact?.records), "records must be an array");

  const records = artifact?.records || [];
  const expectedRecords = sourceRecords || [];
  push(errors, records.length === expectedRecords.length, `Expected ${expectedRecords.length} records, found ${records.length}`);

  const ids = new Set();
  const allowedStatuses = new Set(STATUS_VOCABULARY);
  const allowedMichelin = new Set(MICHELIN_VOCABULARY);
  const allowedConfidence = new Set(CONFIDENCE_VOCABULARY);
  const allowedSourceTypes = new Set(SOURCE_TYPE_VOCABULARY);

  for (const [position, record] of records.entries()) {
    const prefix = `records[${position}]`;
    const sourceRecord = expectedRecords[position];

    push(errors, sameKeys(record, RECORD_KEYS), `${prefix} keys do not match the contract`);
    push(errors, record?.index === position, `${prefix}.index must equal ${position}`);
    push(errors, record?.id === sourceRecord?.id, `${prefix}.id does not match source record`);
    push(errors, typeof record?.id === "string" && record.id.length > 0, `${prefix}.id is invalid`);
    push(errors, !ids.has(record?.id), `${prefix}.id is duplicated`);
    ids.add(record?.id);

    push(errors, sameKeys(record?.canonical, CANONICAL_KEYS), `${prefix}.canonical keys are invalid`);
    for (const key of CANONICAL_KEYS) {
      push(errors, isNullableString(record?.canonical?.[key]), `${prefix}.canonical.${key} is invalid`);
    }

    push(errors, allowedStatuses.has(record?.status), `${prefix}.status is invalid`);
    push(errors, typeof record?.publishable === "boolean", `${prefix}.publishable must be boolean`);
    push(errors, Array.isArray(record?.holdReasons), `${prefix}.holdReasons must be an array`);
    const reasons = record?.holdReasons || [];
    push(errors, reasons.every(isHoldReason), `${prefix}.holdReasons contains an invalid value`);
    push(errors, reasons.length === new Set(reasons).size, `${prefix}.holdReasons contains duplicates`);
    push(errors, JSON.stringify(reasons) === JSON.stringify([...reasons].sort()), `${prefix}.holdReasons must be sorted`);

    push(errors, sameKeys(record?.michelin, MICHELIN_KEYS), `${prefix}.michelin keys are invalid`);
    const distinction = record?.michelin?.distinction;
    push(errors, distinction === null || allowedMichelin.has(distinction), `${prefix}.michelin.distinction is invalid`);
    push(errors, record?.michelin?.edition === null || record.michelin.edition === 2026, `${prefix}.michelin.edition is invalid`);
    push(errors, typeof record?.michelin?.verified === "boolean", `${prefix}.michelin.verified must be boolean`);
    push(errors, isNullableString(record?.michelin?.sourceUrl), `${prefix}.michelin.sourceUrl is invalid`);

    if (record?.michelin?.verified) {
      push(errors, distinction !== null, `${prefix} has verified Michelin data without a distinction`);
      push(errors, record.michelin.edition === 2026, `${prefix} verified Michelin edition must be 2026`);
      push(errors, isUrl(record.michelin.sourceUrl), `${prefix} verified Michelin sourceUrl must be a URL`);
    } else {
      push(errors, distinction === null, `${prefix} unverified Michelin distinction must be null`);
      push(errors, record?.michelin?.edition === null, `${prefix} unverified Michelin edition must be null`);
      push(errors, record?.michelin?.sourceUrl === null, `${prefix} unverified Michelin sourceUrl must be null`);
    }

    push(errors, isDate(record?.lastVerified), `${prefix}.lastVerified must be an ISO date`);
    push(errors, allowedConfidence.has(record?.confidence), `${prefix}.confidence is invalid`);
    push(errors, Array.isArray(record?.sources), `${prefix}.sources must be an array`);

    const sourceKeys = new Set();
    for (const [sourceIndex, source] of (record?.sources || []).entries()) {
      const sourcePrefix = `${prefix}.sources[${sourceIndex}]`;
      push(errors, sameKeys(source, SOURCE_KEYS), `${sourcePrefix} keys are invalid`);
      push(errors, allowedSourceTypes.has(source?.type), `${sourcePrefix}.type is invalid`);
      push(errors, isUrl(source?.url), `${sourcePrefix}.url is invalid`);
      const sourceKey = `${source?.type}:${source?.url}`;
      push(errors, !sourceKeys.has(sourceKey), `${sourcePrefix} is duplicated`);
      sourceKeys.add(sourceKey);
    }

    const sortedSources = [...(record?.sources || [])].sort((a, b) => {
      const typeDelta = SOURCE_TYPE_VOCABULARY.indexOf(a.type) - SOURCE_TYPE_VOCABULARY.indexOf(b.type);
      return typeDelta || a.url.localeCompare(b.url);
    });
    push(errors, JSON.stringify(record?.sources) === JSON.stringify(sortedSources), `${prefix}.sources must be sorted`);

    if (record?.michelin?.verified) {
      push(
        errors,
        (record?.sources || []).some(
          (source) => source.type === "michelin" && source.url === record.michelin.sourceUrl,
        ),
        `${prefix} verified Michelin source is missing from sources`,
      );
    }

    const blockingReasons = reasons.filter(isBlockingHoldReason);
    const strictPass =
      record?.status === "active" &&
      record?.confidence === "high" &&
      blockingReasons.length === 0;
    push(errors, record?.publishable === strictPass, `${prefix}.publishable violates the strict release gate`);

    if (record?.publishable) {
      push(errors, Object.values(record.canonical).every((value) => typeof value === "string" && value.length > 0), `${prefix} publishable canonical fields must all be populated`);
      push(
        errors,
        record.sources.some(
          (source) =>
            (source.type === "official" ||
              source.type === "michelin" ||
              source.type === "tabelog") &&
            isAllowedPublicSourceUrl(source.url),
        ),
        `${prefix} publishable record needs a public-safe official, Michelin, or direct Tabelog source`,
      );
    } else {
      push(errors, blockingReasons.length > 0, `${prefix} held record needs at least one blocking hold reason`);
    }

    for (const excludedField of EXCLUDED_LEGACY_FIELDS) {
      push(errors, !(excludedField in record), `${prefix} contains excluded legacy field ${excludedField}`);
    }
  }

  const publishable = records.filter((record) => record.publishable).length;
  const byStatus = Object.fromEntries(
    STATUS_VOCABULARY.map((status) => [
      status,
      records.filter((record) => record.status === status).length,
    ]),
  );

  push(errors, artifact?.counts?.total === records.length, "counts.total is incorrect");
  push(errors, artifact?.counts?.publishable === publishable, "counts.publishable is incorrect");
  push(errors, artifact?.counts?.held === records.length - publishable, "counts.held is incorrect");
  push(errors, JSON.stringify(artifact?.counts?.byStatus) === JSON.stringify(byStatus), "counts.byStatus is incorrect");

  return errors;
}

export function validatePublicArtifact(publicArtifact, normalizedArtifact) {
  const errors = [];
  const expectedRecords = (normalizedArtifact?.records || []).filter(
    (record) => record.publishable,
  );

  push(
    errors,
    sameKeys(publicArtifact, PUBLIC_TOP_LEVEL_KEYS),
    "Public artifact top-level keys do not match the contract",
  );
  push(errors, publicArtifact?.schemaVersion === "1.0.0", "Public schemaVersion must be 1.0.0");
  push(
    errors,
    publicArtifact?.verifiedThrough === normalizedArtifact?.verifiedThrough,
    "Public verifiedThrough must match the normalized artifact",
  );
  push(
    errors,
    publicArtifact?.count === expectedRecords.length,
    "Public count does not match the normalized publishable count",
  );
  push(
    errors,
    publicArtifact?.sourceRecordCount === normalizedArtifact?.counts?.total,
    "Public sourceRecordCount does not match the normalized total",
  );
  push(
    errors,
    publicArtifact?.heldCount === normalizedArtifact?.counts?.held,
    "Public heldCount does not match the normalized held count",
  );
  push(errors, Array.isArray(publicArtifact?.records), "Public records must be an array");

  const publicRecords = publicArtifact?.records || [];
  push(
    errors,
    publicRecords.length === expectedRecords.length,
    `Expected ${expectedRecords.length} public records, found ${publicRecords.length}`,
  );

  for (const [position, record] of publicRecords.entries()) {
    const prefix = `public.records[${position}]`;
    const expected = expectedRecords[position];

    push(errors, sameKeys(record, PUBLIC_RECORD_KEYS), `${prefix} keys do not match the contract`);
    push(errors, record?.index === expected?.index, `${prefix}.index does not match normalized record`);
    push(errors, record?.id === expected?.id, `${prefix}.id does not match normalized record`);
    for (const key of ["name", "nameJa", "branch", "neighborhood"]) {
      push(
        errors,
        record?.[key] === expected?.canonical?.[key],
        `${prefix}.${key} does not match normalized canonical data`,
      );
      push(
        errors,
        typeof record?.[key] === "string" && record[key].length > 0,
        `${prefix}.${key} must be populated`,
      );
    }
    push(
      errors,
      JSON.stringify(record?.michelin) === JSON.stringify(toPublicMichelin(expected?.michelin)),
      `${prefix}.michelin does not match normalized record`,
    );
    push(
      errors,
      !record?.michelin?.verified || isAllowedPublicSourceUrl(record?.michelin?.sourceUrl),
      `${prefix}.michelin.sourceUrl must be public-safe when the distinction is verified`,
    );
    push(
      errors,
      record?.lastVerified === expected?.lastVerified,
      `${prefix}.lastVerified does not match normalized record`,
    );
    push(
      errors,
      JSON.stringify(record?.sources) === JSON.stringify(
        (expected?.sources || []).filter((source) => isAllowedPublicSourceUrl(source.url)),
      ),
      `${prefix}.sources does not match normalized record`,
    );
    for (const [sourceIndex, source] of (record?.sources || []).entries()) {
      push(
        errors,
        isAllowedPublicSourceUrl(source?.url),
        `${prefix}.sources[${sourceIndex}].url must use HTTPS or the exact public HTTP allowlist`,
      );
    }

    for (const excludedField of [
      ...EXCLUDED_LEGACY_FIELDS,
      "status",
      "publishable",
      "holdReasons",
      "confidence",
    ]) {
      push(errors, !(excludedField in record), `${prefix} contains excluded public field ${excludedField}`);
    }
  }

  return errors;
}
