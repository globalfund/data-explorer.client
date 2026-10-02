import React from "react";
import { createRoot } from "react-dom/client";
import {
  PageNarrativesProvider,
  usePageNarratives,
} from "../../src/app/hooks/usePageNarratives";
import {
  CountryNarrativesProvider,
  useCountryNarratives,
} from "../../src/app/hooks/useCountryNarratives";
import { SavedNarrativeSectionView } from "../../src/app/components/narrative-section";
import type { PageNarrativeRef } from "../../src/app/types/narratives";

const initialRef: PageNarrativeRef = {
  page_type: "resource-mobilization",
  page_id: "global",
  locale: "en",
  scope_key: "default",
};
const PageConsumer = ({
  pageRef,
  explicit,
}: {
  pageRef: PageNarrativeRef;
  explicit: boolean;
}) => {
  const state = usePageNarratives(explicit ? pageRef : undefined);
  return (
    <div
      data-cy={explicit ? "explicit-page" : "implicit-page"}
      data-status={state.status}
    >
      {state.status === "success" && (
        <SavedNarrativeSectionView
          bundle={state.bundle}
          sectionId={
            new URLSearchParams(window.location.search).has("summary")
              ? state.bundle.summary!.id
              : state.bundle.sections[0].id
          }
          scopeMatches
        />
      )}
    </div>
  );
};
const CountryConsumer = ({ explicit }: { explicit: boolean }) => {
  const state = useCountryNarratives(explicit ? "MOZ" : undefined);
  return (
    <div
      data-cy={explicit ? "explicit-country" : "implicit-country"}
      data-status={state.status}
    >
      {state.bundle?.country}
    </div>
  );
};
const Harness = () => {
  const [pageRef, setPageRef] = React.useState(initialRef);
  const country = new URLSearchParams(window.location.search).has("country");
  if (country)
    return (
      <CountryNarrativesProvider country="MOZ">
        <CountryConsumer explicit />
        <CountryConsumer explicit={false} />
      </CountryNarrativesProvider>
    );
  return (
    <>
      <button
        type="button"
        onClick={() => setPageRef({ ...initialRef, scope_key: "filtered" })}
      >
        Change scope
      </button>
      <button
        type="button"
        onClick={() => setPageRef({ ...initialRef, page_id: "other" })}
      >
        Change page
      </button>
      <button type="button" onClick={() => setPageRef(initialRef)}>
        Restore page
      </button>
      <PageNarrativesProvider pageRef={pageRef}>
        <PageConsumer pageRef={pageRef} explicit />
        <PageConsumer pageRef={pageRef} explicit={false} />
      </PageNarrativesProvider>
    </>
  );
};
createRoot(document.getElementById("root")!).render(<Harness />);
