const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Queue Quiz appears in the centralized quiz portal", () => {
  const filePath = path.resolve(__dirname, "..", "src", "app", "visualizer", "quiz", "page.jsx");
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /Queue Operations Quiz/);
  assert.match(content, /\/visualizer\/queue\/operations\/quiz/);
  assert.match(content, /queue_operations_quiz\.js/);
});

test("Queue enqueue-dequeue page no longer embeds its own quiz", () => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "visualizer",
    "queue",
    "operations",
    "enqueue-dequeue",
    "AlgorithmClient.jsx",
  );
  const content = fs.readFileSync(filePath, "utf8");

  assert.doesNotMatch(content, /quiz={<Quiz \/>}/);
  assert.doesNotMatch(content, /import Quiz from/);
});
