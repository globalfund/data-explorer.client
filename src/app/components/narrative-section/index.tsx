import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  CountryNarrativeBundle,
  NarrativeOverview,
  NarrativeSection as NarrativeSectionModel,
  expandNarrativeCitations,
} from "app/types/narratives";
import {
  CountryNarrativesState,
  useCountryNarratives,
} from "app/hooks/useCountryNarratives";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleDateString("en-GB");
};

const periodLabel = (
  bundle: CountryNarrativeBundle,
  section: NarrativeSectionModel | NarrativeOverview,
) => {
  const sourceIds = new Set<string>();
  const calculations = new Map(
    bundle.calculations.map((calculation) => [calculation.id, calculation]),
  );
  const visit = (id: string) => {
    if (sourceIds.has(id)) return;
    const calculation = calculations.get(id);
    if (calculation)
      calculation.source_ids.forEach((sourceId) => sourceIds.add(sourceId));
    else sourceIds.add(id);
  };
  section.claims.flatMap((claim) => claim.evidence_ids).forEach(visit);
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
  if (!activeSection || !activeBundle)
    return <CountryNarrativesNotice state={activeState} />;
  section = activeSection;
  bundle = activeBundle;
  if (section.status !== "ready")
    return <NarrativeUnavailable status={section.status} />;
  return (
    <Box
      component="section"
      aria-labelledby={`narrative-${section.id}`}
      sx={{ my: 3, p: 2, border: "1px solid #DFE3E5", borderRadius: 1 }}
      data-cy="narrative-section"
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
        {periodLabel(bundle, section)
          ? ` · Data periods: ${periodLabel(bundle, section)}`
          : ""}
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
          const citations = expandNarrativeCitations(
            bundle,
            claim.evidence_ids,
          );
          return (
            <Box
              component="p"
              key={`${section.id}-${index}`}
              sx={{ mt: 0, mb: 2 }}
            >
              <Typography component="span" variant="body1">
                {claim.text}
              </Typography>
              {citations.length > 0 && (
                <Box component="span" sx={{ ml: 1 }} aria-label="Sources">
                  {citations.map((citation, citationIndex) =>
                    citation.url ? (
                      <Link
                        key={citation.id}
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ mr: 0.5 }}
                        aria-label={`Source ${citationIndex + 1}: ${citation.label}`}
                      >
                        [{citationIndex + 1}] {citation.label}
                        {citation.location ? ` (${citation.location})` : ""}
                      </Link>
                    ) : (
                      <Typography
                        key={citation.id}
                        component="span"
                        variant="caption"
                        sx={{ mr: 0.5 }}
                        aria-label={`Source ${citationIndex + 1}: ${citation.label}`}
                      >
                        [{citationIndex + 1}] {citation.label}
                        {citation.location ? ` (${citation.location})` : ""}
                      </Typography>
                    ),
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export const NarrativeUnavailable: React.FC<{
  status: "insufficient_evidence" | "not_applicable";
}> = ({ status }) => (
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ my: 2 }}
    data-cy="narrative-unavailable"
  >
    {status === "insufficient_evidence"
      ? "Narrative unavailable because there is not enough supporting evidence."
      : "Narrative not applicable for this country."}
  </Typography>
);

export const CountryNarrativesNotice: React.FC<{
  state: CountryNarrativesState;
}> = ({ state }) => {
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
        ? "No saved narrative is available for this country."
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

export const NarrativePanel: React.FC<{
  state: CountryNarrativesState;
  sectionId?: string;
  overview?: boolean;
}> = ({ state, sectionId, overview = false }) => {
  if (state.status !== "success" || !state.bundle)
    return <CountryNarrativesNotice state={state} />;
  const section = overview
    ? state.bundle.overview
    : state.bundle.sections.find((item) => item.id === sectionId);
  if (!section) return null;
  return <NarrativeSection section={section} bundle={state.bundle} />;
};

export default NarrativeSection;
