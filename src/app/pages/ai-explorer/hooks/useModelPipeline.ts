import { useState, useCallback } from "react";
import {
  UseCaseSummary,
  UseCaseDetail,
  PredictResponse,
  UseCaseResult,
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
