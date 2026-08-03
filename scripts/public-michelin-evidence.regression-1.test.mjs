import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const publicArtifact = JSON.parse(
  readFileSync("data-audit/normalized/publishable-restaurants.json", "utf8"),
);

describe("public Michelin evidence", () => {
  it("omits a Michelin category page that no longer lists Sushi Yoshitake", () => {
    // Regression: ISSUE-005, stale category evidence was presented as a current guide source.
    const yoshitake = publicArtifact.records.find((record) => record.id === "sushi-yoshitake");

    expect(yoshitake.michelin).toEqual({
      distinction: null,
      edition: null,
      verified: false,
      sourceUrl: null,
    });
    expect(yoshitake.sources).toEqual([
      { type: "official", url: "https://www.sushi-yoshitake.com/" },
      { type: "tabelog", url: "https://tabelog.com/tokyo/A1301/A130101/13024076/" },
    ]);
  });
});
