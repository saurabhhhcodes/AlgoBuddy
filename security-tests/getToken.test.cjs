/**
 * Unit tests for the getToken helper logic from src/utils/auth.js.
 * Uses an inlined copy of the helper and stubs a Supabase client so the tests
 * stay focused on the token extraction behavior.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

async function getToken(supabase) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

function createSupabaseStub(session) {
  return {
    auth: {
      getSession: async () => ({
        data: { session },
      }),
    },
  };
}

test("getToken returns the access token when a session exists", async () => {
  const supabase = createSupabaseStub({ access_token: "token-123" });

  assert.equal(await getToken(supabase), "token-123");
});

test("getToken returns null when the session is missing", async () => {
  const supabase = createSupabaseStub(null);

  assert.equal(await getToken(supabase), null);
});

test("getToken returns null when the session has no access token", async () => {
  const supabase = createSupabaseStub({});

  assert.equal(await getToken(supabase), null);
});
