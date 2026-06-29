function resolveRedisClientConfig(env = process.env) {
  const redisUrl = typeof env.REDIS_URL === "string" ? env.REDIS_URL.trim() : "";
  if (redisUrl) {
    return {
      useMock: false,
      redisUrl,
    };
  }

  if (env.ALLOW_REDIS_MOCK === "true") {
    return {
      useMock: true,
      redisUrl: "",
    };
  }

  throw new Error(
    "REDIS_URL is required for arena-socket-server. Set REDIS_URL or ALLOW_REDIS_MOCK=true for local development and tests.",
  );
}

module.exports = {
  resolveRedisClientConfig,
};
