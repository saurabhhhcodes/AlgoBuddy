import { describe, expect, test } from "@jest/globals";
import { buildQuizCards, quizCatalog } from "../src/app/visualizer/quiz/quizData.js";

describe("quiz card grouping", () => {
  test("groups all sorting quizzes under a single Sorting Quiz card", () => {
    const cards = buildQuizCards("");
    const sortingCard = cards.find((card) => card.type === "group" && card.title === "Sorting Quiz");

    expect(sortingCard).toBeTruthy();
    expect(sortingCard.items).toHaveLength(8);
    expect(sortingCard.items.map((item) => item.title)).toEqual([
      "Bubble Sort Quiz",
      "Selection Sort Quiz",
      "Insertion Sort Quiz",
      "Merge Sort Quiz",
      "Quick Sort Quiz",
      "Heap Sort Quiz",
      "Radix Sort Quiz",
      "Counting Sort Quiz",
    ]);

    expect(cards.some((card) => card.title === "Bubble Sort Quiz")).toBe(false);
    expect(cards.some((card) => card.title === "Linear Search Quiz")).toBe(true);
  });

  test("filters grouped quizzes by search text without losing the sort hub", () => {
    const cards = buildQuizCards("bubble");
    const sortingCard = cards.find((card) => card.type === "group");

    expect(sortingCard).toBeTruthy();
    expect(sortingCard.items).toHaveLength(1);
    expect(sortingCard.items[0].title).toBe("Bubble Sort Quiz");
    expect(cards.some((card) => card.title === "Linear Search Quiz")).toBe(false);
  });

  test("catalog keeps the original quiz inventory intact", () => {
    expect(quizCatalog).toHaveLength(19);
    expect(quizCatalog.every((quiz) => typeof quiz.title === "string" && quiz.title.length > 0)).toBe(true);
  });
});
