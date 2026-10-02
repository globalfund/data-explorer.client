import assert from "node:assert/strict";
import fs from "node:fs";
import * as contracts from "../src/app/types/narratives";

assert.equal(
  typeof contracts.parsePageNarrativeBundle,
  "function",
  "v2 page parser must exist",
);
const fixture = JSON.parse(
  fs.readFileSync(
    "tests/fixtures/page-bundle-resource-mobilization.json",
    "utf8",
  ),
);
const ref = {
  page_type: "resource-mobilization",
  page_id: "global",
  locale: "en",
  scope_key: "default",
} as const;
const parse = contracts.parsePageNarrativeBundle;
const bundle = parse(fixture, ref);
assert.ok(
  bundle,
  "the actual B28 PageBundle serializer output validates without country or Overview",
);
assert.equal(bundle.summary, null);
assert.deepEqual(bundle.page, ref);
assert.ok(bundle.sources.length > 0);
assert.ok(
  bundle.sections[0].claims[0].evidence_ids.some((id) =>
    bundle.calculations.some((item) => item.id === id),
  ),
);
assert.equal(parse(fixture, { ...ref, scope_key: "filtered" }), null);
assert.equal(parse(fixture, { ...ref, page_id: "other" }), null);
assert.equal(parse(fixture, { ...ref, locale: "fr" }), null);
const rejects = (name: string, mutate: (value: typeof fixture) => void) => {
  const value = structuredClone(fixture);
  mutate(value);
  assert.equal(parse(value, ref), null, name);
};
rejects("missing v2", (value) => delete value.schema_version);
rejects("traversal identity", (value) => (value.page.page_id = "..global"));
rejects(
  "scope identity",
  (value) => (value.sources[0].scope.scope_key = "other"),
);
rejects(
  "presentation type",
  (value) => (value.presentation.page_type = "other"),
);
rejects(
  "unknown group",
  (value) => (value.presentation.sections[0].group = "unknown"),
);
rejects("duplicate groups", (value) =>
  value.presentation.groups.push(value.presentation.groups[0]),
);
rejects("unused group", (value) =>
  value.presentation.groups.push({ id: "unused", title: "Unused" }),
);
rejects("missing configured section", (value) => value.sections.pop());
rejects("section order", (value) => value.sections.reverse());
rejects("section title", (value) => (value.sections[0].title = "Unknown"));
rejects("section group", (value) => (value.sections[0].group = "unknown"));
for (const status of ["ready", "insufficient_evidence", "not_applicable"]) {
  rejects(`array section status ${status}`, (value) => {
    value.sections[0].status = [status];
    value.sections[0].claims = [];
  });
  const value = structuredClone(fixture);
  value.sections[0].status = status;
  if (status !== "ready") value.sections[0].claims = [];
  assert.ok(parse(value, ref), `string section status ${status}`);
}
rejects("ready section requires claims", (value) => {
  value.sections[0].status = "ready";
  value.sections[0].claims = [];
});
for (const malformed of [null, undefined, 123, true, {}]) {
  rejects(`non-string section status ${String(malformed)}`, (value) => {
    value.sections[0].status = malformed;
    value.sections[0].claims = [];
  });
  rejects(`non-string source kind ${String(malformed)}`, (value) => {
    value.sources[0].kind = malformed;
  });
  rejects(`non-string content hash ${String(malformed)}`, (value) => {
    value.sources[0].content_hash = malformed;
  });
}
for (const kind of [
  "structured_data",
  "document",
  "model_prediction",
  "external_context",
]) {
  rejects(`array source kind ${kind}`, (value) => {
    value.sources[0].kind = [kind];
  });
  const value = structuredClone(fixture);
  value.sources[0].kind = kind;
  assert.ok(parse(value, ref), `string source kind ${kind}`);
}
rejects("array content hash", (value) => {
  value.sources[0].content_hash = [value.sources[0].content_hash];
});
assert.ok(parse(fixture, ref), "string content hash remains valid");
rejects(
  "unconfigured heading",
  (value) => (value.sections[0].claims[0].heading = "Funding"),
);
rejects(
  "dangling claim",
  (value) => (value.sections[0].claims[0].evidence_ids = ["missing"]),
);
rejects("duplicate evidence", (value) => value.sources.push(value.sources[0]));
rejects(
  "calculation cycle",
  (value) => (value.calculations[0].source_ids = [value.calculations[0].id]),
);
rejects(
  "calculation scope",
  (value) => (value.calculations[0].scope.currency = "EUR"),
);
rejects("calculation unit", (value) => (value.calculations[0].unit = "other"));
rejects(
  "calculation period",
  (value) => (value.calculations[0].scope.periods = [{ label: "unknown" }]),
);
rejects(
  "malformed source date",
  (value) => (value.sources[0].scope.source_dates = ["2026-02-30"]),
);
rejects(
  "malformed period",
  (value) =>
    (value.sources[0].scope.periods = [
      { start: "2026-02-30", end: "2026-03-02" },
    ]),
);
rejects(
  "duplicate dimensions",
  (value) =>
    (value.sources[0].scope.dimensions = [
      { name: "metric", value: "A" },
      { name: "metric", value: "B" },
    ]),
);
rejects("nonfinite source", (value) => (value.sources[0].value = Infinity));
for (const url of [
  "javascript:alert(1)",
  "https://user:secret@example.org/private",
  "https://example.org\\evil",
  "https://example.org/ bad",
]) {
  rejects("unsafe Source URL", (value) => (value.sources[0].source_url = url));
}
const headed = structuredClone(fixture);
headed.presentation.sections[0].allowed_headings = ["Funding context"];
headed.sections[0].claims[0].heading = "Funding context";
assert.ok(
  parse(headed, ref),
  "headings come from presentation, without fixed country headings",
);
const summary = structuredClone(headed);
summary.presentation.summary = {
  id: "page.summary",
  title: "Saved synthesis",
  allowed_headings: ["Funding context"],
};
summary.summary = {
  id: "page.summary",
  title: "Saved synthesis",
  status: "ready",
  claims: [summary.sections[0].claims[0]],
  contributing_section_ids: [summary.sections[0].id],
};
assert.ok(parse(summary, ref), "optional configured summary is supported");
summary.summary.contributing_section_ids = ["missing"];
assert.equal(parse(summary, ref), null);
const noSummary = structuredClone(headed);
delete noSummary.summary;
delete noSummary.presentation.summary;
assert.ok(parse(noSummary, ref), "omitted optional summary is supported");
for (const calculation of bundle.calculations) {
  const citations = contracts.expandNarrativeCitations(bundle, [
    calculation.id,
    calculation.id,
  ]);
  assert.equal(citations.at(-1)?.id, calculation.id);
  assert.deepEqual(
    citations
      .filter((item) => item.kind !== "calculation")
      .map((item) => item.id),
    calculation.source_ids,
  );
  assert.ok(citations.some((item) => item.url?.startsWith("https://")));
  assert.equal(
    new Set(citations.map((item) => item.id)).size,
    citations.length,
  );
}

rejects(
  "null dimensions are not an array",
  (value) => (value.sources[0].scope.dimensions = null),
);
rejects(
  "null allowed headings are not an array",
  (value) => (value.presentation.sections[0].allowed_headings = null),
);
rejects(
  "null summary headings are not an array",
  (value) =>
    (value.presentation.summary = {
      id: "page.summary",
      title: "Summary",
      allowed_headings: null,
    }),
);

rejects("heading must be text", (value) => {
  value.presentation.sections[0].allowed_headings = ["123"];
  value.sections[0].claims[0].heading = 123;
});
rejects(
  "source URL requires an explicit HTTP scheme",
  (value) => (value.sources[0].source_url = "https:example.org"),
);

console.log(
  `Page narrative contract checks passed for ${bundle.page.page_type}/${bundle.page.page_id}`,
);
