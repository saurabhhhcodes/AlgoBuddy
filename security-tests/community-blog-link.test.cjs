const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Community blog feed uses the existing /blog route", () => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "components",
    "community",
    "CommunityBlogFeed.jsx",
  );
  const content = fs.readFileSync(filePath, "utf8");

  assert.doesNotMatch(content, /href="\/blogs"/);
  assert.match(content, /href="\/blog"/);
});
