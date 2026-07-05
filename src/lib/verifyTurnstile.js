const _usedTokens = new Map();
const TOKEN_TTL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, ts] of _usedTokens) {
    if (now - ts > TOKEN_TTL_MS) _usedTokens.delete(token);
  }
}, 60_000);

export function getCaptchaSecret() {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || secret === "undefined") {
    throw new Error('CAPTCHA_CONFIG_MISSING');
  }
  return secret;
}

/**
 * Shared Cloudflare Turnstile verification helper.
 *
 * @param {string} captchaToken
 * @param {{ ip?: string }} [opts]
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function verifyTurnstile(captchaToken, opts = {}) {
  const secretKey = getCaptchaSecret();
  console.error('Turnstile config valid:', !!secretKey);

  const token = String(captchaToken || "").trim();
  if (!token) {
    return { ok: false, error: "Captcha token missing" };
  }

  if (_usedTokens.has(token)) {
    return { ok: false, error: "Captcha token expired or was already used. Please refresh the page." };
  }

  const ip = String(opts.ip || "").trim();

  let response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
      }),
    });
  } catch {
    return { ok: false, error: "Captcha verification request failed" };
  }

  if (!response.ok) {
    return { ok: false, error: "Captcha verification request failed" };
  }

  const data = await response.json().catch(() => null);
  
  console.error('Turnstile verify success:', !!data?.success);

  if (!data?.success) {
    const errorCodes = data?.["error-codes"] || [];
    if (errorCodes.includes("timeout-or-duplicate")) {
      return { ok: false, error: "Captcha token expired or was already used. Please refresh the page." };
    }
    return { ok: false, error: "Captcha verification failed. Please try again." };
  }

  _usedTokens.set(token, Date.now());

  return { ok: true };
}
