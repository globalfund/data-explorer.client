import React from "react";
import {
  LegacyCountryNarrativesState,
  SavedNarrativesProvider,
  useSavedNarratives,
} from "app/hooks/usePageNarratives";

export type CountryNarrativesState = LegacyCountryNarrativesState;
export type CountryNarrativesContextValue = CountryNarrativesState & {
  country: string | null;
  enabled: boolean;
  refresh: () => void;
};

const normalizeCountry = (country?: string | null) => {
  const normalized = country?.trim().toUpperCase() || "";
  return /^[A-Z]{3}$/.test(normalized) ? normalized : null;
};

export interface CountryNarrativesProviderProps {
  country?: string | null;
  children: React.ReactNode;
}

export const CountryNarrativesProvider: React.FC<
  CountryNarrativesProviderProps
> = ({ country, children }) => {
  const normalized = normalizeCountry(country);
  return React.createElement(
    SavedNarrativesProvider,
    {
      narrativeRef: normalized ? { country: normalized, locale: "en" } : null,
    },
    children,
  );
};

export function useCountryNarratives(
  country?: string | null,
): CountryNarrativesContextValue {
  const normalized = normalizeCountry(country);
  const state = useSavedNarratives(
    country === undefined
      ? undefined
      : normalized
        ? { country: normalized, locale: "en" }
        : null,
  );
  const resolvedCountry =
    state.ref && "country" in state.ref ? state.ref.country : null;
  const value = { ...state, country: resolvedCountry };
  if (state.status === "success" && !("country" in state.bundle))
    return { ...value, status: "idle", bundle: null, error: null };
  return value as CountryNarrativesContextValue;
}
