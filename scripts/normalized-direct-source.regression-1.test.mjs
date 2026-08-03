import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { restaurants as sourceRestaurants } from "../src/data/restaurants.js";
import { validateNormalizedArtifact } from "./restaurant-normalization-contract.mjs";

const normalizedArtifact = JSON.parse(
  readFileSync("data-audit/normalized/restaurants.json", "utf8"),
);
const sourceRecords = sourceRestaurants.map((record, index) => ({
  index,
  id: record.id,
  nameJa: record.nameJa,
  cuisine: record.cuisine,
}));

describe("normalized direct-source validation", () => {
  it("rejects a publishable record backed only by stale Michelin category evidence", () => {
    // Regression: ISSUE-008, normalized validation didn't use the public Michelin sanitizer.
    const mutation = structuredClone(normalizedArtifact);
    const yoshitake = mutation.records.find((record) => record.id === "sushi-yoshitake");

    yoshitake.sources = [{
      type: "michelin",
      url: "https://guide.michelin.com/en/jp/tokyo-region/tokyo/restaurants/3-stars-michelin",
    }];

    const errors = validateNormalizedArtifact(mutation, sourceRecords);
    expect(errors).toContain(
      `records[${yoshitake.index}] publishable record needs a public direct source`,
    );
  });
});
