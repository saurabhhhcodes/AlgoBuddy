const test = require("node:test");
const assert = require("node:assert/strict");

function isValidSupabaseUrl(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  if (trimmed.startsWith("Your ")) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidKey(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed && !trimmed.startsWith("Your ");
}

test("isValidSupabaseUrl accepts valid http and https URLs", () => {
  assert.equal(isValidSupabaseUrl("https://example.supabase.co"), true);
  assert.equal(isValidSupabaseUrl("http://localhost:3000"), true);
});

test("isValidSupabaseUrl rejects missing or malformed values", () => {
  assert.equal(isValidSupabaseUrl(null), false);
  assert.equal(isValidSupabaseUrl(undefined), false);
  assert.equal(isValidSupabaseUrl(""), false);
  assert.equal(isValidSupabaseUrl("example.com"), false);
  assert.equal(isValidSupabaseUrl("ftp://example.com"), false);
  assert.equal(isValidSupabaseUrl("Your Supabase URL"), false);
  assert.equal(isValidSupabaseUrl("   "), false);
});

test("isValidKey accepts non-empty keys and rejects placeholders", () => {
  assert.equal(isValidKey("service-key"), true);
  assert.equal(isValidKey("   service-key   "), true);
  assert.equal(isValidKey(""), false);
  assert.equal(isValidKey(null), false);
  assert.equal(isValidKey(undefined), false);
  assert.equal(isValidKey("Your Supabase Key"), false);
});
