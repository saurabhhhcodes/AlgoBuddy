const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const routePath = path.resolve(__dirname, "..", "src", "app", "api", "applications", "[id]", "route.js");

test("Application status emails escape job and company HTML", () => {
  const content = fs.readFileSync(routePath, "utf8");

  assert.match(content, /function escapeHtml\(value\)/);
  assert.match(content, /const escapedJobTitle = escapeHtml\(jobTitle\);/);
  assert.match(content, /const escapedCompanyName = escapeHtml\(companyName\);/);
  assert.match(content, /<strong>\$\{escapedJobTitle\}<\/strong> at <strong>\$\{escapedCompanyName\}<\/strong>/);
  assert.doesNotMatch(content, /<strong>\$\{jobTitle\}<\/strong> at <strong>\$\{companyName\}<\/strong>/);
});
