import { useState, useCallback } from "react";
import {
  UseCaseSummary,
  UseCaseDetail,
  PredictResponse,
  UseCaseResult,
  CustomUseCaseSummary,
  CustomUseCaseDetail,
  CustomUseCaseCreateResponse,
  ByocAmbiguousError,
} from "app/pages/ai-explorer/types";

const BASE = `${import.meta.env.VITE_API}/model-pipeline/use-cases`;

function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  return fetch(url, init).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json() as Promise<T>;
  });
}

export function useUseCaseList() {
  const [data, setData] = useState<UseCaseSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<UseCaseSummary[]>(BASE)
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load use cases"),
      )
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, fetch };
}

export function useUseCaseDetail(slug: string) {
  const [data, setData] = useState<UseCaseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<UseCaseDetail>(`${BASE}/${slug}`)
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load detail"),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error, fetch };
}

export function useUseCaseResult(slug: string) {
  const [data, setData] = useState<UseCaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<UseCaseResult>(`${BASE}/${slug}/result`)
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load result"),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error, fetch };
}

export function useUseCasePredict(slug: string) {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(
    (body: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      apiFetch<PredictResponse>(`${BASE}/${slug}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(setData)
        .catch((e: unknown) =>
          setError(e instanceof Error ? e.message : "Prediction failed"),
        )
        .finally(() => setLoading(false));
    },
    [slug],
  );

  return { data, loading, error, predict };
}

const CUSTOM_BASE = `${import.meta.env.VITE_API}/model-pipeline/use-cases/custom`;

export function useCustomUseCaseList() {
  const [data, setData] = useState<CustomUseCaseSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<CustomUseCaseSummary[]>(CUSTOM_BASE)
      .then(setData)
      .catch((e: unknown) =>
        setError(
          e instanceof Error ? e.message : "Failed to load custom use cases",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, fetch };
}

export function useCustomUseCasePredict(slug: string) {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(
    (body: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      apiFetch<PredictResponse>(`${CUSTOM_BASE}/${slug}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(setData)
        .catch((e: unknown) =>
          setError(e instanceof Error ? e.message : "Prediction failed"),
        )
        .finally(() => setLoading(false));
    },
    [slug],
  );

  return { data, loading, error, predict };
}

export function useCustomUseCaseDetail(slug: string) {
  const [data, setData] = useState<CustomUseCaseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<CustomUseCaseDetail>(`${CUSTOM_BASE}/${slug}`)
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load detail"),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error, fetch };
}

export function useCustomUseCaseDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback((slug: string): Promise<void> => {
    setLoading(true);
    setError(null);
    return fetch(`${CUSTOM_BASE}/${slug}`, { method: "DELETE" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Failed to delete";
        setError(msg);
        throw e;
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, remove };
}

export type ByocCreateResult =
  | { ok: true; data: CustomUseCaseCreateResponse }
  | { ok: false; ambiguous: true; candidates: string[] }
  | { ok: false; ambiguous: false; error: string };

export function useCustomUseCaseCreate() {
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    (formData: FormData): Promise<ByocCreateResult> => {
      setLoading(true);
      return fetch(CUSTOM_BASE, { method: "POST", body: formData })
        .then(async (r) => {
          const json = await r.json();
          if (r.ok) {
            return {
              ok: true as const,
              data: json as CustomUseCaseCreateResponse,
            };
          }
          if (r.status === 400) {
            // Direct body (future): { candidates: [...] }
            // Loopback-wrapped body: { error: { details: [{ candidates: [...] }] } }
            const direct = (json as ByocAmbiguousError).candidates;
            const wrapped = (
              json as {
                error?: { details?: Array<{ candidates?: string[] }> };
              }
            ).error?.details?.[0]?.candidates;
            const candidates = direct ?? wrapped;
            if (candidates?.length) {
              return {
                ok: false as const,
                ambiguous: true as const,
                candidates,
              };
            }
          }
          const lbMsg = (json as { error?: { message?: string } }).error
            ?.message;
          const msg = lbMsg ?? `${r.status} ${r.statusText}`;
          return {
            ok: false as const,
            ambiguous: false as const,
            error: msg,
          };
        })
        .catch(
          (e: unknown): ByocCreateResult => ({
            ok: false as const,
            ambiguous: false as const,
            error: e instanceof Error ? e.message : "Upload failed",
          }),
        )
        .finally(() => setLoading(false));
    },
    [],
  );

  return { loading, create };
}
