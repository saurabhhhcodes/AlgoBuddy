// security-tests/authSignupError.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/authSignupError.test.cjs
//
// Tests the signup error hardening helper and verifies the auth route uses it.

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

describe('getSafeSignupErrorMessage', () => {
  test('returns a generic client-facing message', async () => {
    const { getSafeSignupErrorMessage } = await import('../src/lib/authSignupError.js');

    assert.equal(
      getSafeSignupErrorMessage({ message: 'User already registered' }),
      'Signup failed. Please check your details and try again.'
    );
    assert.equal(
      getSafeSignupErrorMessage({ message: 'validation failed' }),
      'Signup failed. Please check your details and try again.'
    );
  });
});

describe('auth signup route hardening', () => {
  test('uses the safe signup helper instead of reflecting provider error text', () => {
    const routePath = path.resolve(__dirname, '..', 'src', 'app', 'api', 'auth', 'route.js');
    const content = fs.readFileSync(routePath, 'utf8');

    assert.match(content, /getSafeSignupErrorMessage/);
    assert.match(content, /console\.error\("\[\/api\/auth signup\] Supabase error:"/);
    assert.doesNotMatch(content, /return jsonResponse\(\{ success: false, message: error\.message \}, 400 \);/);
  });
});
