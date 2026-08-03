import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS,
  isAllowedPublicSourceUrl,
} from "./restaurant-normalization-contract.mjs";

const publicArtifact = JSON.parse(
  readFileSync("data-audit/normalized/publishable-restaurants.json", "utf8"),
);

const currentTabelogById = new Map([
  ["tsurutontan", "https://tabelog.com/tokyo/A1307/A130701/13299475/"],
  ["taimeiken", "https://tabelog.com/tokyo/A1302/A130202/13252161/"],
  ["365-nichi", "https://tabelog.com/tokyo/A1318/A131810/13263836/"],
  ["bar-high-five", "https://tabelog.com/tokyo/A1301/A130101/13188812/"],
  ["tempura-motoyoshi", "https://tabelog.com/tokyo/A1303/A130302/13270939/"],
]);

describe("resolved branch evidence", () => {
  // Regression: ISSUE-001 — moved restaurants exposed superseded branch links
  // Found by /qa on 2026-08-03
  // Report: .gstack/qa-reports/qa-report-localhost-verified91-2026-08-03.md
  it("publishes only the current Tabelog listing for moved restaurants", () => {
    expect(SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS).toHaveLength(5);

    for (const source of SUPERSEDED_PUBLIC_SOURCE_EXCLUSIONS) {
      expect(source.reason, source.url).toBe("superseded_listing");
      expect(isAllowedPublicSourceUrl(source.url), source.url).toBe(false);
    }

    for (const [id, expectedUrl] of currentTabelogById) {
      const record = publicArtifact.records.find((candidate) => candidate.id === id);
      const tabelogSources = record.sources.filter((source) => source.type === "tabelog");

      expect(isAllowedPublicSourceUrl(expectedUrl), expectedUrl).toBe(true);
      expect(tabelogSources, id).toEqual([{ type: "tabelog", url: expectedUrl }]);
    }
  });
});
