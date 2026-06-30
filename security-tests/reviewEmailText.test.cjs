// security-tests/reviewEmailText.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/reviewEmailText.test.cjs
//
// Tests the plain-text review email body builder used by src/app/api/send-review/route.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('buildReviewTextBody', () => {
  test('builds a readable plain-text email body', async () => {
    const { buildReviewTextBody } = await import('../src/lib/reviewEmail.js');

    assert.equal(
      buildReviewTextBody({
        name: 'Ava',
        email: 'ava@example.com',
        rating: 4,
        review: 'Great app\nLoved the practice flow',
      }),
      [
        'New Review Received',
        '',
        'Name: Ava',
        'Email: ava@example.com',
        'Rating: ★★★★☆',
        'Review:',
        'Great app',
        'Loved the practice flow',
      ].join('\n')
    );
  });

  test('keeps the rating visualization bounded to five stars', async () => {
    const { buildReviewTextBody } = await import('../src/lib/reviewEmail.js');

    const body = buildReviewTextBody({
      name: 'Nova',
      email: 'nova@example.com',
      rating: 1,
      review: 'Short note',
    });

    assert.match(body, /Rating: ★☆☆☆☆/);
    assert.doesNotMatch(body, /★★★★★★/);
  });
});
