export function buildReviewTextBody({ name, email, rating, review }) {
  return [
    'New Review Received',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`,
    'Review:',
    review,
  ].join('\n');
}
