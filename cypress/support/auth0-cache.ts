/**
 * Builds the localStorage entries @auth0/auth0-spa-js (v2) reads when the app
 * runs with `cacheLocation: "localstorage"`, so a test can start signed in.
 *
 * Mirrors the SDK's CacheManager: an access token entry keyed by client id,
 * audience and scope, and an ID token entry whose `decodedToken.user` becomes
 * `useAuth0().user`. If an SDK upgrade changes this format, logged-in specs
 * will start landing on Auth0's login page instead of the app.
 *
 * Runs in both Node (the login task) and the browser, so no Node APIs here.
 */

export interface Auth0TokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface Auth0CacheSettings {
  clientId: string;
  audience: string;
  // Must be the scope the app requests (AUTH0_SCOPE), not the scope Auth0
  // granted: the SDK looks entries up by the scope it asked for.
  scope: string;
}

const CACHE_KEY_PREFIX = "@@auth0spajs@@";

// Claims the SDK strips from the ID token when building `user`.
const PROTOCOL_CLAIMS = [
  "iss",
  "aud",
  "exp",
  "nbf",
  "iat",
  "jti",
  "azp",
  "nonce",
  "auth_time",
  "at_hash",
  "c_hash",
  "acr",
  "amr",
  "sub_jwk",
  "cnf",
  "sip_from_tag",
  "sip_date",
  "sip_callid",
  "sip_cseq_num",
  "sip_via_branch",
  "orig",
  "dest",
  "mky",
  "events",
  "toe",
  "txn",
  "rph",
  "sid",
  "vot",
  "vtm",
];

const decodeSegment = (segment: string) => {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

export const decodeIdToken = (idToken: string) => {
  const [header, payload, signature] = idToken.split(".");
  if (!header || !payload || !signature) {
    throw new Error("ID token could not be decoded");
  }
  const payloadJSON: Record<string, unknown> = decodeSegment(payload);
  const claims: Record<string, unknown> = { __raw: idToken };
  const user: Record<string, unknown> = {};
  Object.entries(payloadJSON).forEach(([key, value]) => {
    claims[key] = value;
    if (!PROTOCOL_CLAIMS.includes(key)) {
      user[key] = value;
    }
  });
  return {
    encoded: { header, payload, signature },
    header: decodeSegment(header),
    claims,
    user,
  };
};

export const buildAuth0CacheEntries = (
  settings: Auth0CacheSettings,
  tokens: Auth0TokenResponse,
  nowSeconds = Math.floor(Date.now() / 1000),
): Record<string, unknown> => {
  const { clientId, audience, scope } = settings;
  return {
    [`${CACHE_KEY_PREFIX}::${clientId}::${audience}::${scope}`]: {
      body: {
        client_id: clientId,
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        token_type: tokens.token_type,
        audience,
        scope,
      },
      expiresAt: nowSeconds + tokens.expires_in,
    },
    [`${CACHE_KEY_PREFIX}::${clientId}::@@user@@`]: {
      id_token: tokens.id_token,
      decodedToken: decodeIdToken(tokens.id_token),
    },
  };
};
