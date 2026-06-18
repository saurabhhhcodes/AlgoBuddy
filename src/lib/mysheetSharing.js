export function mapSharedSheetItems(rows, { includePrivateNotes = false } = {}) {
  return (rows || []).map((row) => ({
    problemId: row.problem_id,
    addedAt: row.added_at,
    note: includePrivateNotes ? row.note || "" : "",
  }));
}

export function canViewPrivateSheetNotes(authResult, ownerUserId) {
  return Boolean(
    authResult?.success &&
      ownerUserId &&
      authResult.user?.id === ownerUserId,
  );
}
