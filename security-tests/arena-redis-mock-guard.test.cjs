const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { resolveRedisClientConfig } = require(
  path.resolve(__dirname, "..", "arena-socket-server", "redisClientConfig.js"),
);

test("redis config prefers a real Redis URL when provided", () => {
  const config = resolveRedisClientConfig({
    REDIS_URL: "  redis://localhost:6379  ",
    NODE_ENV: "production",
  });

  assert.deepEqual(config, {
    useMock: false,
    redisUrl: "redis://localhost:6379",
  });
});

test("redis config allows the mock only when explicitly enabled", () => {
  const config = resolveRedisClientConfig({
    ALLOW_REDIS_MOCK: "true",
    NODE_ENV: "production",
  });

  assert.deepEqual(config, {
    useMock: true,
    redisUrl: "",
  });
});

test("redis config fails closed when Redis is missing and mock mode is not enabled", () => {
  assert.throws(
    () => resolveRedisClientConfig({ NODE_ENV: "production" }),
    /REDIS_URL is required for arena-socket-server/i,
  );
});
