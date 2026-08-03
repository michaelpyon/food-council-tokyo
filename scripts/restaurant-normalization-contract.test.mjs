import { describe, expect, it } from "vitest";
import {
  ACCESS_RESTRICTED_AUDIT_FLAGS,
  ACCESS_RESTRICTED_IDS,
  NON_BLOCKING_AUDIT_FLAGS,
  NAME_JA_CORRECTION_FLAGS,
  PUBLIC_SOURCE_EXCLUSIONS,
  isAllowedPublicSourceUrl,
  isAccessRestricted,
  isBlockingAuditFlag,
  isBlockingHoldReason,
  needsNameJaCorrectionHold,
  toPublicSources,
} from "./restaurant-normalization-contract.mjs";

describe("restaurant publication flag policy", () => {
  it("recognizes only the explicit metadata-correction allowlist", () => {
    expect(NON_BLOCKING_AUDIT_FLAGS).toHaveLength(25);
    for (const flag of NON_BLOCKING_AUDIT_FLAGS) {
      expect(isBlockingAuditFlag(flag), flag).toBe(false);
      expect(isBlockingHoldReason(`audit_flag:${flag}`), flag).toBe(false);
    }
  });

  it("fails closed for identity, branch, duplicate, status, source, and future flags", () => {
    for (const flag of [
      "branch_ambiguous",
      "branch_identity_conflation",
      "duplicate_record",
      "members_or_introduction_only",
      "operating_status_unconfirmed",
      "unsupported_source",
      "future_unreviewed_flag",
    ]) {
      expect(isBlockingAuditFlag(flag), flag).toBe(true);
      expect(isBlockingHoldReason(`audit_flag:${flag}`), flag).toBe(true);
    }

    expect(isBlockingHoldReason("missing_direct_source")).toBe(true);
    expect(isBlockingHoldReason("not_currently_operating")).toBe(true);
  });

  it("keeps unsupported HTTP evidence out of the public source set", () => {
    expect(isAllowedPublicSourceUrl("https://example.com/evidence")).toBe(true);
    expect(isAllowedPublicSourceUrl("http://www.genyamamoto.jp")).toBe(true);
    expect(isAllowedPublicSourceUrl("http://example.com/evidence")).toBe(false);
    expect(isAllowedPublicSourceUrl("javascript:alert(1)")).toBe(false);
  });

  it("keeps exact browser-health failures in the audit but out of public sources", () => {
    expect(PUBLIC_SOURCE_EXCLUSIONS).toHaveLength(5);
    for (const source of PUBLIC_SOURCE_EXCLUSIONS) {
      expect(source.reason.length, source.url).toBeGreaterThan(0);
      expect(isAllowedPublicSourceUrl(source.url), source.url).toBe(false);
    }
  });

  it("publishes only the exact current Michelin evidence URL", () => {
    const currentUrl = "https://guide.michelin.com/en/tokyo-region/tokyo/restaurant/current-place";
    const staleCategoryUrl = "https://guide.michelin.com/en/jp/tokyo-region/tokyo/restaurants/3-stars-michelin";
    const sources = [
      { type: "official", url: "https://example.com/place" },
      { type: "michelin", url: staleCategoryUrl },
      { type: "michelin", url: currentUrl },
    ];

    expect(toPublicSources(sources, {
      distinction: "one_star",
      edition: 2026,
      verified: true,
      sourceUrl: currentUrl,
    })).toEqual([
      { type: "official", url: "https://example.com/place" },
      { type: "michelin", url: currentUrl },
    ]);

    expect(toPublicSources(sources, {
      distinction: null,
      edition: null,
      verified: false,
      sourceUrl: null,
    })).toEqual([
      { type: "official", url: "https://example.com/place" },
    ]);
  });

  it("requires an explicit override before Japanese-name flags become non-blocking", () => {
    for (const flag of NAME_JA_CORRECTION_FLAGS) {
      expect(needsNameJaCorrectionHold([flag], true), flag).toBe(false);
      expect(needsNameJaCorrectionHold([flag], false), flag).toBe(true);
    }
    expect(needsNameJaCorrectionHold(["stale_michelin"], false)).toBe(false);
    expect(isBlockingAuditFlag("uncorrected_name_ja")).toBe(true);
  });

  it("fails closed for explicit and future access-restricted records", () => {
    expect(ACCESS_RESTRICTED_IDS).toEqual(["sukiyabashi-jiro"]);
    expect(ACCESS_RESTRICTED_AUDIT_FLAGS).toEqual([
      "members_or_introduction_only",
      "access_restricted",
    ]);
    expect(isAccessRestricted("sukiyabashi-jiro", ["stale_michelin"])).toBe(true);
    expect(isAccessRestricted("sushi-saito", ["members_or_introduction_only"])).toBe(true);
    expect(isAccessRestricted("future-record", ["access_restricted"])).toBe(true);
    expect(isAccessRestricted("ordinary-record", ["stale_michelin"])).toBe(false);
    expect(isBlockingHoldReason("access_restricted")).toBe(true);
  });
});
