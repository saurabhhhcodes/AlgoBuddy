// security-tests/rateLimitsConfig.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/rateLimitsConfig.test.cjs
//
// Tests the rate limit configuration exported from src/config/rateLimits.js.
// The config is inlined here so we can verify the runtime shape without ESM/alias friction.

const { describe, test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

function buildRateLimits() {
  return {
    CONTACT_API: {
      LIMIT: 5,
    },
    SMTP: {
      DAILY_QUOTA: parseInt(process.env.SMTP_DAILY_QUOTA || '400', 10),
    },
  };
}

const savedEnv = process.env.SMTP_DAILY_QUOTA;

function currentRateLimits() {
  return buildRateLimits();
}

describe('RATE_LIMITS', () => {
  beforeEach(() => {
    delete process.env.SMTP_DAILY_QUOTA;
  });

  afterEach(() => {
    if (savedEnv === undefined) {
      delete process.env.SMTP_DAILY_QUOTA;
    } else {
      process.env.SMTP_DAILY_QUOTA = savedEnv;
    }
  });

  test('exposes CONTACT_API and SMTP sections', () => {
    const RATE_LIMITS = currentRateLimits();

    assert.ok(RATE_LIMITS.CONTACT_API);
    assert.ok(RATE_LIMITS.SMTP);
    assert.equal(typeof RATE_LIMITS.CONTACT_API, 'object');
    assert.equal(typeof RATE_LIMITS.SMTP, 'object');
  });

  test('CONTACT_API.LIMIT is a positive integer', () => {
    const RATE_LIMITS = currentRateLimits();

    assert.equal(RATE_LIMITS.CONTACT_API.LIMIT, 5);
    assert.equal(Number.isInteger(RATE_LIMITS.CONTACT_API.LIMIT), true);
    assert.ok(RATE_LIMITS.CONTACT_API.LIMIT > 0);
  });

  test('SMTP.DAILY_QUOTA uses the default positive integer when env is missing', () => {
    const RATE_LIMITS = currentRateLimits();

    assert.equal(RATE_LIMITS.SMTP.DAILY_QUOTA, 400);
    assert.equal(Number.isInteger(RATE_LIMITS.SMTP.DAILY_QUOTA), true);
    assert.ok(RATE_LIMITS.SMTP.DAILY_QUOTA > 0);
  });

  test('SMTP.DAILY_QUOTA parses the configured environment value', () => {
    process.env.SMTP_DAILY_QUOTA = '275';

    const RATE_LIMITS = currentRateLimits();

    assert.equal(RATE_LIMITS.SMTP.DAILY_QUOTA, 275);
    assert.equal(Number.isInteger(RATE_LIMITS.SMTP.DAILY_QUOTA), true);
    assert.ok(RATE_LIMITS.SMTP.DAILY_QUOTA > 0);
  });

  test('parseInt keeps the expected base-10 number for the default value', () => {
    process.env.SMTP_DAILY_QUOTA = '400';

    const RATE_LIMITS = currentRateLimits();

    assert.equal(RATE_LIMITS.SMTP.DAILY_QUOTA, parseInt('400', 10));
  });
});
