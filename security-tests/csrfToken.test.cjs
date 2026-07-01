const { describe, test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');

const modulePath = resolve(__dirname, '..', 'src', 'lib', 'csrfToken.js');

async function loadCsrfTokenModule(cacheBust = '') {
  return import(pathToFileURL(modulePath).href + cacheBust);
}

function snapshotEnv() {
  return {
    nodeEnv: process.env.NODE_ENV,
    csrfSecret: process.env.CSRF_SECRET,
  };
}

function restoreEnv(snapshot) {
  process.env.NODE_ENV = snapshot.nodeEnv;
  if (snapshot.csrfSecret === undefined) {
    delete process.env.CSRF_SECRET;
  } else {
    process.env.CSRF_SECRET = snapshot.csrfSecret;
  }
}

describe('csrfToken helper', () => {
  let env;

  beforeEach(() => {
    env = snapshotEnv();
  });

  afterEach(() => {
    restoreEnv(env);
  });

  test('fallback development secret stays stable across fresh module loads', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.CSRF_SECRET;

    const first = await loadCsrfTokenModule('?run=1');
    const second = await loadCsrfTokenModule('?run=2');

    const token = await first.generateCsrfToken();
    assert.equal(await second.validateCsrfTokenEdge(token), true);
  });

  test('explicit CSRF_SECRET still signs and validates correctly', async () => {
    process.env.NODE_ENV = 'development';
    process.env.CSRF_SECRET = 'integration-test-secret';

    const csrf = await loadCsrfTokenModule('?run=3');
    const token = await csrf.generateCsrfToken();
    assert.equal(await csrf.validateCsrfTokenEdge(token), true);
  });

  test('production mode rejects missing CSRF_SECRET', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.CSRF_SECRET;

    const csrf = await loadCsrfTokenModule('?run=4');
    await assert.rejects(csrf.generateCsrfToken(), /CSRF_SECRET must be set in production/);
  });
});
