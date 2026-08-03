import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  ACCESS_RESTRICTED_AUDIT_FLAGS,
  ACCESS_RESTRICTED_IDS,
  EXCLUDED_LEGACY_FIELDS,
  MICHELIN_VOCABULARY,
  NON_BLOCKING_AUDIT_FLAGS,
  PUBLIC_SOURCE_EXCLUSIONS,
  SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS,
  SOURCE_TYPE_VOCABULARY,
  STATUS_VOCABULARY,
  isAccessRestricted,
  isBlockingHoldReason,
  needsNameJaCorrectionHold,
  toPublicMichelin,
  toPublicSources,
  validateNormalizedArtifact,
  validatePublicArtifact,
} from "./restaurant-normalization-contract.mjs";
import { restaurants as sourceRestaurants } from "../src/data/restaurants.js";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const INPUT_PATHS = [
  "src/data/restaurants.js",
  "data-audit/audit-000-081.json",
  "data-audit/audit-082-162.json",
];
const OUTPUT_PATH = "data-audit/normalized/restaurants.json";
const PUBLIC_OUTPUT_PATH = "data-audit/normalized/publishable-restaurants.json";

const NAME_JA_OVERRIDES = new Map([
  ["harutaka", "銀座 はるたか"],
  ["midori-sushi", "梅丘寿司の美登利総本店 渋谷店"],
  ["sushi-zanmai", "すしざんまい 本店"],
  ["sushi-shin", "西麻布 鮨 真"],
  ["fuunji", "風雲児 新宿本店"],
  ["afuri-ebisu", "AFURI 恵比寿"],
  ["nakiryu", "創作麺工房 鳴龍"],
  ["tsuta", "Japanese Soba Noodles 蔦"],
  ["rokurinsha", "六厘舎 東京駅東京ラーメンストリート"],
  ["kagari-ginza", "銀座 篝 本店"],
  ["ippudo-ebisu", "一風堂 恵比寿店"],
  ["soranoiro", "ソラノイロ NIPPON"],
  ["ryugin", "日本料理 龍吟"],
  ["ishikawa", "神楽坂 石かわ"],
  ["tempura-kondo", "てんぷら 近藤"],
  ["tsunahachi", "新宿つな八 総本店"],
  ["tenichi", "銀座 天一 本店"],
  ["maisen", "とんかつ まい泉 青山本店"],
  ["tonkatsu-suzuki", "とんかつ成蔵"],
  ["katsuzen", "とんかつ割烹 かつぜん"],
  ["tonki", "とんかつ とんき 目黒本店"],
  ["shin-udon", "うどん 慎"],
  ["marugame-seimen", "丸亀製麺 渋谷道玄坂店"],
  ["udon-shin", "うどん 慎"],
  ["tsurutontan", "つるとんたん UDON NOODLE Brasserie 六本木"],
  ["kanda-matsuya", "神田まつや 本店"],
  ["honmura-an", "本むら庵 荻窪本店"],
  ["sarashina-horii", "総本家 更科堀井 本店"],
  ["nodaiwa", "五代目 野田岩 麻布飯倉本店"],
  ["hashimoto-unagi", "うなぎ はし本"],
  ["gonpachi", "権八 西麻布"],
  ["shirube", "汁べゑ 下北沢店"],
  ["aragawa", "麤皮"],
  ["ukai-tei", "銀座うかい亭"],
  ["seryna-ginza", "銀座 瀬里奈"],
  ["satou-kichijoji", "吉祥寺さとう"],
  ["ethiop", "カリーライス専門店エチオピア 本店"],
  ["bondy", "欧風カレー ボンディ 神保町本店"],
  ["delhi", "デリー 上野店"],
  ["sometaro", "風流お好み焼 染太郎"],
  ["kiji-tokyo", "お好み焼 きじ 丸の内店"],
  ["kitchen-nankai", "キッチン南海 神保町店"],
  ["taimeiken", "日本橋たいめいけん"],
  ["joel-robuchon", "ガストロノミー ジョエル・ロブション"],
  ["florilege", "フロリレージュ"],
  ["china-fureika", "中国飯店 富麗華"],
  ["jasmine-thai", "ジャスミンタイ 四谷店"],
  ["korean-dining-chego", "チェゴヤ 渋谷店"],
  ["blue-bottle-aoyama", "ブルーボトルコーヒー 青山カフェ"],
  ["onibus-coffee", "ONIBUS COFFEE 中目黒店"],
  ["pelican-bakery", "パンのペリカン"],
  ["viron-shibuya", "VIRON 渋谷店"],
  ["toshi-yoroizuka", "トシ・ヨロイヅカ 東京"],
  ["star-bar", "STAR BAR GINZA"],
  ["criollo", "クリオロ本店"],
  ["hidemi-sugino", "イデミ スギノ"],
  ["suzukien-matcha", "壽々喜園 浅草本店"],
  ["nanaya-gelato", "ななや 青山店"],
  ["patisserie-sadaharu-aoki", "パティスリー・サダハル・アオキ・パリ 丸の内店"],
  ["teppan-baby", "鉄板ベイビー 渋谷店"],
  ["teppanyaki-okuda", "銀座 奥田"],
  ["usukifugu-yamadaya", "臼杵ふぐ 山田屋 西麻布"],
  ["tempura-motoyoshi", "天ぷら 元吉"],
  ["cantonese-en", "カントニーズ 燕 ケン タカセ"],
  ["sushi-kimura", "すし 喜邑"],
  ["ginza-onodera", "鮨 銀座おのでら 総本店"],
  ["nihonbashi-kakigaracho-sugita", "日本橋蛎殻町 すぎた"],
  ["mensho-ramen", "MENSHO"],
  ["hayashi-ramen", "らーめん はやし"],
  ["ginza-kagari", "銀座 篝 本店"],
  ["tempura-shunsai-tensei", "天ぷら 天青"],
  ["tonkatsu-hasegawa", "とんかつ はせ川 両国本店"],
  ["udon-maruka", "うどん 丸香"],
  ["nabezo-shibuya", "モーモーパラダイス 渋谷"],
  ["italian-carmine", "リストランテ カルミネ"],
  ["chukasoba-ginza-hachigou", "中華そば 銀座 八五"],
  ["wagyu-yazawa", "ミート矢澤 五反田本店"],
  ["cafe-sarutahiko", "猿田彦珈琲 恵比寿本店"],
  ["toraya-cafe", "TORAYA CAFE 表参道ヒルズ店"],
  ["takadanobaba-taisho-ken", "高田馬場大勝軒"],
  ["shinjuku-kappo-nakajima", "新宿割烹 中嶋"],
  ["manten-sushi", "まんてん鮨 日本橋"],
  ["cafe-de-lambre", "カフェ・ド・ランブル"],
  ["soba-hosokawa", "江戸蕎麦 ほそ川"],
]);

const CUISINE_OVERRIDES = new Map([
  ["mensho-tokyo", "Ramen"],
  ["ikenohata-yabu", "Soba"],
  ["toraji-shinjuku", "Yakiniku"],
  ["aragawa", "Steak"],
  ["seryna-ginza", "Japanese"],
  ["satou-kichijoji", "Retail"],
  ["gyukatsu-motomura", "Gyukatsu"],
  ["yoroniku", "Yakiniku"],
  ["mimiu", "Udon"],
  ["jasmine-thai", "Thai"],
  ["toshi-yoroizuka", "Dessert"],
  ["teppanyaki-okuda", "Japanese"],
  ["nabezo-shibuya", "Shabu-shabu"],
  ["wagyu-yazawa", "Hamburger steak"],
  ["shinjuku-kappo-nakajima", "Kappo"],
]);

const NEIGHBORHOOD_OVERRIDES = new Map([
  ["mimiu", null],
]);

const FIRST_STATUS_MAP = new Map([
  ["active", "active"],
  ["moved", "active"],
  ["branch_ambiguous", "ambiguous"],
  ["conflated", "ambiguous"],
  ["listing_hold", "unverified"],
  ["unverifiable", "unverified"],
  ["closed", "closed"],
  ["duplicate", "duplicate"],
  ["place_not_restaurant", "non_restaurant"],
  ["retail_not_restaurant", "non_restaurant"],
]);

const SECOND_STATUS_MAP = new Map([
  ["open", "active"],
  ["moved_open", "active"],
  ["open_successor", "active"],
  ["rebranded_open", "active"],
  ["temporarily_closed", "temporarily_closed"],
  ["closed", "closed"],
  ["closed_or_indefinitely_suspended", "closed"],
  ["unverifiable", "unverified"],
]);

const MICHELIN_MAP = new Map([
  ["3 stars", "three_stars"],
  ["three_stars", "three_stars"],
  ["2 stars", "two_stars"],
  ["two_stars", "two_stars"],
  ["1 star", "one_star"],
  ["one_star", "one_star"],
  ["Bib Gourmand", "bib_gourmand"],
  ["bib_gourmand", "bib_gourmand"],
  ["Selected", "selected"],
  ["selected", "selected"],
]);

function fullPath(relativePath) {
  return `${PROJECT_ROOT}${relativePath}`;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function cleanString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeSourceType(type) {
  if (SOURCE_TYPE_VOCABULARY.includes(type)) return type;
  return "other";
}

function normalizeSources(record, schema) {
  const sources = [];

  if (schema === "first") {
    for (const type of ["official", "michelin", "tabelog", "other"]) {
      for (const url of record.sources?.[type] || []) {
        sources.push({ type, url });
      }
    }
  } else {
    for (const source of record.sources || []) {
      sources.push({
        type: normalizeSourceType(source.type),
        url: source.url,
      });
    }
  }

  const deduplicated = new Map();
  for (const source of sources) {
    const url = cleanString(source.url);
    if (!url) continue;
    const normalized = { type: source.type, url };
    deduplicated.set(`${normalized.type}:${normalized.url}`, normalized);
  }

  return [...deduplicated.values()].sort((a, b) => {
    const typeDelta = SOURCE_TYPE_VOCABULARY.indexOf(a.type) - SOURCE_TYPE_VOCABULARY.indexOf(b.type);
    return typeDelta || a.url.localeCompare(b.url);
  });
}

function normalizeMichelin(record, schema, sources) {
  let verified = false;
  let rawDistinction = null;
  let sourceUrl = null;

  if (schema === "first") {
    verified = record.resolution?.michelin?.verification === "verified_current";
    rawDistinction = record.resolution?.michelin?.distinction;
    sourceUrl = record.resolution?.michelin?.sourceUrl;
  } else {
    verified = record.resolved?.michelin?.verified === true;
    rawDistinction = record.resolved?.michelin?.distinction;
    sourceUrl = sources.find((source) => source.type === "michelin")?.url || null;
  }

  const distinction = verified ? MICHELIN_MAP.get(rawDistinction) || null : null;
  if (!verified || !distinction || !sourceUrl) {
    return {
      distinction: null,
      edition: null,
      verified: false,
      sourceUrl: null,
    };
  }

  return {
    distinction,
    edition: 2026,
    verified: true,
    sourceUrl,
  };
}

function statusHoldReason(status) {
  switch (status) {
    case "closed":
      return "not_currently_operating";
    case "temporarily_closed":
      return "temporarily_closed";
    case "ambiguous":
      return "identity_or_branch_ambiguous";
    case "unverified":
      return "status_unverified";
    case "duplicate":
      return "duplicate_record";
    case "non_restaurant":
      return "not_a_restaurant";
    default:
      return null;
  }
}

function normalizeRecord(auditRecord, sourceRecord, schema, verifiedDate) {
  if (auditRecord.index !== sourceRecord.index || auditRecord.id !== sourceRecord.id) {
    throw new Error(
      `Audit/source identity mismatch at index ${sourceRecord.index}: ${auditRecord.id} !== ${sourceRecord.id}`,
    );
  }

  const resolution = schema === "first" ? auditRecord.resolution : auditRecord.resolved;
  const rawStatus = resolution.status;
  const statusMap = schema === "first" ? FIRST_STATUS_MAP : SECOND_STATUS_MAP;
  const status = statusMap.get(rawStatus);
  if (!status) {
    throw new Error(`Unsupported ${schema} audit status "${rawStatus}" for ${auditRecord.id}`);
  }

  const auditFlags = schema === "first" ? resolution.flags || [] : auditRecord.flags || [];
  const confidence = schema === "first" ? resolution.confidence : auditRecord.confidence;
  const canonicalName = cleanString(
    schema === "first" ? resolution.canonicalName : resolution.branch,
  );
  const canonicalBranch = cleanString(
    schema === "first" ? resolution.exactBranch : resolution.branch,
  );
  const canonicalNameJa = canonicalName
    ? NAME_JA_OVERRIDES.get(auditRecord.id) || cleanString(sourceRecord.nameJa)
    : null;
  const canonicalCuisine = canonicalName
    ? CUISINE_OVERRIDES.get(auditRecord.id) || cleanString(sourceRecord.cuisine)
    : null;
  const canonicalNeighborhood = NEIGHBORHOOD_OVERRIDES.has(auditRecord.id)
    ? NEIGHBORHOOD_OVERRIDES.get(auditRecord.id)
    : cleanString(
        schema === "first" ? resolution.currentNeighborhood : resolution.neighborhood,
      );
  const sources = normalizeSources(auditRecord, schema);
  const michelin = normalizeMichelin(auditRecord, schema, sources);

  const holdReasons = [];
  const operatingHold = statusHoldReason(status);
  if (operatingHold) holdReasons.push(operatingHold);
  if (confidence !== "high") holdReasons.push("confidence_not_high");
  for (const flag of auditFlags) holdReasons.push(`audit_flag:${flag}`);
  if (isAccessRestricted(auditRecord.id, auditFlags)) {
    holdReasons.push("access_restricted");
  }
  if (needsNameJaCorrectionHold(auditFlags, NAME_JA_OVERRIDES.has(auditRecord.id))) {
    holdReasons.push("audit_flag:uncorrected_name_ja");
  }

  if (!canonicalName) holdReasons.push("missing_canonical_name");
  if (!canonicalNameJa) holdReasons.push("missing_canonical_name_ja");
  if (!canonicalCuisine) holdReasons.push("missing_canonical_cuisine");
  if (!canonicalNeighborhood) holdReasons.push("missing_canonical_neighborhood");
  if (!toPublicSources(sources, michelin).some(
    (source) => source.type === "official" || source.type === "michelin" || source.type === "tabelog",
  )) {
    holdReasons.push("missing_direct_source");
  }

  const uniqueHoldReasons = [...new Set(holdReasons)].sort();
  const blockingHoldReasons = uniqueHoldReasons.filter(isBlockingHoldReason);
  const publishable =
    status === "active" &&
    confidence === "high" &&
    blockingHoldReasons.length === 0;

  return {
    index: sourceRecord.index,
    id: sourceRecord.id,
    canonical: {
      name: canonicalName,
      nameJa: canonicalNameJa,
      branch: canonicalBranch,
      cuisine: canonicalCuisine,
      neighborhood: canonicalNeighborhood,
    },
    status,
    publishable,
    holdReasons: uniqueHoldReasons,
    michelin,
    lastVerified: verifiedDate,
    confidence,
    sources,
  };
}

async function buildArtifact() {
  const rawInputs = await Promise.all(
    INPUT_PATHS.map(async (path) => ({
      path,
      content: await readFile(fullPath(path), "utf8"),
    })),
  );
  const inputByPath = new Map(rawInputs.map((input) => [input.path, input.content]));
  const firstAudit = JSON.parse(inputByPath.get(INPUT_PATHS[1]));
  const secondAudit = JSON.parse(inputByPath.get(INPUT_PATHS[2]));

  if (sourceRestaurants.length !== 163) {
    throw new Error(`Expected 163 source restaurants, found ${sourceRestaurants.length}`);
  }
  if (firstAudit.records.length !== 82 || secondAudit.records.length !== 81) {
    throw new Error("Audit slices do not contain the expected 82 + 81 records");
  }

  const sourceRecords = sourceRestaurants.map((record, index) => ({
    index,
    id: record.id,
    nameJa: record.nameJa,
    cuisine: record.cuisine,
  }));

  const records = [
    ...firstAudit.records.map((record) =>
      normalizeRecord(
        record,
        sourceRecords[record.index],
        "first",
        firstAudit.auditDate,
      ),
    ),
    ...secondAudit.records.map((record) =>
      normalizeRecord(
        record,
        sourceRecords[record.index],
        "second",
        secondAudit.audit_metadata.audited_as_of,
      ),
    ),
  ].sort((a, b) => a.index - b.index);

  const byStatus = Object.fromEntries(
    STATUS_VOCABULARY.map((status) => [
      status,
      records.filter((record) => record.status === status).length,
    ]),
  );
  const publishableCount = records.filter((record) => record.publishable).length;
  const verifiedThrough = [firstAudit.auditDate, secondAudit.audit_metadata.audited_as_of]
    .sort()
    .at(-1);

  const artifact = {
    schemaVersion: "1.0.0",
    verifiedThrough,
    policy: {
      publishableRule: "status=active AND confidence=high AND blockingHoldReasons=0",
      accessRestrictedIds: ACCESS_RESTRICTED_IDS,
      accessRestrictedAuditFlags: ACCESS_RESTRICTED_AUDIT_FLAGS,
      nonBlockingAuditFlags: NON_BLOCKING_AUDIT_FLAGS,
      publicSourceExclusions: PUBLIC_SOURCE_EXCLUSIONS,
      supersededPublicSourceExclusions: SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS,
      statusVocabulary: STATUS_VOCABULARY,
      michelinVocabulary: MICHELIN_VOCABULARY,
      excludedLegacyFields: EXCLUDED_LEGACY_FIELDS,
    },
    sourceInputs: rawInputs.map((input) => ({
      path: input.path,
      sha256: sha256(input.content),
    })),
    counts: {
      total: records.length,
      publishable: publishableCount,
      held: records.length - publishableCount,
      byStatus,
    },
    records,
  };

  const errors = validateNormalizedArtifact(artifact, sourceRecords);
  if (errors.length > 0) {
    throw new Error(`Generated artifact failed validation:\n${errors.join("\n")}`);
  }

  const publicArtifact = {
    schemaVersion: "1.0.0",
    verifiedThrough,
    sourceRecordCount: records.length,
    count: publishableCount,
    heldCount: records.length - publishableCount,
    records: records
      .filter((record) => record.publishable)
      .map((record) => ({
        index: record.index,
        id: record.id,
        name: record.canonical.name,
        nameJa: record.canonical.nameJa,
        branch: record.canonical.branch,
        neighborhood: record.canonical.neighborhood,
        michelin: toPublicMichelin(record.michelin),
        lastVerified: record.lastVerified,
        sources: toPublicSources(record.sources, record.michelin),
      })),
  };

  const publicErrors = validatePublicArtifact(publicArtifact, artifact);
  if (publicErrors.length > 0) {
    throw new Error(`Generated public artifact failed validation:\n${publicErrors.join("\n")}`);
  }

  return { artifact, publicArtifact, sourceRecords };
}

async function main() {
  const { artifact, publicArtifact } = await buildArtifact();
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  const publicSerialized = `${JSON.stringify(publicArtifact, null, 2)}\n`;
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    const [current, currentPublic] = await Promise.all([
      readFile(fullPath(OUTPUT_PATH), "utf8"),
      readFile(fullPath(PUBLIC_OUTPUT_PATH), "utf8"),
    ]);
    if (current !== serialized || currentPublic !== publicSerialized) {
      throw new Error(`${OUTPUT_PATH} is stale. Run node scripts/normalize-restaurant-audits.mjs`);
    }
    console.log(`Normalized artifacts are current: ${artifact.counts.total} records, ${artifact.counts.publishable} publishable`);
    return;
  }

  await Promise.all([
    writeFile(fullPath(OUTPUT_PATH), serialized, "utf8"),
    writeFile(fullPath(PUBLIC_OUTPUT_PATH), publicSerialized, "utf8"),
  ]);
  console.log(`Wrote normalized artifacts: ${artifact.counts.total} records, ${artifact.counts.publishable} publishable`);
}

await main();
