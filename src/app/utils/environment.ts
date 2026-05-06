export function getAppEnv(): string {
  return import.meta.env.VITE_APP_ENV ?? "";
}

export function isStagingEnv(): boolean {
  return getAppEnv() === "staging";
}

export interface BasicAuthCredentials {
  user: string;
  pass: string;
}

/**
 * Returns basic-auth credentials from env vars, or null if not configured.
 * This is a frontend-only soft gate, not a security boundary.
 *
 * TODO: As this moves from development to deployment to staging, this guard
 * is intended to be completely removed. When deployed, the /ai-explorer route
 * should be protected by nginx basic auth and these env vars should be removed.
 */
export function getBasicAuthCredentials(): BasicAuthCredentials | null {
  const user = import.meta.env.VITE_AI_EXPLORER_BASIC_AUTH_USER;
  const pass = import.meta.env.VITE_AI_EXPLORER_BASIC_AUTH_PASS;
  if (!user || !pass) return null;
  return { user, pass };
}
