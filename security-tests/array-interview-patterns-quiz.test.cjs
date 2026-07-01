const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Quiz Portal includes Array Interview Patterns quiz", () => {
  const filePath = path.resolve(__dirname, "..", "src", "app", "visualizer", "quiz", "page.jsx");
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /Array Interview Patterns Quiz/);
  assert.match(content, /\/visualizer\/array\/interview-patterns\/quiz/);
  assert.match(content, /array_interview_patterns_quiz\.js/);
});

test("Array Interview Patterns quiz has its own question set", () => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "visualizer",
    "array",
    "interview-patterns",
    "quiz",
    "quiz.jsx",
  );
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /ArrayInterviewPatternsQuiz/);
  assert.match(content, /QuizEngine/);
  assert.match(content, /two pointers/i);
  assert.match(content, /sliding window/i);
  assert.match(content, /Kadane/i);
});
