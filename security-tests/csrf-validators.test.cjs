const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const csrfModulePath = path.resolve(__dirname, "..", "src", "lib", "csrf.js");

function buildRequest(headers = {}) {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    headers: {
      get(name) {
        return normalized[name.toLowerCase()] ?? null;
      },
    },
  };
}

test("CSRF helpers - origin, method, and route checks", async (t) => {
  const { validateCsrfOrigin, isStateChangingMethod, isApiRoute } = await import(`file://${csrfModulePath}`);

  await t.test("accepts a trusted Origin header", () => {
    assert.equal(
      validateCsrfOrigin(buildRequest({ origin: "https://algobuddy.me" })),
      true,
    );
  });

  await t.test("accepts a trusted Referer header with a path", () => {
    assert.equal(
      validateCsrfOrigin(buildRequest({ referer: "https://algobuddy.me/practice" })),
      true,
    );
  });

  await t.test("accepts a trusted Referer header with query and trailing slash", () => {
    assert.equal(
      validateCsrfOrigin(buildRequest({ referer: "https://www.algobuddy.me/cookie?source=banner#policy/" })),
      true,
    );
  });

  await t.test("rejects an untrusted Referer header", () => {
    assert.equal(
      validateCsrfOrigin(buildRequest({ referer: "https://example.com/practice" })),
      false,
    );
  });

  await t.test("rejects requests with no origin or referer", () => {
    assert.equal(validateCsrfOrigin(buildRequest()), false);
  });

  await t.test("identifies state-changing HTTP methods", () => {
    assert.equal(isStateChangingMethod("POST"), true);
    assert.equal(isStateChangingMethod("PUT"), true);
    assert.equal(isStateChangingMethod("PATCH"), true);
    assert.equal(isStateChangingMethod("DELETE"), true);
    assert.equal(isStateChangingMethod("GET"), false);
    assert.equal(isStateChangingMethod("HEAD"), false);
    assert.equal(isStateChangingMethod("OPTIONS"), false);
  });

  await t.test("identifies API routes", () => {
    assert.equal(isApiRoute("/api/progress"), true);
    assert.equal(isApiRoute("/api/auth/login"), true);
    assert.equal(isApiRoute("/practice"), false);
    assert.equal(isApiRoute("/cookie"), false);
  });
});
