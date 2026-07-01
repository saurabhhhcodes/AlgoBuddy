const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Review email payload includes a plain-text body", () => {
  const filePath = path.resolve(__dirname, "..", "src", "app", "api", "send-review", "route.js");
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /text:\s*`/);
  assert.match(content, /Rating:\s*\$\{safeRating\}\/5/);
  assert.match(content, /Review:\s*\$\{trimmedReview\}/);
});
