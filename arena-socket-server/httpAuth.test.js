const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { getBearerToken, requireBearerAuth } = require('./httpAuth');

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('getBearerToken', () => {
  test('extracts bearer tokens from Authorization headers', () => {
    assert.equal(getBearerToken('Bearer abc.def.ghi'), 'abc.def.ghi');
  });

  test('rejects missing or malformed authorization headers', () => {
    assert.equal(getBearerToken(null), null);
    assert.equal(getBearerToken(''), null);
    assert.equal(getBearerToken('Basic token'), null);
    assert.equal(getBearerToken('Bearer token extra'), null);
  });
});

describe('requireBearerAuth', () => {
  test('returns 401 when the request is missing a bearer token', async () => {
    const res = createRes();
    const result = await requireBearerAuth({ headers: {} }, res, async () => ({ sub: 'user-1' }));

    assert.equal(result, null);
    assert.equal(res.statusCode, 401);
    assert.deepStrictEqual(res.body, { error: 'Authentication required' });
  });

  test('returns 401 when token verification fails', async () => {
    const res = createRes();
    const result = await requireBearerAuth(
      { headers: { authorization: 'Bearer invalid-token' } },
      res,
      async () => null,
    );

    assert.equal(result, null);
    assert.equal(res.statusCode, 401);
    assert.deepStrictEqual(res.body, { error: 'Invalid or expired session' });
  });

  test('returns the auth payload when token verification succeeds', async () => {
    const res = createRes();
    const payload = { sub: 'user-123' };
    const result = await requireBearerAuth(
      { headers: { authorization: 'Bearer valid-token' } },
      res,
      async () => payload,
    );

    assert.deepStrictEqual(result, payload);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, null);
  });
});
