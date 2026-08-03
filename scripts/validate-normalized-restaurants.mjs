import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { restaurants as sourceRestaurants } from "../src/data/restaurants.js";
import {
  validateNormalizedArtifact,
  validatePublicArtifact,
} from "./restaurant-normalization-contract.mjs";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const ARTIFACT_PATH = `${PROJECT_ROOT}data-audit/normalized/restaurants.json`;
const PUBLIC_ARTIFACT_PATH = `${PROJECT_ROOT}data-audit/normalized/publishable-restaurants.json`;
const EXPECTED_PUBLISHABLE = 91;
const EXPECTED_HELD_ACTIVE_HIGH = new Map([
  ["sukiyabashi-jiro", "access_restricted"],
  ["sushi-saito", "access_restricted"],
  ["kagari-ginza", "audit_flag:duplicate_elsewhere_in_dataset"],
  ["shin-udon", "audit_flag:duplicate_record"],
  ["kitchen-nankai", "audit_flag:successor_identity"],
  ["nanaya-gelato", "audit_flag:branch_label_missing"],
  ["teppanyaki-okuda", "audit_flag:cuisine_identity_conflation"],
  ["nihonbashi-kakigaracho-sugita", "audit_flag:name_too_generic"],
  ["ginza-kagari", "audit_flag:semantic_duplicate_of_record_18"],
  ["tonkatsu-hasegawa", "audit_flag:branch_conflation"],
  ["nabezo-shibuya", "audit_flag:branch_ambiguous"],
  ["italian-carmine", "audit_flag:branch_identity_conflation"],
  ["wagyu-yazawa", "audit_flag:name_too_generic"],
  ["cafe-sarutahiko", "audit_flag:branch_label_missing"],
]);

const [artifact, publicArtifact] = await Promise.all([
  readFile(ARTIFACT_PATH, "utf8").then(JSON.parse),
  readFile(PUBLIC_ARTIFACT_PATH, "utf8").then(JSON.parse),
]);
const sourceRecords = sourceRestaurants.map((record, index) => ({
  index,
  id: record.id,
}));
const errors = [
  ...validateNormalizedArtifact(artifact, sourceRecords),
  ...validatePublicArtifact(publicArtifact, artifact),
];

if (artifact.counts?.publishable !== EXPECTED_PUBLISHABLE) {
  errors.push(
    `Strict release gate changed: expected ${EXPECTED_PUBLISHABLE} publishable records, found ${artifact.counts?.publishable}`,
  );
}
if (publicArtifact.count !== EXPECTED_PUBLISHABLE) {
  errors.push(
    `Public artifact changed: expected ${EXPECTED_PUBLISHABLE} records, found ${publicArtifact.count}`,
  );
}

const recordsById = new Map(artifact.records.map((record) => [record.id, record]));
const publicIds = new Set(publicArtifact.records.map((record) => record.id));
for (const [id, blockingReason] of EXPECTED_HELD_ACTIVE_HIGH) {
  const record = recordsById.get(id);
  if (!record || record.status !== "active" || record.confidence !== "high") {
    errors.push(`${id} is missing from the active, high-confidence hold fixture`);
    continue;
  }
  if (record.publishable || publicIds.has(id)) {
    errors.push(`${id} exposes a blocking audit risk in the public artifact`);
  }
  if (!record.holdReasons.includes(blockingReason)) {
    errors.push(`${id} is missing expected blocking reason ${blockingReason}`);
  }
}

if (errors.length > 0) {
  console.error(`Normalized restaurant validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${artifact.counts.total} records: ${artifact.counts.publishable} publishable, ${artifact.counts.held} held`,
  );
}
