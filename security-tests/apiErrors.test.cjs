/**
 * Verifies the shared API error hierarchy contract:
 * - default status/code values
 * - subclass inheritance
 * - custom message propagation
 * - default messages for subclasses
 *
 * Run with:
 *   node --experimental-detect-module --test security-tests/apiErrors.test.cjs
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const errorsUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "apiErrors.js"),
).href;

async function loadErrors() {
  return import(errorsUrl);
}

test("ApiError uses the default code and status while preserving the message", async () => {
  const { ApiError } = await loadErrors();
  const error = new ApiError("boom");

  assert.equal(error.name, "ApiError");
  assert.equal(error.message, "boom");
  assert.equal(error.code, "INTERNAL_ERROR");
  assert.equal(error.status, 500);
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ApiError);
});

test("ApiError falls back to the default empty message when none is provided", async () => {
  const { ApiError } = await loadErrors();
  const error = new ApiError();

  assert.equal(error.message, "");
  assert.equal(error.code, "INTERNAL_ERROR");
  assert.equal(error.status, 500);
});

test("AuthError exposes the auth contract and inherits from ApiError", async () => {
  const { ApiError, AuthError } = await loadErrors();
  const error = new AuthError();

  assert.equal(error.name, "AuthError");
  assert.equal(error.message, "Unauthorized");
  assert.equal(error.code, "AUTH_ERROR");
  assert.equal(error.status, 401);
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ApiError);
  assert.ok(error instanceof AuthError);

  const custom = new AuthError("Session expired");
  assert.equal(custom.message, "Session expired");
});

test("RateLimitError exposes the rate limit contract and inherits from ApiError", async () => {
  const { ApiError, RateLimitError } = await loadErrors();
  const error = new RateLimitError();

  assert.equal(error.name, "RateLimitError");
  assert.equal(error.message, "Too many requests");
  assert.equal(error.code, "RATE_LIMIT");
  assert.equal(error.status, 429);
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ApiError);
  assert.ok(error instanceof RateLimitError);

  const custom = new RateLimitError("Slow down");
  assert.equal(custom.message, "Slow down");
});

test("ValidationError exposes the validation contract and inherits from ApiError", async () => {
  const { ApiError, ValidationError } = await loadErrors();
  const error = new ValidationError();

  assert.equal(error.name, "ValidationError");
  assert.equal(error.message, "Validation failed");
  assert.equal(error.code, "VALIDATION_ERROR");
  assert.equal(error.status, 400);
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ApiError);
  assert.ok(error instanceof ValidationError);

  const custom = new ValidationError("Bad input");
  assert.equal(custom.message, "Bad input");
});

test("ConfigError exposes the config contract and inherits from ApiError", async () => {
  const { ApiError, ConfigError } = await loadErrors();
  const error = new ConfigError();

  assert.equal(error.name, "ConfigError");
  assert.equal(error.message, "Server configuration error");
  assert.equal(error.code, "CONFIG_ERROR");
  assert.equal(error.status, 500);
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ApiError);
  assert.ok(error instanceof ConfigError);

  const custom = new ConfigError("Missing secret");
  assert.equal(custom.message, "Missing secret");
});
