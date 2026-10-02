import React from "react";
import {
  CountryNarrativeBundle,
  PageNarrativeBundle,
  PageNarrativeRef,
  SavedNarrativeBundle,
  isPageNarrativeRef,
  pageNarrativeKey,
  parseCountryNarrativeBundle,
  parsePageNarrativeBundle,
} from "app/types/narratives";

export type NarrativesState<Bundle = SavedNarrativeBundle> =
  | {
      status: "disabled" | "idle" | "loading" | "not_found";
      bundle: null;
      error: null;
    }
  | { status: "success"; bundle: Bundle; error: null }
  | { status: "error"; bundle: null; error: string };

export interface CountryNarrativeRef {
  country: string;
  locale: "en";
}
export type SavedNarrativeRef = PageNarrativeRef | CountryNarrativeRef;
export type NarrativesContextValue<Bundle = SavedNarrativeBundle> =
  NarrativesState<Bundle> & {
    ref: SavedNarrativeRef | null;
    enabled: boolean;
    refresh: () => void;
  };
export type PageNarrativesState = NarrativesState<PageNarrativeBundle>;
export type PageNarrativesContextValue =
  NarrativesContextValue<PageNarrativeBundle>;

const NarrativesContext = React.createContext<NarrativesContextValue | null>(
  null,
);
const enabledFlag = () => import.meta.env.VITE_ENABLE_NARRATIVES === "true";
const validRef = (ref?: SavedNarrativeRef | null): SavedNarrativeRef | null => {
  if (!ref) return null;
  if ("country" in ref)
    return /^[A-Z]{3}$/.test(ref.country) && ref.locale === "en" ? ref : null;
  return isPageNarrativeRef(ref) ? ref : null;
};
const requestKey = (ref: SavedNarrativeRef | null) =>
  ref
    ? "country" in ref
      ? JSON.stringify(["country-v1", ref.country, ref.locale])
      : `page-v2:${pageNarrativeKey(ref)}`
    : null;
const requestUrl = (ref: SavedNarrativeRef) => {
  const api = import.meta.env.VITE_API?.replace(/\/$/, "");
  if (!api) return null;
  return "country" in ref
    ? `${api}/location/${ref.country}/narratives?locale=${ref.locale}`
    : `${api}/narratives/pages/${encodeURIComponent(ref.page_type)}/${encodeURIComponent(ref.page_id)}?locale=${ref.locale}&scope_key=${encodeURIComponent(ref.scope_key)}`;
};

function useNarrativeRequest(
  ref?: SavedNarrativeRef | null,
  active = true,
): NarrativesContextValue {
  const enabled = enabledFlag();
  const normalizedRef = validRef(ref);
  const key = requestKey(normalizedRef);
  const [result, setResult] = React.useState<{
    key: string | null;
    state: NarrativesState;
  }>({ key: null, state: { status: "idle", bundle: null, error: null } });
  const [refreshToken, setRefreshToken] = React.useState(0);
  React.useEffect(() => {
    if (!active || !enabled || !key) return;
    const identity = JSON.parse(
      key.startsWith("page-v2:") ? key.slice(8) : key,
    ) as string[];
    const currentRef: SavedNarrativeRef = key.startsWith("page-v2:")
      ? {
          page_type: identity[0],
          page_id: identity[1],
          locale: "en",
          scope_key: identity[3],
        }
      : { country: identity[1], locale: "en" };
    const url = requestUrl(currentRef);
    if (!url) {
      setResult({
        key,
        state: {
          status: "error",
          bundle: null,
          error:
            "Narratives are unavailable because VITE_API is not configured",
        },
      });
      return;
    }
    const controller = new AbortController();
    let current = true;
    setResult({ key, state: { status: "loading", bundle: null, error: null } });
    fetch(url, {
      signal: controller.signal,
      credentials: "omit",
      headers: { Accept: "application/json" },
    })
      .then(async (response): Promise<NarrativesState> => {
        if (response.status === 404)
          return { status: "not_found", bundle: null, error: null };
        if (!response.ok) throw new Error("Narrative service failed");
        const value: unknown = await response.json();
        const bundle =
          "country" in currentRef
            ? parseCountryNarrativeBundle(value)
            : parsePageNarrativeBundle(value, currentRef);
        if (
          !bundle ||
          ("country" in currentRef &&
            (!("country" in bundle) || bundle.country !== currentRef.country))
        )
          throw new Error("Invalid saved narrative bundle");
        return { status: "success", bundle, error: null };
      })
      .then((state) => {
        if (current) setResult({ key, state });
      })
      .catch(() => {
        if (current)
          setResult({
            key,
            state: {
              status: "error",
              bundle: null,
              error: "Narratives are temporarily unavailable",
            },
          });
      });
    return () => {
      current = false;
      controller.abort();
    };
  }, [active, enabled, key, refreshToken]);

  const state: NarrativesState = !enabled
    ? { status: "disabled", bundle: null, error: null }
    : !key || !active
      ? { status: "idle", bundle: null, error: null }
      : result.key !== key
        ? { status: "loading", bundle: null, error: null }
        : result.state;
  return {
    ...state,
    ref: normalizedRef,
    enabled,
    refresh: () => setRefreshToken((token) => token + 1),
  };
}

export const SavedNarrativesProvider: React.FC<{
  narrativeRef?: SavedNarrativeRef | null;
  children?: React.ReactNode;
}> = ({ narrativeRef, children }) => {
  const value = useNarrativeRequest(narrativeRef);
  return React.createElement(NarrativesContext.Provider, { value }, children);
};

export function useSavedNarratives(
  ref?: SavedNarrativeRef | null,
): NarrativesContextValue {
  const context = React.useContext(NarrativesContext);
  const matching =
    context !== null &&
    (ref === undefined ||
      requestKey(validRef(ref)) === requestKey(context.ref));
  const fallback = useNarrativeRequest(ref, !matching);
  return matching ? context : fallback;
}

export const PageNarrativesProvider: React.FC<{
  pageRef?: PageNarrativeRef | null;
  children: React.ReactNode;
}> = ({ pageRef, children }) =>
  React.createElement(
    SavedNarrativesProvider,
    {
      narrativeRef: pageRef,
    },
    children,
  );

export function usePageNarratives(
  ref?: PageNarrativeRef | null,
): PageNarrativesContextValue {
  const state = useSavedNarratives(ref);
  if (state.status === "success" && "country" in state.bundle)
    return { ...state, status: "idle", bundle: null, error: null };
  return state as PageNarrativesContextValue;
}

export type LegacyCountryNarrativesState =
  NarrativesState<CountryNarrativeBundle>;
