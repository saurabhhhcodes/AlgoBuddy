"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ArrayInterviewPatternsQuiz = () => {
  const questions = [
    {
      question: "Which pattern is best suited for finding a pair of numbers that meet a target in a sorted array?",
      options: [
        "Greedy traversal",
        "Two pointers",
        "Depth-first search",
        "Topological sort"
      ],
      correctAnswer: 1,
      explanation: "Two pointers work well on sorted arrays because the left and right positions can be adjusted based on whether the current sum is too small or too large."
    },
    {
      question: "What is the main idea behind the sliding window technique?",
      options: [
        "Sort the array first",
        "Keep a fixed-size heap",
        "Expand and contract a window over a contiguous segment",
        "Always recurse on half the input"
      ],
      correctAnswer: 2,
      explanation: "Sliding window tracks a contiguous range and adjusts its boundaries to maintain a useful property, such as a sum or frequency limit."
    },
    {
      question: "Which algorithm is commonly used to find the maximum subarray sum?",
      options: [
        "Kadane's algorithm",
        "Dijkstra's algorithm",
        "Prim's algorithm",
        "Kruskal's algorithm"
      ],
      correctAnswer: 0,
      explanation: "Kadane's algorithm keeps a running best subarray sum and resets when extending the current prefix no longer helps."
    },
    {
      question: "Why are prefix sums useful in array interview problems?",
      options: [
        "They let us answer range sum queries quickly",
        "They automatically sort the array",
        "They remove the need for arrays",
        "They guarantee constant space"
      ],
      correctAnswer: 0,
      explanation: "Prefix sums turn repeated range-sum computations into O(1) lookups after a one-time preprocessing pass."
    },
    {
      question: "When should you usually avoid a sliding window and consider a different technique?",
      options: [
        "When the array is contiguous",
        "When the problem has a non-contiguous constraint",
        "When the input size is even",
        "When the target is numeric"
      ],
      correctAnswer: 1,
      explanation: "Sliding window is strongest for contiguous subarray or substring problems. If the constraint is non-contiguous, another approach is usually needed."
    }
  ];

  return <QuizEngine title="Array Interview Patterns Quiz Challenge" questions={questions} />;
};

export default ArrayInterviewPatternsQuiz;
