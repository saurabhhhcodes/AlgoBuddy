const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

test('Support popup close button has an accessible label', () => {
  const filePath = path.resolve(__dirname, '..', 'src', 'app', 'components', 'support.jsx');
  const content = fs.readFileSync(filePath, 'utf8');

  assert.match(
    content,
    /aria-label=\"Close support popup\"/,
    'support popup close button should have a descriptive aria-label',
  );

  assert.match(
    content,
    /type=\"button\"/,
    'support popup close button should explicitly be a button',
  );
});
