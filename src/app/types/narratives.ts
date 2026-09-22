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

export interface NarrativeEvidence {
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
  scope: NarrativeScope;
}

export interface NarrativeCalculation {
  id: string;
  source_ids: string[];
  formula: string;
  result: number | string;
  unit: string;
  scope: NarrativeScope;
}

export interface NarrativeClaim {
  text: string;
  evidence_ids: string[];
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
  if (!isString(value)) return false;
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
  bundle: CountryNarrativeBundle,
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
