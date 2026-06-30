function extractBearerToken(headers = {}) {
  const rawHeader = headers.authorization || headers.Authorization || headers["x-auth-token"];
  if (!rawHeader || typeof rawHeader !== "string") {
    return null;
  }

  const trimmed = rawHeader.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.toLowerCase().startsWith("bearer ")) {
    const token = trimmed.slice(7).trim();
    return token || null;
  }

  return trimmed;
}

async function authorizeArenaRoute(req, res, userId, verifyAuthToken) {
  const token = extractBearerToken(req.headers);
  if (!token) {
    res.status(401).json({ verified: false, error: "Unauthorized" });
    return null;
  }

  const authPayload = await verifyAuthToken(token);
  const authenticatedUserId = authPayload?.sub || authPayload?.id;
  if (!authenticatedUserId) {
    res.status(401).json({ verified: false, error: "Unauthorized" });
    return null;
  }

  if (authenticatedUserId !== userId) {
    res.status(403).json({ verified: false, error: "Forbidden" });
    return null;
  }

  return authenticatedUserId;
}

module.exports = {
  extractBearerToken,
  authorizeArenaRoute,
};
