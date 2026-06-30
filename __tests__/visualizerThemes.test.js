import { describe, expect, test } from "@jest/globals";
import {
  VISUALIZER_THEMES,
  getCardTheme,
  getThemeClasses,
  getVisualizerTheme,
} from "../src/lib/visualizerThemes.js";

describe("visualizerThemes helper functions", () => {
  test("returns matching themes and safe fallbacks", () => {
    expect(getVisualizerTheme("Array")).toBe(VISUALIZER_THEMES.Array);
    expect(getVisualizerTheme("Unknown theme")).toBe(VISUALIZER_THEMES.Array);
  });

  test("merges light and dark classes for the requested key", () => {
    expect(getThemeClasses("Array")).toBe("bg-purple-100 dark:bg-purple-950/50");
    expect(getThemeClasses("Array", "text")).toBe("text-purple-900 dark:text-purple-100");
    expect(getThemeClasses("Unknown theme", "border")).toBe("border-purple-200 dark:border-purple-500/20");
  });

  test("builds card theme objects with extracted background details", () => {
    expect(getCardTheme("Array")).toEqual({
      color: "#a435f0",
      bgClasses: "bg-purple-100 dark:bg-purple-950/50",
      surfaceClasses: "bg-purple-50 dark:bg-purple-950/40",
      borderClasses: "border-purple-200 dark:border-purple-500/20",
      textClasses: "text-purple-900 dark:text-purple-100",
      lightBg: "purple-100",
      darkBgStyle: "dark:bg-purple-950/50",
      border: "border-purple-500/20",
    });

    expect(getCardTheme("Unknown theme")).toEqual(getCardTheme("Array"));
  });
});
