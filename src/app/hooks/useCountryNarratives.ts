import React from "react";
import {
  CountryNarrativeBundle,
  parseCountryNarrativeBundle,
} from "app/types/narratives";

export type CountryNarrativesState =
  | { status: "disabled"; bundle: null; error: null }
  | { status: "idle"; bundle: null; error: null }
  | { status: "loading"; bundle: null; error: null }
  | { status: "success"; bundle: CountryNarrativeBundle; error: null }
  | { status: "not_found"; bundle: null; error: null }
  | { status: "error"; bundle: null; error: string };

export type CountryNarrativesContextValue = CountryNarrativesState & {
  country: string | null;
  enabled: boolean;
  refresh: () => void;
};

const CountryNarrativesContext =
  React.createContext<CountryNarrativesContextValue | null>(null);

const isNarrativesEnabled = () =>
  import.meta.env.VITE_ENABLE_NARRATIVES === "true";

const normalizeCountry = (country?: string | null) => {
  const normalized = country?.trim().toUpperCase() || "";
  return /^[A-Z]{3}$/.test(normalized) ? normalized : null;
};

const narrativeUrl = (country: string) => {
  const api = import.meta.env.VITE_API?.replace(/\/$/, "");
  return api ? `${api}/location/${country}/narratives?locale=en` : null;
};

function useNarrativeRequest(
  country?: string | null,
): CountryNarrativesContextValue {
  const enabled = isNarrativesEnabled();
  const normalizedCountry = normalizeCountry(country);
  const [state, setState] = React.useState<CountryNarrativesState>(() =>
    enabled
      ? { status: "idle", bundle: null, error: null }
      : { status: "disabled", bundle: null, error: null },
  );
  const [refreshToken, setRefreshToken] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) {
      setState({ status: "disabled", bundle: null, error: null });
      return;
    }
    const url = normalizedCountry ? narrativeUrl(normalizedCountry) : null;
    if (!url) {
      setState(
        normalizedCountry
          ? {
              status: "error",
              bundle: null,
              error:
                "Narratives are unavailable because VITE_API is not configured",
            }
          : { status: "idle", bundle: null, error: null },
      );
      return;
    }
    const controller = new AbortController();
    let current = true;
    setState({ status: "loading", bundle: null, error: null });
    fetch(url, {
      signal: controller.signal,
      credentials: "omit",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (response.status === 404) return { kind: "not_found" as const };
        if (!response.ok)
          throw new Error(`Narrative service returned ${response.status}`);
        const parsed = parseCountryNarrativeBundle(await response.json());
        if (!parsed || parsed.country !== normalizedCountry)
          throw new Error("Narrative service returned an invalid bundle");
        return { kind: "success" as const, bundle: parsed };
      })
      .then((result) => {
        if (!current) return;
        if (result.kind === "not_found")
          setState({ status: "not_found", bundle: null, error: null });
        else
          setState({ status: "success", bundle: result.bundle, error: null });
      })
      .catch((error: unknown) => {
        if (
          !current ||
          (error instanceof DOMException && error.name === "AbortError")
        )
          return;
        setState({
          status: "error",
          bundle: null,
          error: "Narratives are temporarily unavailable",
        });
      });
    return () => {
      current = false;
      controller.abort();
    };
  }, [enabled, normalizedCountry, refreshToken]);

  const visibleState =
    enabled &&
    state.status === "success" &&
    state.bundle.country !== normalizedCountry
      ? { status: "loading" as const, bundle: null, error: null }
      : state;
  return {
    ...visibleState,
    country: normalizedCountry,
    enabled,
    refresh: () => setRefreshToken((token) => token + 1),
  };
}

export interface CountryNarrativesProviderProps {
  country?: string | null;
  children: React.ReactNode;
}

export const CountryNarrativesProvider: React.FC<
  CountryNarrativesProviderProps
> = ({ country, children }) => {
  const value = useNarrativeRequest(country);
  return React.createElement(
    CountryNarrativesContext.Provider,
    { value },
    children,
  );
};

export function useCountryNarratives(
  country?: string | null,
): CountryNarrativesContextValue {
  const context = React.useContext(CountryNarrativesContext);
  const fallback = useNarrativeRequest(country);
  if (
    context &&
    (country === undefined || normalizeCountry(country) === context.country)
  )
    return context;
  return fallback;
}
