export type NarrativeTab =
  | "overview"
  | "resource-mobilization"
  | "access-to-funding"
  | "financial-insights"
  | "results";

export type NarrativeSectionStatus =
  | "ready"
  | "insufficient_evidence"
  | "not_applicable";

export interface NarrativePeriod {
  label?: string | null;
  start?: string | null;
  end?: string | null;
}

export interface NarrativeScope {
  country: string;
  periods: NarrativePeriod[];
  unit?: string | null;
  currency?: string | null;
  source_dates: string[];
}

export interface NarrativeDocumentLocator {
  title: string;
  location: string;
}

export interface NarrativeEvidence<Scope = NarrativeScope> {
  id: string;
  kind:
    | "structured_data"
    | "document"
    | "model_prediction"
    | "external_context";
  source_url?: string | null;
  document_locator?: NarrativeDocumentLocator | null;
  content_hash: string;
  retrieved_at: string;
  value?: boolean | number | string | null;
  excerpt?: string | null;
  scope: Scope;
}

export interface NarrativeCalculation<Scope = NarrativeScope> {
  id: string;
  source_ids: string[];
  formula: string;
  result: number | string;
  unit: string;
  scope: Scope;
}

export interface NarrativeClaim {
  text: string;
  evidence_ids: string[];
  heading?: string | null;
}

export interface NarrativeSection {
  id: string;
  tab: Exclude<NarrativeTab, "overview">;
  title: string;
  status: NarrativeSectionStatus;
  claims: NarrativeClaim[];
}

export interface NarrativeOverview {
  id: string;
  tab: "overview";
  title: string;
  status: "ready";
  claims: NarrativeClaim[];
  contributing_section_ids: string[];
}

export interface NarrativeMetadata {
  snapshot_id: string;
  revision_id: string;
  model: string;
  prompt_version: string;
  style_version: string;
  generated_at: string;
}

export interface CountryNarrativeBundle {
  country: string;
  locale: "en";
  metadata: NarrativeMetadata;
  sources: NarrativeEvidence[];
  calculations: NarrativeCalculation[];
  sections: NarrativeSection[];
  overview?: NarrativeOverview | null;
}

export interface NarrativeCitation {
  id: string;
  label: string;
  url?: string;
  location?: string;
  kind: NarrativeEvidence["kind"] | "calculation";
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

const isSafeUrl = (value: unknown): value is string => {
  if (
    !isString(value) ||
    !/^https?:\/\//.test(value) ||
    [...value].some(
      (character) =>
        character === "\\" ||
        /\s/.test(character) ||
        character.charCodeAt(0) < 32 ||
        character.charCodeAt(0) === 127,
    )
  )
    return false;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

const isPeriod = (value: unknown): value is NarrativePeriod => {
  if (!isRecord(value)) return false;
  const hasLabel = value.label !== null && value.label !== undefined;
  const hasStart = isString(value.start);
  const hasEnd = isString(value.end);
  if (hasLabel && !isNonEmptyString(value.label)) return false;
  if (value.start !== null && value.start !== undefined && !hasStart)
    return false;
  if (value.end !== null && value.end !== undefined && !hasEnd) return false;
  return isNonEmptyString(value.label) || (hasStart && hasEnd);
};

const isScope = (value: unknown, country: string): value is NarrativeScope => {
  if (
    !isRecord(value) ||
    value.country !== country ||
    !isArray(value.periods) ||
    value.periods.length === 0 ||
    !value.periods.every(isPeriod) ||
    !isArray(value.source_dates) ||
    !value.source_dates.every(isString)
  )
    return false;
  if (value.unit !== null && value.unit !== undefined && !isString(value.unit))
    return false;
  return (
    value.currency === null ||
    value.currency === undefined ||
    /^[A-Z]{3}$/.test(String(value.currency))
  );
};

const isClaim = (value: unknown): value is NarrativeClaim => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.text) &&
    (value.heading === undefined ||
      value.heading === null ||
      [
        "Introduction",
        "Progress",
        "Challenges",
        "Global Fund investments",
      ].includes(value.heading as string)) &&
    isArray(value.evidence_ids) &&
    value.evidence_ids.length > 0 &&
    value.evidence_ids.every(isNonEmptyString)
  );
};

const isSection = (value: unknown): value is NarrativeSection => {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.tab) ||
    !isNonEmptyString(value.title)
  )
    return false;
  if (
    !isString(value.status) ||
    ![
      "resource-mobilization",
      "access-to-funding",
      "financial-insights",
      "results",
    ].includes(value.tab) ||
    !["ready", "insufficient_evidence", "not_applicable"].includes(value.status)
  )
    return false;
  if (!isArray(value.claims) || !value.claims.every(isClaim)) return false;
  return value.status === "ready"
    ? value.claims.length > 0
    : value.claims.length === 0;
};

const isEvidence = (
  value: unknown,
  country: string,
): value is NarrativeEvidence => {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.kind) ||
    !isString(value.content_hash)
  )
    return false;
  if (
    ![
      "structured_data",
      "document",
      "model_prediction",
      "external_context",
    ].includes(value.kind)
  )
    return false;
  if (!isString(value.retrieved_at) || !isScope(value.scope, country))
    return false;
  if (
    value.source_url !== null &&
    value.source_url !== undefined &&
    !isSafeUrl(value.source_url)
  )
    return false;
  if (
    value.document_locator !== null &&
    value.document_locator !== undefined &&
    (!isRecord(value.document_locator) ||
      !isNonEmptyString(value.document_locator.title) ||
      !isNonEmptyString(value.document_locator.location))
  )
    return false;
  return (
    Boolean(value.source_url || value.document_locator) &&
    Boolean(
      (value.value !== undefined && value.value !== null) || value.excerpt,
    )
  );
};

const isCalculation = (
  value: unknown,
  country: string,
): value is NarrativeCalculation => {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.formula) ||
    !isString(value.unit)
  )
    return false;
  return (
    isArray(value.source_ids) &&
    value.source_ids.length > 0 &&
    value.source_ids.every(isNonEmptyString) &&
    ((typeof value.result === "number" && Number.isFinite(value.result)) ||
      (isString(value.result) &&
        value.result.trim() !== "" &&
        Number.isFinite(Number(value.result)))) &&
    isScope(value.scope, country)
  );
};

export function parseCountryNarrativeBundle(
  value: unknown,
): CountryNarrativeBundle | null {
  if (
    !isRecord(value) ||
    !/^[A-Z]{3}$/.test(String(value.country)) ||
    value.locale !== "en"
  )
    return null;
  const country = String(value.country);
  const metadata = value.metadata;
  if (
    !isRecord(metadata) ||
    !isString(metadata.snapshot_id) ||
    !isString(metadata.revision_id) ||
    !isString(metadata.model) ||
    !isString(metadata.prompt_version) ||
    !isString(metadata.style_version) ||
    !isString(metadata.generated_at)
  )
    return null;
  if (
    !isArray(value.sources) ||
    !value.sources.every((item) => isEvidence(item, country))
  )
    return null;
  if (
    !isArray(value.calculations) ||
    !value.calculations.every((item) => isCalculation(item, country))
  )
    return null;
  if (!isArray(value.sections) || !value.sections.every(isSection)) return null;
  const overview = value.overview;
  if (overview !== null && overview !== undefined) {
    if (
      !isRecord(overview) ||
      overview.tab !== "overview" ||
      !isString(overview.id) ||
      !isNonEmptyString(overview.title) ||
      overview.status !== "ready" ||
      !isArray(overview.claims) ||
      overview.claims.length === 0 ||
      !overview.claims.every(isClaim) ||
      !isArray(overview.contributing_section_ids) ||
      !overview.contributing_section_ids.every(isString)
    )
      return null;
  }
  const sourceIds = new Set(
    value.sources.map((item) => (item as NarrativeEvidence).id),
  );
  const calculationIds = new Set(
    value.calculations.map((item) => (item as NarrativeCalculation).id),
  );
  const sectionIds = new Set(value.sections.map((section) => section.id));
  if (
    sourceIds.size !== value.sources.length ||
    calculationIds.size !== value.calculations.length ||
    sectionIds.size !== value.sections.length ||
    [...sourceIds].some((id) => calculationIds.has(id))
  )
    return null;
  const referenceIds = new Set([...sourceIds, ...calculationIds]);
  const allClaims = [
    ...value.sections,
    ...(overview ? [overview] : []),
  ].flatMap((item) => (item as NarrativeSection | NarrativeOverview).claims);
  if (
    allClaims.some((claim) =>
      claim.evidence_ids.some((id) => !referenceIds.has(id)),
    )
  )
    return null;
  if (
    value.calculations.some((calculation) =>
      calculation.source_ids.some((id) => !sourceIds.has(id)),
    )
  )
    return null;
  if (overview) {
    const summary = overview as unknown as NarrativeOverview;
    const contributors = value.sections.filter((section) =>
      summary.contributing_section_ids.includes(section.id),
    );
    const citedIds = new Set(
      contributors.flatMap((section) =>
        section.claims.flatMap((claim) => claim.evidence_ids),
      ),
    );
    if (
      sectionIds.has(summary.id) ||
      summary.contributing_section_ids.length === 0 ||
      new Set(summary.contributing_section_ids).size !==
        summary.contributing_section_ids.length ||
      contributors.length !== summary.contributing_section_ids.length ||
      contributors.some((section) => section.status !== "ready") ||
      summary.claims.some((claim) =>
        claim.evidence_ids.some((id) => !citedIds.has(id)),
      )
    )
      return null;
  }
  return value as unknown as CountryNarrativeBundle;
}

export function expandNarrativeCitations(
  bundle: SavedNarrativeBundle,
  ids: string[],
): NarrativeCitation[] {
  const sources = new Map(bundle.sources.map((source) => [source.id, source]));
  const calculations = new Map(
    bundle.calculations.map((calculation) => [calculation.id, calculation]),
  );
  const seen = new Set<string>();
  const result: NarrativeCitation[] = [];
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const source = sources.get(id);
    if (source) {
      const sourceUrl = source.source_url;
      if (sourceUrl && isSafeUrl(sourceUrl))
        result.push({
          id,
          label: source.document_locator?.title || new URL(sourceUrl).hostname,
          url: sourceUrl,
          location: source.document_locator?.location,
          kind: source.kind,
        });
      else
        result.push({
          id,
          label: source.document_locator?.title || "Supporting evidence",
          location: source.document_locator?.location,
          kind: source.kind,
        });
      return;
    }
    const calculation = calculations.get(id);
    if (calculation) {
      calculation.source_ids.forEach(visit);
      result.push({
        id,
        label: `Calculation: ${calculation.formula}`,
        kind: "calculation",
      });
    }
  };
  ids.forEach(visit);
  return result;
}

export interface PageNarrativeRef {
  page_type: string;
  page_id: string;
  locale: "en";
  scope_key: string;
}

export interface PageNarrativeScope extends Omit<PageNarrativeRef, "locale"> {
  periods: NarrativePeriod[];
  unit?: string | null;
  currency?: string | null;
  source_dates: string[];
  dimensions?: { name: string; value: string }[];
}

export interface PageSectionPresentation {
  id: string;
  group: string;
  title: string;
  allowed_headings?: string[];
}

export interface PageSummaryPresentation {
  id: string;
  title: string;
  allowed_headings?: string[];
}

export interface PageNarrativeSection {
  id: string;
  group: string;
  title: string;
  status: NarrativeSectionStatus;
  claims: NarrativeClaim[];
}

export interface PageNarrativeSummary {
  id: string;
  title: string;
  status: "ready";
  claims: NarrativeClaim[];
  contributing_section_ids: string[];
}

export interface PageNarrativeBundle {
  schema_version: 2;
  page: PageNarrativeRef;
  metadata: NarrativeMetadata & { profile_fingerprint: string };
  presentation: {
    page_type: string;
    groups: { id: string; title: string }[];
    sections: PageSectionPresentation[];
    summary?: PageSummaryPresentation | null;
  };
  sources: NarrativeEvidence<PageNarrativeScope>[];
  calculations: NarrativeCalculation<PageNarrativeScope>[];
  sections: PageNarrativeSection[];
  summary?: PageNarrativeSummary | null;
}

export type SavedNarrativeBundle = CountryNarrativeBundle | PageNarrativeBundle;
export type SavedNarrativeSection =
  | NarrativeSection
  | NarrativeOverview
  | PageNarrativeSection
  | PageNarrativeSummary;

const identifier = (value: unknown): value is string =>
  isString(value) && /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value);
const unique = (values: unknown[]) => new Set(values).size === values.length;
const onlyKeys = (value: Record<string, unknown>, keys: string[]) =>
  Object.keys(value).every((key) => keys.includes(key));
const numeric = (value: unknown) =>
  typeof value === "number"
    ? Number.isFinite(value)
    : isString(value) &&
      /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value);
const calendarDate = (value: unknown): value is string => {
  if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};
const datetime = (value: unknown) =>
  isString(value) &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/.test(
    value,
  );
const version = (value: unknown) =>
  isString(value) && /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/.test(value);
const periodIdentity = (period: NarrativePeriod) =>
  JSON.stringify([
    period.label ?? null,
    period.start ?? null,
    period.end ?? null,
  ]);

export function isPageNarrativeRef(value: unknown): value is PageNarrativeRef {
  return (
    isRecord(value) &&
    onlyKeys(value, ["page_type", "page_id", "locale", "scope_key"]) &&
    identifier(value.page_type) &&
    isString(value.page_id) &&
    /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value.page_id) &&
    !value.page_id.includes("..") &&
    value.locale === "en" &&
    identifier(value.scope_key)
  );
}

export const pageNarrativeKey = (ref: PageNarrativeRef) =>
  JSON.stringify([ref.page_type, ref.page_id, ref.locale, ref.scope_key]);

function isPageScope(
  value: unknown,
  ref: PageNarrativeRef,
): value is PageNarrativeScope {
  if (
    !isRecord(value) ||
    !onlyKeys(value, [
      "page_type",
      "page_id",
      "scope_key",
      "periods",
      "unit",
      "currency",
      "source_dates",
      "dimensions",
    ]) ||
    value.page_type !== ref.page_type ||
    value.page_id !== ref.page_id ||
    value.scope_key !== ref.scope_key ||
    !isArray(value.periods) ||
    !value.periods.length ||
    !value.periods.every((period) => {
      if (
        !isRecord(period) ||
        !onlyKeys(period, ["label", "start", "end"]) ||
        !isPeriod(period)
      )
        return false;
      if ((period.start == null) !== (period.end == null)) return false;
      return (
        period.start == null ||
        (calendarDate(period.start) &&
          calendarDate(period.end) &&
          period.start <= period.end)
      );
    }) ||
    !unique(
      value.periods.map((period) => periodIdentity(period as NarrativePeriod)),
    ) ||
    !isArray(value.source_dates) ||
    !value.source_dates.every(calendarDate) ||
    !unique(value.source_dates) ||
    (value.unit != null && !isNonEmptyString(value.unit)) ||
    (value.currency != null &&
      (!isString(value.currency) || !/^[A-Z]{3}$/.test(value.currency)))
  )
    return false;
  const dimensions = value.dimensions === undefined ? [] : value.dimensions;
  return (
    isArray(dimensions) &&
    dimensions.every(
      (item) =>
        isRecord(item) &&
        onlyKeys(item, ["name", "value"]) &&
        identifier(item.name) &&
        isNonEmptyString(item.value),
    ) &&
    unique(dimensions.map((item) => (item as Record<string, unknown>).name))
  );
}

function isPageEvidence(
  value: unknown,
  ref: PageNarrativeRef,
): value is NarrativeEvidence<PageNarrativeScope> {
  return (
    isRecord(value) &&
    onlyKeys(value, [
      "id",
      "kind",
      "source_url",
      "document_locator",
      "content_hash",
      "retrieved_at",
      "value",
      "excerpt",
      "scope",
    ]) &&
    identifier(value.id) &&
    isString(value.kind) &&
    [
      "structured_data",
      "document",
      "model_prediction",
      "external_context",
    ].includes(value.kind) &&
    (value.source_url == null || isSafeUrl(value.source_url)) &&
    (value.document_locator == null ||
      (isRecord(value.document_locator) &&
        onlyKeys(value.document_locator, ["title", "location"]) &&
        isNonEmptyString(value.document_locator.title) &&
        isNonEmptyString(value.document_locator.location))) &&
    Boolean(value.source_url || value.document_locator) &&
    (value.value != null || value.excerpt != null) &&
    (value.value == null ||
      typeof value.value === "boolean" ||
      isNonEmptyString(value.value) ||
      (typeof value.value === "number" && Number.isFinite(value.value))) &&
    (value.excerpt == null || isNonEmptyString(value.excerpt)) &&
    isString(value.content_hash) &&
    /^[a-f0-9]{64}$/.test(value.content_hash) &&
    datetime(value.retrieved_at) &&
    isPageScope(value.scope, ref)
  );
}

function isPageCalculation(
  value: unknown,
  ref: PageNarrativeRef,
  sources: NarrativeEvidence<PageNarrativeScope>[],
): value is NarrativeCalculation<PageNarrativeScope> {
  if (
    !isRecord(value) ||
    !onlyKeys(value, [
      "id",
      "source_ids",
      "formula",
      "result",
      "unit",
      "scope",
    ]) ||
    !identifier(value.id) ||
    !isArray(value.source_ids) ||
    !value.source_ids.length ||
    !value.source_ids.every(identifier) ||
    !unique(value.source_ids) ||
    !isNonEmptyString(value.formula) ||
    !numeric(value.result) ||
    !isNonEmptyString(value.unit) ||
    !isPageScope(value.scope, ref) ||
    value.scope.unit !== value.unit
  )
    return false;
  const scope = value.scope;
  const operands = value.source_ids.map((id) =>
    sources.find((source) => source.id === id),
  );
  if (
    !operands.every(
      (source) =>
        source &&
        numeric(source.value) &&
        source.scope.currency === scope.currency &&
        source.scope.unit === operands[0]?.scope.unit,
    )
  )
    return false;
  const periods = new Set(
    operands.flatMap((source) => source!.scope.periods.map(periodIdentity)),
  );
  return (
    periods.size === scope.periods.length &&
    scope.periods.every((period) => periods.has(periodIdentity(period)))
  );
}

const isHeadings = (value: unknown): value is string[] =>
  isArray(value) && value.every(isNonEmptyString) && unique(value);
const isPresentationEntry = (
  value: unknown,
  keys: string[],
): value is Record<string, unknown> =>
  isRecord(value) &&
  onlyKeys(value, keys) &&
  identifier(value.id) &&
  isNonEmptyString(value.title);
const references = (section: SavedNarrativeSection) =>
  section.claims.flatMap((claim) => claim.evidence_ids);

function isPageSection(
  value: unknown,
  configured: PageSectionPresentation | PageSummaryPresentation,
  summary = false,
): value is PageNarrativeSection | PageNarrativeSummary {
  return (
    isRecord(value) &&
    onlyKeys(
      value,
      summary
        ? ["id", "title", "status", "claims", "contributing_section_ids"]
        : ["id", "group", "title", "status", "claims"],
    ) &&
    value.id === configured.id &&
    value.title === configured.title &&
    (summary ||
      value.group === (configured as PageSectionPresentation).group) &&
    isString(value.status) &&
    ["ready", "insufficient_evidence", "not_applicable"].includes(
      value.status,
    ) &&
    (!summary || value.status === "ready") &&
    isArray(value.claims) &&
    (value.status === "ready"
      ? value.claims.length > 0
      : value.claims.length === 0) &&
    value.claims.every(
      (claim) =>
        isRecord(claim) &&
        onlyKeys(claim, ["text", "evidence_ids", "heading"]) &&
        isNonEmptyString(claim.text) &&
        (claim.heading == null ||
          (isString(claim.heading) &&
            (configured.allowed_headings ?? []).includes(claim.heading))) &&
        isArray(claim.evidence_ids) &&
        claim.evidence_ids.length > 0 &&
        claim.evidence_ids.every(identifier) &&
        unique(claim.evidence_ids),
    )
  );
}

export function parsePageNarrativeBundle(
  value: unknown,
  expected?: PageNarrativeRef,
): PageNarrativeBundle | null {
  if (
    !isRecord(value) ||
    !onlyKeys(value, [
      "schema_version",
      "page",
      "metadata",
      "presentation",
      "sources",
      "calculations",
      "sections",
      "summary",
    ]) ||
    value.schema_version !== 2 ||
    !isPageNarrativeRef(value.page)
  )
    return null;
  const ref = value.page;
  if (
    expected &&
    (!isPageNarrativeRef(expected) ||
      pageNarrativeKey(ref) !== pageNarrativeKey(expected))
  )
    return null;
  const metadata = value.metadata;
  if (
    !isRecord(metadata) ||
    !onlyKeys(metadata, [
      "snapshot_id",
      "revision_id",
      "model",
      "prompt_version",
      "style_version",
      "generated_at",
      "profile_fingerprint",
    ]) ||
    ![
      metadata.snapshot_id,
      metadata.revision_id,
      metadata.model,
      metadata.prompt_version,
      metadata.style_version,
      metadata.profile_fingerprint,
    ].every(version) ||
    !datetime(metadata.generated_at)
  )
    return null;
  const presentation = value.presentation;
  if (
    !isRecord(presentation) ||
    !onlyKeys(presentation, ["page_type", "groups", "sections", "summary"]) ||
    presentation.page_type !== ref.page_type ||
    !isArray(presentation.groups) ||
    !presentation.groups.length ||
    !presentation.groups.every((item) =>
      isPresentationEntry(item, ["id", "title"]),
    ) ||
    !isArray(presentation.sections) ||
    !presentation.sections.length ||
    !presentation.sections.every(
      (item) =>
        isPresentationEntry(item, [
          "id",
          "group",
          "title",
          "allowed_headings",
        ]) &&
        identifier(item.group) &&
        isHeadings(
          item.allowed_headings === undefined ? [] : item.allowed_headings,
        ),
    )
  )
    return null;
  const configured =
    presentation.sections as unknown as PageSectionPresentation[];
  const groupIds = new Set(
    presentation.groups.map((item) => (item as Record<string, unknown>).id),
  );
  const sectionIds = new Set(configured.map((item) => item.id));
  const usedGroups = new Set(configured.map((item) => item.group));
  if (
    groupIds.size !== presentation.groups.length ||
    sectionIds.size !== configured.length ||
    usedGroups.size !== groupIds.size ||
    [...usedGroups].some((id) => !groupIds.has(id))
  )
    return null;
  const summaryConfig = presentation.summary;
  if (
    summaryConfig != null &&
    (!isPresentationEntry(summaryConfig, ["id", "title", "allowed_headings"]) ||
      !isHeadings(
        summaryConfig.allowed_headings === undefined
          ? []
          : summaryConfig.allowed_headings,
      ) ||
      sectionIds.has(String(summaryConfig.id)))
  )
    return null;
  if (
    !isArray(value.sources) ||
    !value.sources.every((item) => isPageEvidence(item, ref)) ||
    !isArray(value.calculations) ||
    !value.calculations.every((item) =>
      isPageCalculation(
        item,
        ref,
        value.sources as NarrativeEvidence<PageNarrativeScope>[],
      ),
    ) ||
    !isArray(value.sections)
  )
    return null;
  const sources = value.sources as NarrativeEvidence<PageNarrativeScope>[];
  const calculations =
    value.calculations as NarrativeCalculation<PageNarrativeScope>[];
  const sourceIds = new Set(sources.map((item) => item.id));
  const calculationIds = new Set(calculations.map((item) => item.id));
  const evidenceIds = new Set([...sourceIds, ...calculationIds]);
  if (
    sourceIds.size !== sources.length ||
    calculationIds.size !== calculations.length ||
    [...sourceIds].some((id) => calculationIds.has(id)) ||
    value.sections.length !== configured.length ||
    !value.sections.every(
      (item, index) =>
        isPageSection(item, configured[index]) &&
        references(item).every((id) => evidenceIds.has(id)),
    )
  )
    return null;
  if (value.summary != null) {
    if (
      !summaryConfig ||
      !isPageSection(
        value.summary,
        summaryConfig as unknown as PageSummaryPresentation,
        true,
      )
    )
      return null;
    const summary = value.summary as PageNarrativeSummary;
    if (
      !isArray(summary.contributing_section_ids) ||
      !summary.contributing_section_ids.length ||
      !summary.contributing_section_ids.every(identifier) ||
      !unique(summary.contributing_section_ids)
    )
      return null;
    const contributors = summary.contributing_section_ids.map((id) =>
      (value.sections as PageNarrativeSection[]).find(
        (section) => section.id === id,
      ),
    );
    if (!contributors.every((item) => item?.status === "ready")) return null;
    const contributingEvidence = new Set(
      contributors.flatMap((item) => references(item!)),
    );
    if (
      !references(summary).every(
        (id) => evidenceIds.has(id) && contributingEvidence.has(id),
      )
    )
      return null;
  }
  return value as unknown as PageNarrativeBundle;
}
