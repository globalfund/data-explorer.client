import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  CountryNarrativeBundle,
  NarrativeOverview,
  NarrativeSection as NarrativeSectionModel,
  SavedNarrativeBundle,
  SavedNarrativeSection,
  expandNarrativeCitations,
} from "app/types/narratives";
import {
  CountryNarrativesState,
  useCountryNarratives,
} from "app/hooks/useCountryNarratives";
import {
  NarrativesState,
  usePageNarratives,
} from "app/hooks/usePageNarratives";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleDateString("en-GB");
};

const periodLabel = (
  bundle: SavedNarrativeBundle,
  section: SavedNarrativeSection,
) => {
  const sourceIds = new Set(
    expandNarrativeCitations(
      bundle,
      section.claims.flatMap((claim) => claim.evidence_ids),
    )
      .filter((citation) => citation.kind !== "calculation")
      .map((citation) => citation.id),
  );
  const periods = bundle.sources
    .filter((source) => sourceIds.has(source.id))
    .flatMap((source) =>
      source.scope.periods.map(
        (period) =>
          period.label ||
          [period.start, period.end].filter(Boolean).join(" to "),
      ),
    )
    .filter(Boolean);
  return Array.from(new Set(periods)).join(", ");
};

const SavedNarrativeText: React.FC<{
  bundle: SavedNarrativeBundle;
  section: SavedNarrativeSection;
  defaultViewNotice: string;
}> = ({ bundle, section, defaultViewNotice }) => {
  if (section.status !== "ready")
    return (
      <NarrativeUnavailable
        status={section.status}
        country={"country" in bundle}
      />
    );
  const configured =
    "presentation" in bundle
      ? bundle.presentation.sections.find((item) => item.id === section.id) ||
        bundle.presentation.summary
      : null;
  const periods = periodLabel(bundle, section);
  const citedIds = new Set(
    expandNarrativeCitations(
      bundle,
      section.claims.flatMap((claim) => claim.evidence_ids),
    ).map((citation) => citation.id),
  );
  const units =
    "presentation" in bundle
      ? Array.from(
          new Set(
            [...bundle.sources, ...bundle.calculations]
              .filter((item) => citedIds.has(item.id))
              .map((item) => item.scope.unit)
              .filter(Boolean),
          ),
        ).join(", ")
      : "";
  let previousHeading: string | null = null;
  return (
    <Box
      component="section"
      aria-labelledby={`narrative-${section.id}`}
      sx={{ my: 3, p: 2, border: "1px solid #DFE3E5", borderRadius: 1 }}
      data-cy="narrative-section"
      data-narrative-id={section.id}
      data-narrative-group={"group" in section ? section.group : undefined}
    >
      <Typography
        id={`narrative-${section.id}`}
        variant="h5"
        component="h2"
        gutterBottom
      >
        {section.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {defaultViewNotice}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 2 }}
      >
        Generated {formatDate(bundle.metadata.generated_at)}
        {periods ? ` · Data periods: ${periods}` : ""}
        {units ? ` · Units: ${units}` : ""}
      </Typography>
      {"contributing_section_ids" in section && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Available topics:{" "}
          {section.contributing_section_ids
            .map(
              (id) =>
                bundle.sections.find((candidate) => candidate.id === id)
                  ?.title || id,
            )
            .join(", ")}
        </Typography>
      )}
      <Box>
        {section.claims.map((claim, index) => {
          const heading = claim.heading || null;
          const showHeading =
            heading !== null &&
            heading !== previousHeading &&
            (configured
              ? (configured.allowed_headings ?? []).includes(heading)
              : "tab" in section && section.tab === "overview");
          previousHeading = heading;
          const citations = expandNarrativeCitations(
            bundle,
            claim.evidence_ids,
          ).filter((citation) => Boolean(citation.url));
          return (
            <React.Fragment key={`${section.id}-${index}`}>
              {showHeading && (
                <Typography
                  component="h3"
                  variant="h6"
                  gutterBottom
                  data-cy="narrative-heading"
                >
                  {heading}
                </Typography>
              )}
              <Box
                component="div"
                sx={{ mt: 0, mb: 2 }}
                data-cy="narrative-claim"
              >
                <Typography component="p" variant="body1" sx={{ m: 0 }}>
                  {claim.text}
                </Typography>
                {citations.length > 0 && (
                  <Box
                    component="div"
                    sx={{ mt: 0.5 }}
                    aria-label="Sources"
                    data-cy="narrative-sources"
                  >
                    {citations.map((citation, citationIndex) => {
                      const details = [citation.label, citation.location]
                        .filter(Boolean)
                        .join(" - ");
                      return (
                        <Link
                          key={citation.id}
                          href={citation.url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{ mr: 1 }}
                          title={details}
                          aria-label={`Source ${citationIndex + 1}: ${details}`}
                        >
                          Source {citationIndex + 1}
                        </Link>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export interface SavedNarrativeSectionViewProps {
  bundle: SavedNarrativeBundle;
  sectionId: string;
  scopeMatches: boolean;
  defaultViewNotice?: string;
}

export const SavedNarrativeSectionView: React.FC<
  SavedNarrativeSectionViewProps
> = ({
  bundle,
  sectionId,
  scopeMatches,
  defaultViewNotice = "This saved narrative describes the default global view.",
}) => {
  if (!scopeMatches) return null;
  const summary = "presentation" in bundle ? bundle.summary : bundle.overview;
  const section =
    bundle.sections.find((item) => item.id === sectionId) ||
    (summary?.id === sectionId ? summary : null);
  return section ? (
    <SavedNarrativeText
      section={section}
      bundle={bundle}
      defaultViewNotice={defaultViewNotice}
    />
  ) : null;
};

export const PageNarrativePanel: React.FC<{
  sectionId: string;
  scopeMatches: boolean;
}> = ({ sectionId, scopeMatches }) => {
  const state = usePageNarratives();
  if (!scopeMatches) return null;
  return state.status === "success" ? (
    <SavedNarrativeSectionView
      bundle={state.bundle}
      sectionId={sectionId}
      scopeMatches={scopeMatches}
    />
  ) : (
    <NarrativesNotice state={state} />
  );
};

export interface NarrativeSectionProps {
  section?: NarrativeSectionModel | NarrativeOverview;
  bundle?: CountryNarrativeBundle;
  sectionId?: string;
  overview?: boolean;
  state?: CountryNarrativesState;
  defaultViewNotice?: string;
}

export const NarrativeSection: React.FC<NarrativeSectionProps> = ({
  section,
  bundle,
  sectionId,
  overview = false,
  state,
  defaultViewNotice = "This saved narrative describes the country's default view.",
}) => {
  const contextState = useCountryNarratives();
  const activeState = state || contextState;
  const activeBundle =
    bundle || (activeState.status === "success" ? activeState.bundle : null);
  const activeSection =
    section ||
    (activeBundle
      ? overview
        ? activeBundle.overview
        : activeBundle.sections.find((item) => item.id === sectionId)
      : null);
  return activeSection && activeBundle ? (
    <SavedNarrativeText
      section={activeSection}
      bundle={activeBundle}
      defaultViewNotice={defaultViewNotice}
    />
  ) : (
    <CountryNarrativesNotice state={activeState} />
  );
};

export const NarrativeUnavailable: React.FC<{
  status: "insufficient_evidence" | "not_applicable";
  country?: boolean;
}> = ({ status, country = true }) => (
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ my: 2 }}
    data-cy="narrative-unavailable"
  >
    {status === "insufficient_evidence"
      ? "Narrative unavailable because there is not enough supporting evidence."
      : `Narrative not applicable for this ${country ? "country" : "page"}.`}
  </Typography>
);

export const NarrativesNotice: React.FC<{
  state: NarrativesState;
  country?: boolean;
}> = ({ state, country = false }) => {
  if (
    state.status === "disabled" ||
    state.status === "idle" ||
    state.status === "success"
  )
    return null;
  const message =
    state.status === "loading"
      ? "Loading saved narrative…"
      : state.status === "not_found"
        ? `No saved narrative is available for this ${country ? "country" : "page"}.`
        : state.error;
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ my: 2 }}
      role={state.status === "error" ? "status" : undefined}
      data-cy={`narrative-${state.status}`}
    >
      {message}
    </Typography>
  );
};

export const CountryNarrativesNotice: React.FC<{
  state: CountryNarrativesState;
}> = ({ state }) => <NarrativesNotice state={state} country />;

export const NarrativePanel: React.FC<{
  state: CountryNarrativesState;
  sectionId?: string;
  overview?: boolean;
}> = ({ state, sectionId, overview = false }) => {
  if (state.status !== "success")
    return <CountryNarrativesNotice state={state} />;
  const section = overview
    ? state.bundle.overview
    : state.bundle.sections.find((item) => item.id === sectionId);
  return section ? (
    <SavedNarrativeText
      section={section}
      bundle={state.bundle}
      defaultViewNotice="This saved narrative describes the country's default view."
    />
  ) : null;
};

export default NarrativeSection;
