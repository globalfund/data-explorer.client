import {
  Auth0TokenResponse,
  buildAuth0CacheEntries,
  decodeIdToken,
} from "../support/auth0-cache";
import { AUTH0_SCOPE } from "../../src/app/utils/auth0Config";

/**
 * Signs test users in with Auth0's password grant from Node, so passwords
 * never reach the browser or Cypress' command log.
 *
 * Credentials come from the environment (see cypress/README.md):
 *   TEST_USER_1_EMAIL / TEST_USER_1_PASSWORD   main test user
 *   TEST_USER_2_EMAIL / TEST_USER_2_PASSWORD   second user, for cross-user
 *                                              access
 *   E2E_AUTH0_CLIENT_SECRET   only if the Auth0 application requires one
 *   E2E_AUTH0_REALM           database connection, if the tenant has no
 *                              default directory
 */

// Auth0's name for the password grant with a realm. It's an identifier, not a
// URL that gets requested, and Auth0 only accepts it spelled exactly this way.
const PASSWORD_REALM_GRANT = "http://auth0.com/oauth/grant-type/password-realm"; // NOSONAR

export type E2EUser = "owner" | "other";

export interface E2ESession {
  accessToken: string;
  userId: string;
  entries: Record<string, unknown>;
  expiresAt: number;
}

const credentialsFor = (user: E2EUser) => {
  const prefix = user === "owner" ? "TEST_USER_1" : "TEST_USER_2";
  const username = process.env[`${prefix}_EMAIL`];
  const password = process.env[`${prefix}_PASSWORD`];
  if (!username || !password) {
    throw new Error(
      `Set ${prefix}_EMAIL and ${prefix}_PASSWORD to run logged-in specs (see cypress/README.md).`,
    );
  }
  return { username, password };
};

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set (see cypress/README.md).`);
  return value;
};

const requestTokens = async (user: E2EUser): Promise<Auth0TokenResponse> => {
  const { username, password } = credentialsFor(user);
  const realm = process.env.E2E_AUTH0_REALM;
  const clientSecret = process.env.E2E_AUTH0_CLIENT_SECRET;
  const response = await fetch(
    `https://${requireEnv("VITE_AUTH0_DOMAIN")}/oauth/token`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: realm ? PASSWORD_REALM_GRANT : "password",
        username,
        password,
        audience: requireEnv("VITE_AUTH0_AUDIENCE"),
        scope: AUTH0_SCOPE,
        client_id: requireEnv("VITE_AUTH0_CLIENT_ID"),
        ...(realm ? { realm } : {}),
        ...(clientSecret ? { client_secret: clientSecret } : {}),
      }),
    },
  );
  if (!response.ok) {
    // Auth0 explains what's misconfigured (grant type, connection, MFA).
    throw new Error(
      `Auth0 password login for the ${user} test user failed (${response.status}): ${await response.text()}`,
    );
  }
  return response.json();
};

// One Auth0 login per user per run; Auth0 rate-limits the token endpoint.
const sessions = new Map<E2EUser, E2ESession>();

export const getE2ESession = async (user: E2EUser): Promise<E2ESession> => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const cached = sessions.get(user);
  if (cached && cached.expiresAt - 60 > nowSeconds) return cached;

  const tokens = await requestTokens(user);
  const session: E2ESession = {
    accessToken: tokens.access_token,
    userId: String(decodeIdToken(tokens.id_token).user.sub),
    entries: buildAuth0CacheEntries(
      {
        clientId: requireEnv("VITE_AUTH0_CLIENT_ID"),
        audience: requireEnv("VITE_AUTH0_AUDIENCE"),
        scope: AUTH0_SCOPE,
      },
      tokens,
      nowSeconds,
    ),
    expiresAt: nowSeconds + tokens.expires_in,
  };
  sessions.set(user, session);
  return session;
};
