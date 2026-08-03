import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PUBLIC_SOURCE_EXCLUSIONS,
  toPublicMichelin,
  toPublicSources,
  validatePublicArtifact,
} from "./restaurant-normalization-contract.mjs";

const normalizedArtifact = JSON.parse(
  readFileSync("data-audit/normalized/restaurants.json", "utf8"),
);
const publicArtifact = JSON.parse(
  readFileSync("data-audit/normalized/publishable-restaurants.json", "utf8"),
);

describe("public Michelin metadata sources", () => {
  // Regression: ISSUE-004 — excluded URLs could bypass source filtering through michelin.sourceUrl
  // Found by independent pre-land review on 2026-08-03
  // Report: .gstack/qa-reports/qa-report-localhost-verified91-2026-08-03.md
  it("nulls an otherwise verified distinction when its evidence URL is not public-safe", () => {
    const normalizedMutation = structuredClone(normalizedArtifact);
    const publicMutation = structuredClone(publicArtifact);
    const normalizedRecord = normalizedMutation.records.find((record) => record.id === "ryugin");
    const publicRecord = publicMutation.records.find((record) => record.id === "ryugin");
    const excludedUrl = PUBLIC_SOURCE_EXCLUSIONS[0].url;
    const unsafeMichelin = {
      ...normalizedRecord.michelin,
      sourceUrl: excludedUrl,
    };

    normalizedRecord.michelin = unsafeMichelin;
    normalizedRecord.sources.push({ type: "michelin", url: excludedUrl });
    publicRecord.michelin = unsafeMichelin;

    const unsafeErrors = validatePublicArtifact(publicMutation, normalizedMutation);
    expect(unsafeErrors.some((error) => error.includes("michelin does not match"))).toBe(true);
    expect(unsafeErrors.some((error) => error.includes("michelin.sourceUrl must be public-safe"))).toBe(true);

    publicRecord.michelin = toPublicMichelin(unsafeMichelin);
    publicRecord.sources = toPublicSources(normalizedRecord.sources, unsafeMichelin);
    expect(publicRecord.michelin).toEqual({
      distinction: null,
      edition: null,
      verified: false,
      sourceUrl: null,
    });
    expect(validatePublicArtifact(publicMutation, normalizedMutation)).toEqual([]);
  });
});
