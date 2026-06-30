function getBearerToken(authHeader) {
  if (typeof authHeader !== "string") return null;
  const [scheme, token, ...rest] = authHeader.trim().split(/\s+/);
  if (!scheme || !token || rest.length > 0) return null;
  return scheme.toLowerCase() === "bearer" ? token : null;
}

async function requireBearerAuth(req, res, verifyAuthToken) {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  const authPayload = await verifyAuthToken(token);
  if (!authPayload) {
    res.status(401).json({ error: "Invalid or expired session" });
    return null;
  }

  return authPayload;
}

module.exports = {
  getBearerToken,
  requireBearerAuth,
};
