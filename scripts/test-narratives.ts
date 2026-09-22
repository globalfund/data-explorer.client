import assert from "node:assert/strict";
import fs from "node:fs";
import {
  expandNarrativeCitations,
  parseCountryNarrativeBundle,
} from "../src/app/types/narratives";

const fixturePath = process.argv[2] || "tests/fixtures/country-bundle-moz.json";
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as Record<
  string,
  unknown
>;
const bundle = parseCountryNarrativeBundle(fixture);
assert.ok(bundle, "the Python-generated CountryBundle should validate");
assert.equal(bundle.country, "MOZ");
assert.ok(bundle.sources.length > 0);
assert.ok(bundle.calculations.length > 0);

const scientific = structuredClone(bundle);
scientific.calculations[0].result = "1E+2";
assert.ok(parseCountryNarrativeBundle(scientific));

const cyclic = structuredClone(bundle);
cyclic.calculations[0].source_ids = [cyclic.calculations[0].id];
assert.equal(parseCountryNarrativeBundle(cyclic), null);
const duplicate = structuredClone(bundle);
duplicate.sources.push(duplicate.sources[0]);
assert.equal(parseCountryNarrativeBundle(duplicate), null);
const missingContributor = structuredClone(bundle);
assert.ok(missingContributor.overview);
missingContributor.overview.contributing_section_ids = ["missing"];
assert.equal(parseCountryNarrativeBundle(missingContributor), null);

const calculation = bundle.calculations[0];
const citations = expandNarrativeCitations(bundle, [calculation.id]);
assert.equal(citations.at(-1)?.id, calculation.id);
assert.deepEqual(
  citations
    .slice(0, calculation.source_ids.length)
    .map((citation) => citation.id),
  calculation.source_ids,
);

const malformedSources = { ...fixture, sources: { invalid: true } };
assert.equal(parseCountryNarrativeBundle(malformedSources), null);

const danglingClaim = JSON.parse(JSON.stringify(fixture)) as typeof fixture;
const sections = danglingClaim.sections as Array<Record<string, unknown>>;
const readySection = sections.find((section) => section.status === "ready");
assert.ok(readySection);
const claims = readySection.claims as Array<Record<string, unknown>>;
claims[0].evidence_ids = ["missing-evidence"];
assert.equal(parseCountryNarrativeBundle(danglingClaim), null);

const unsafeUrl = JSON.parse(JSON.stringify(fixture)) as typeof fixture;
const sources = unsafeUrl.sources as Array<Record<string, unknown>>;
sources[0].source_url = "https://user:password@example.org/private";
assert.equal(parseCountryNarrativeBundle(unsafeUrl), null);

const danglingCalculation = JSON.parse(
  JSON.stringify(fixture),
) as typeof fixture;
const calculations = danglingCalculation.calculations as Array<
  Record<string, unknown>
>;
(calculations[0].source_ids as string[])[0] = "missing-source";
assert.equal(parseCountryNarrativeBundle(danglingCalculation), null);

const malformedPeriod = JSON.parse(JSON.stringify(fixture)) as typeof fixture;
const malformedScope = (
  malformedPeriod.sources as Array<Record<string, unknown>>
)[0].scope as Record<string, unknown>;
malformedScope.periods = [null];
assert.equal(parseCountryNarrativeBundle(malformedPeriod), null);

const malformedLocator = JSON.parse(JSON.stringify(fixture)) as typeof fixture;
const locatorSource = (
  malformedLocator.sources as Array<Record<string, unknown>>
)[0];
locatorSource.source_url = null;
locatorSource.document_locator = { title: {}, location: "page 1" };
assert.equal(parseCountryNarrativeBundle(malformedLocator), null);

const emptyReadyClaims = JSON.parse(JSON.stringify(fixture)) as typeof fixture;
const emptyReadySection = (
  emptyReadyClaims.sections as Array<Record<string, unknown>>
).find((section) => section.status === "ready");
assert.ok(emptyReadySection);
emptyReadySection.claims = [];
assert.equal(parseCountryNarrativeBundle(emptyReadyClaims), null);

console.log(`Narrative contract checks passed for ${bundle.country}`);
