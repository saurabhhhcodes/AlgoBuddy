const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const authModulePath = require("node:path").resolve(__dirname, "..", "src", "lib", "auth.js");
const authModuleUrl = `file://${authModulePath}`;

const originalEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_KEY = originalEnv.SUPABASE_SERVICE_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalEnv.SUPABASE_SERVICE_ROLE_KEY;
});

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_KEY = originalEnv.SUPABASE_SERVICE_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalEnv.SUPABASE_SERVICE_ROLE_KEY;
});

test("auth helper validators reject placeholder and invalid inputs", async () => {
  const { isValidSupabaseUrl, isValidKey } = await import(authModuleUrl);

  assert.equal(isValidSupabaseUrl("https://example.com"), true);
  assert.equal(isValidSupabaseUrl("http://example.com"), true);
  assert.equal(isValidSupabaseUrl("notaurl"), false);
  assert.equal(isValidSupabaseUrl(null), false);
  assert.equal(isValidSupabaseUrl(undefined), false);
  assert.equal(isValidSupabaseUrl("Your Supabase URL"), false);
  assert.equal(isValidSupabaseUrl(12345), false);

  assert.equal(isValidKey("abc123"), true);
  assert.equal(isValidKey("  padded-key  "), true);
  assert.equal(isValidKey(""), false);
  assert.equal(isValidKey("   "), false);
  assert.equal(isValidKey(null), false);
  assert.equal(isValidKey(undefined), false);
  assert.equal(isValidKey("Your Supabase Key"), false);
});

test("getSupabaseConfig returns null when auth env vars are missing or invalid", async () => {
  const { getSupabaseConfig } = await import(authModuleUrl);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
  process.env.SUPABASE_SERVICE_KEY = "";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "";
  assert.equal(getSupabaseConfig(), null);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "notaurl";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  process.env.SUPABASE_SERVICE_KEY = "service-key";
  assert.equal(getSupabaseConfig(), null);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "Your Supabase anon key";
  process.env.SUPABASE_SERVICE_KEY = "service-key";
  assert.equal(getSupabaseConfig(), null);
});
