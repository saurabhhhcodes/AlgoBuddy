"use client";

import QuizEngine from "@/components/quiz/QuizEngine";

const questions = [
  {
    question: "What is the primary purpose of the Z Algorithm?",
    options: [
      "Sorting an array",
      "Pattern matching in strings",
      "Finding shortest paths",
      "Balancing trees",
    ],
    answer: "Pattern matching in strings",
    explanation:
      "The Z Algorithm is used for efficient string pattern matching by constructing a Z-array.",
  },
  {
    question: "What does the Z-array store?",
    options: [
      "Character frequencies",
      "Length of the longest substring matching the prefix",
      "ASCII values",
      "Hash values",
    ],
    answer: "Length of the longest substring matching the prefix",
    explanation:
      "Each Z[i] represents the length of the longest substring starting at i that matches the prefix.",
  },
  {
    question: "What is the time complexity of the Z Algorithm?",
    options: [
      "O(n²)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
    ],
    answer: "O(n)",
    explanation:
      "The Z Algorithm computes the Z-array in linear time.",
  },
  {
    question: "Which data structure is mainly used by the Z Algorithm?",
    options: [
      "Stack",
      "Queue",
      "Array",
      "Heap",
    ],
    answer: "Array",
    explanation:
      "The algorithm stores prefix-match lengths in a Z-array.",
  },
  {
    question: "What is the Z-box?",
    options: [
      "A hash table",
      "A matching interval [L, R]",
      "A linked list",
      "A recursion stack",
    ],
    answer: "A matching interval [L, R]",
    explanation:
      "The Z-box keeps track of the current substring matching the prefix.",
  },
  {
    question: "Which pointers define the Z-box?",
    options: [
      "Start and End",
      "Left and Right",
      "Front and Rear",
      "Low and High",
    ],
    answer: "Left and Right",
    explanation:
      "The Z-box is maintained using Left (L) and Right (R) pointers.",
  },
  {
    question: "The Z Algorithm is mainly used for:",
    options: [
      "Graph traversal",
      "Dynamic programming",
      "Exact string matching",
      "Binary search",
    ],
    answer: "Exact string matching",
    explanation:
      "It efficiently finds exact occurrences of a pattern in a text.",
  },
  {
    question: "Which string is commonly constructed before computing the Z-array?",
    options: [
      "Text + Pattern",
      "Pattern + '$' + Text",
      "Pattern + Pattern",
      "Text + Text",
    ],
    answer: "Pattern + '$' + Text",
    explanation:
      "A separator is added to prevent unwanted matches across the boundary.",
  },
  {
    question: "When is a pattern match found?",
    options: [
      "When Z[i] = 0",
      "When Z[i] equals the pattern length",
      "When Z[i] = i",
      "When Z[i] is negative",
    ],
    answer: "When Z[i] equals the pattern length",
    explanation:
      "A complete pattern match occurs when the Z-value equals the pattern length.",
  },
  {
    question: "Worst-case time complexity of the Z Algorithm is:",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(n)",
      "O(log n)",
    ],
    answer: "O(n)",
    explanation:
      "The algorithm guarantees linear performance in every case.",
  },
  {
    question: "Which of these is an application of the Z Algorithm?",
    options: [
      "Image Compression",
      "Pattern Searching",
      "Database Indexing",
      "Heap Construction",
    ],
    answer: "Pattern Searching",
    explanation:
      "The Z Algorithm is widely used in efficient string searching.",
  },
  {
    question: "How much extra space does the Z Algorithm require?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    answer: "O(n)",
    explanation:
      "An additional Z-array of size n is required.",
  },
  {
    question: "Which algorithm has the same linear time complexity for pattern matching?",
    options: [
      "Bubble Sort",
      "KMP Algorithm",
      "Selection Sort",
      "DFS",
    ],
    answer: "KMP Algorithm",
    explanation:
      "Both KMP and Z Algorithm solve string matching in linear time.",
  },
  {
    question: "The Z Algorithm avoids:",
    options: [
      "Arrays",
      "Repeated character comparisons",
      "Loops",
      "Functions",
    ],
    answer: "Repeated character comparisons",
    explanation:
      "Previously computed information is reused to avoid unnecessary comparisons.",
  },
  {
    question: "Which statement about the Z Algorithm is correct?",
    options: [
      "It is only for sorting.",
      "It is a linear-time string matching algorithm.",
      "It only works on integers.",
      "It requires recursion.",
    ],
    answer: "It is a linear-time string matching algorithm.",
    explanation:
      "The Z Algorithm efficiently performs exact pattern matching in O(n) time.",
  },
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Z Algorithm Quiz"
      description="Test your understanding of the Z Algorithm, Z-array construction, pattern matching, time complexity, and real-world applications."
      questions={questions}
      algorithm="Z Algorithm"
      difficulty="Medium"
    />
  );
}