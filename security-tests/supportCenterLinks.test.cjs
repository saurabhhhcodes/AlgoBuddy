// security-tests/supportCenterLinks.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/supportCenterLinks.test.cjs
//
// Static route check for the Support Center placeholder links.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('support center links point to real routes', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'components', 'support.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(content, /href="\/faq"/);
  assert.match(content, /href="\/community"/);
  assert.doesNotMatch(content, /javascript:void\(0\)/);
});
