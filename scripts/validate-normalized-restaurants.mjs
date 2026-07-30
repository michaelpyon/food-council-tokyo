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
const EXPECTED_PUBLISHABLE = 28;

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

if (errors.length > 0) {
  console.error(`Normalized restaurant validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${artifact.counts.total} records: ${artifact.counts.publishable} publishable, ${artifact.counts.held} held`,
  );
}
