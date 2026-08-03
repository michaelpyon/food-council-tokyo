import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const publicArtifact = JSON.parse(
  readFileSync("data-audit/normalized/publishable-restaurants.json", "utf8"),
);

describe("public branch evidence", () => {
  it.each([
    {
      id: "blue-bottle-aoyama",
      current: "https://store.bluebottlecoffee.jp/pages/aoyama",
      stale: "https://bluebottlecoffee.jp/cafes/aoyama",
    },
    {
      id: "mensho-tokyo",
      current: "https://mensho.com/ja/location/mensho-tokyo-korakuen/",
      stale: "https://menya-shono.com/mensho-tokyo/",
    },
  ])("publishes the current exact branch page for $id", ({ id, current, stale }) => {
    // Regression: ISSUE-007, old branch URLs redirected to generic brand homepages.
    const record = publicArtifact.records.find((candidate) => candidate.id === id);
    const urls = record.sources.map((source) => source.url);

    expect(urls).toContain(current);
    expect(urls).not.toContain(stale);
  });
});
