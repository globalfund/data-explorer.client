import React from "react";
import { useCMSData } from "app/hooks/useCMSData";
import { useStoreState } from "app/state/store/hooks";
import { getIcon } from "app/components/search/icons";
import LinearProgress from "@mui/material/LinearProgress";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { SearchResultModel } from "app/components/search/components/results/data";
import {
  ResultA,
  Results,
  NoResults,
  Container,
  ResultLink,
} from "app/components/search/components/results/styles";

interface SearchResultsProps {
  loading: boolean;
  withCatMenu?: boolean;
  anchor: "left" | "right";
  results: SearchResultModel[];
}

export function SearchResults(props: SearchResultsProps) {
  const cmsData = useCMSData({ returnData: true });
  const hasLoaded = useStoreState((state) => state.GlobalSearch.success);

  return (
    <Container
      id="search-results-container"
      data-cy="search-results-container"
      theme={{ anchor: props.anchor, withCatMenu: props.withCatMenu }}
    >
      {props.loading && (
        <LinearProgress
          id="search-results-progress"
          sx={{
            top: 0,
            marginLeft: "15px",
            position: "absolute",
            borderRadius: "20px",
            width: "calc(100% - 30px)",
            "@media (max-width: 767px)": {
              margin: 0,
              top: "-18px",
              width: "100%",
            },
          }}
        />
      )}
      <Results>
        {props.results.map((result: SearchResultModel) => {
          if (!result.link) {
            return (
              <ResultA
                key={result.value}
                style={{ cursor: "not-allowed", pointerEvents: "none" }}
              >
                {result.type && result.type.length > 0 && getIcon(result.type)}
                <div>{result.label}</div>
              </ResultA>
            );
          }
          if (result.link.indexOf("http") > -1) {
            return (
              <ResultA
                key={result.value}
                onClick={() => window.open(result.link, "_blank")}
              >
                {result.type && result.type.length > 0 && getIcon(result.type)}
                <div>{result.label}</div>
              </ResultA>
            );
          }
          return (
            <ResultLink
              smooth
              to={result.link}
              key={result.value}
              data-cy="search-result-item-link"
              scroll={(el) => {
                const yCoordinate =
                  el.getBoundingClientRect().top + window.scrollY;
                const yOffset = -130;
                window.scrollTo({
                  top: yCoordinate + yOffset,
                  behavior: "smooth",
                });
              }}
            >
              {result.type && result.type.length > 0 && getIcon(result.type)}
              <div>{result.label}</div>
            </ResultLink>
          );
        })}
        {props.results.length === 0 && !props.loading && hasLoaded && (
          <NoResults>
            {getCMSDataField(
              cmsData,
              "componentsSearch.noResults",
              "No results found.",
            )}
          </NoResults>
        )}
        {props.loading && (
          <NoResults>
            {getCMSDataField(cmsData, "componentsSearch.loading", "Loading...")}
          </NoResults>
        )}
      </Results>
    </Container>
  );
}
