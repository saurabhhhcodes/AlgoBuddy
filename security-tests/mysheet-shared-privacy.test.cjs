const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sharedRoutePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "api",
  "mysheet",
  "shared",
  "[userId]",
  "route.js",
);
const cloneRoutePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "api",
  "mysheet",
  "clone",
  "[sharedUserId]",
  "route.js",
);
const sharingHelperPath = path.join(
  __dirname,
  "..",
  "src",
  "lib",
  "mysheetSharing.js",
);

test("shared mysheet route authenticates and strips private notes for non-owners", () => {
  const route = fs.readFileSync(sharedRoutePath, "utf8");

  assert.match(
    route,
    /import\s+\{\s*getAuthenticatedUser\s*\}\s+from\s+["']@\/lib\/auth["']/,
  );
  assert.match(route, /canViewPrivateSheetNotes/);
  assert.match(route, /mapSharedSheetItems/);
  assert.match(route, /includePrivateNotes/);
  assert.doesNotMatch(route, /note:\s*row\.note/);
});

test("clone mysheet route does not copy another user's private notes", () => {
  const route = fs.readFileSync(cloneRoutePath, "utf8");

  assert.match(route, /getAuthenticatedUser/);
  assert.doesNotMatch(route, /note:\s*item\.note/);
});

test("mysheet sharing helper omits notes unless explicitly allowed", async () => {
  const { mapSharedSheetItems, canViewPrivateSheetNotes } = await import(
  `file://${sharingHelperPath}`
  );

  const rows = [
    {
      problem_id: "two-sum",
      added_at: "2026-06-18T00:00:00.000Z",
      note: "private kadane notes",
    },
  ];

  assert.deepEqual(mapSharedSheetItems(rows), [
    {
      problemId: "two-sum",
      addedAt: "2026-06-18T00:00:00.000Z",
      note: "",
    },
  ]);

  assert.deepEqual(
    mapSharedSheetItems(rows, { includePrivateNotes: true }),
    [
      {
        problemId: "two-sum",
        addedAt: "2026-06-18T00:00:00.000Z",
        note: "private kadane notes",
      },
    ],
  );

  assert.equal(
    canViewPrivateSheetNotes(
      { success: true, user: { id: "owner-1" } },
      "owner-1",
    ),
    true,
  );
  assert.equal(
    canViewPrivateSheetNotes(
      { success: true, user: { id: "viewer-2" } },
      "owner-1",
    ),
    false,
  );
  assert.equal(canViewPrivateSheetNotes({ success: false }, "owner-1"), false);
});
