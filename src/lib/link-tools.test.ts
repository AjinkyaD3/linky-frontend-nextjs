import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyUtm,
  completeRules,
  contrastRatio,
  instantToLocalInput,
  localInputToInstant,
  parseBulkLines,
} from "./link-tools.ts";

describe("applyUtm", () => {
  it("returns the URL untouched when no UTM value is set", () => {
    assert.equal(applyUtm("https://example.com/a?x=1", {}), "https://example.com/a?x=1");
    assert.equal(applyUtm("https://example.com", { source: "  " }), "https://example.com");
  });

  it("adds utm_* parameters and keeps existing query parameters", () => {
    const out = new URL(applyUtm("https://example.com/a?x=1", { source: "news", medium: "email", campaign: "spring sale" }));
    assert.equal(out.searchParams.get("x"), "1");
    assert.equal(out.searchParams.get("utm_source"), "news");
    assert.equal(out.searchParams.get("utm_medium"), "email");
    assert.equal(out.searchParams.get("utm_campaign"), "spring sale");
    assert.equal(out.searchParams.has("utm_term"), false);
  });

  it("overwrites an existing utm parameter instead of duplicating it", () => {
    const out = new URL(applyUtm("https://example.com/?utm_source=old", { source: "new" }));
    assert.deepEqual(out.searchParams.getAll("utm_source"), ["new"]);
  });
});

describe("datetime helpers", () => {
  it("round-trips a local datetime through an ISO instant", () => {
    const iso = localInputToInstant("2030-01-15T10:30");
    assert.ok(iso && iso.endsWith("Z"));
    assert.equal(instantToLocalInput(iso), "2030-01-15T10:30");
  });

  it("handles empty and invalid input", () => {
    assert.equal(localInputToInstant(""), undefined);
    assert.equal(localInputToInstant("not a date"), undefined);
    assert.equal(instantToLocalInput(null), "");
    assert.equal(instantToLocalInput("garbage"), "");
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white and 1 for identical colours", () => {
    assert.ok(Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 0.01);
    assert.equal(contrastRatio("#336699", "#336699"), 1);
  });

  it("flags a pale grey on white as too faint to scan", () => {
    assert.ok(contrastRatio("#cccccc", "#ffffff") < 3);
    assert.ok(contrastRatio("#1a2b3c", "#ffeeaa") > 3);
  });

  it("is symmetric", () => {
    assert.equal(contrastRatio("#123456", "#fedcba"), contrastRatio("#fedcba", "#123456"));
  });
});

describe("parseBulkLines", () => {
  it("parses one URL per line, skipping blanks", () => {
    assert.deepEqual(parseBulkLines("https://a.com\n\n  https://b.com  \r\n"), [
      { originalUrl: "https://a.com" },
      { originalUrl: "https://b.com" },
    ]);
  });

  it("treats `alias, url` as a custom alias", () => {
    assert.deepEqual(parseBulkLines("sale-2026, https://example.com/three"), [
      { customAlias: "sale-2026", originalUrl: "https://example.com/three" },
    ]);
  });

  it("does not mistake a comma inside a URL for an alias separator", () => {
    assert.deepEqual(parseBulkLines("https://example.com/a,b"), [{ originalUrl: "https://example.com/a,b" }]);
  });
});

describe("completeRules", () => {
  it("drops half-filled rules and trims the rest", () => {
    const rules = completeRules([
      { type: "device", value: " mobile ", url: " https://m.example.com " },
      { type: "country", value: "", url: "https://x.com" },
      { type: "os", value: "ios", url: "" },
    ]);
    assert.deepEqual(rules, [{ type: "device", value: "mobile", url: "https://m.example.com" }]);
  });
});
