const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

test("arena match verification routes require authenticated user binding", () => {
  const controllerPath = path.resolve(__dirname, "..", "backend", "src", "main", "java", "com", "algobuddy", "backend", "controller", "ArenaController.java");
  const servicePath = path.resolve(__dirname, "..", "backend", "src", "main", "java", "com", "algobuddy", "backend", "service", "ArenaService.java");
  const socketPath = path.resolve(__dirname, "..", "arena-socket-server", "index.js");
  const routeAuthPath = path.resolve(__dirname, "..", "arena-socket-server", "routeAuth.js");

  const controller = fs.readFileSync(controllerPath, "utf8");
  const service = fs.readFileSync(servicePath, "utf8");
  const socket = fs.readFileSync(socketPath, "utf8");
  const routeAuth = fs.readFileSync(routeAuthPath, "utf8");

  assert.match(controller, /AuthenticationPrincipal\s+Jwt\s+jwt/, "ArenaController should accept the authenticated JWT");
  assert.match(controller, /jwt\.getTokenValue\(\)/, "ArenaController should forward the access token to ArenaService");
  assert.match(service, /setRequestProperty\("Authorization", "Bearer "\s*\+\s*accessToken\)/, "ArenaService should forward bearer auth to the socket server");
  assert.match(routeAuth, /extractBearerToken/, "socket auth helper should extract bearer tokens");
  assert.match(routeAuth, /res\.status\(401\)\.json\(\{ verified: false, error: "Unauthorized" \}\)/, "socket auth helper should fail closed on missing auth");
  assert.match(routeAuth, /res\.status\(403\)\.json\(\{ verified: false, error: "Forbidden" \}\)/, "socket auth helper should reject mismatched user ids");
  assert.match(socket, /authorizeArenaRoute\(req, res, userId, verifyAuthToken\)/, "verify-match routes should require route authorization");
  assert.match(socket, /status\(404\)\.json\(\{ verified: false(, winnerId: null)? \}\)/, "match lookups should fail closed for missing or unauthorized matches");
});
