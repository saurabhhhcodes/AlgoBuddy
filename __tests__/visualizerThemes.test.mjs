import { VISUALIZER_THEMES, getVisualizerTheme, getThemeClasses, getCardTheme } from "../src/lib/visualizerThemes";

describe("VISUALIZER_THEMES", () => {
  test("contains all 7 theme categories", () => {
    expect(Object.keys(VISUALIZER_THEMES)).toEqual([
      "Array", "Stack", "Queue", "Linked List", "Tree", "Graph", "AI Algorithms",
    ]);
  });

  test("each theme has required properties", () => {
    Object.values(VISUALIZER_THEMES).forEach((theme) => {
      expect(theme).toHaveProperty("name");
      expect(theme).toHaveProperty("color");
      expect(theme).toHaveProperty("light");
      expect(theme).toHaveProperty("dark");
      expect(theme).toHaveProperty("label");
      expect(typeof theme.name).toBe("string");
      expect(typeof theme.color).toBe("string");
    });
  });

  test("each theme has light and dark mode classes", () => {
    Object.values(VISUALIZER_THEMES).forEach((theme) => {
      ["bg", "surface", "border", "text", "accent", "iconBg"].forEach((key) => {
        expect(theme.light).toHaveProperty(key);
        expect(theme.dark).toHaveProperty(key);
      });
    });
  });

  test("all colors are valid hex codes", () => {
    Object.values(VISUALIZER_THEMES).forEach((theme) => {
      expect(theme.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  test("each theme has a non-empty label", () => {
    Object.values(VISUALIZER_THEMES).forEach((theme) => {
      expect(theme.label.length).toBeGreaterThan(0);
    });
  });
});

describe("getVisualizerTheme", () => {
  test("returns theme for valid name", () => {
    const theme = getVisualizerTheme("Array");
    expect(theme.name).toBe("Array");
    expect(theme.color).toBe("#a435f0");
  });

  test("returns Array theme for unknown name (fallback)", () => {
    const theme = getVisualizerTheme("NonExistent");
    expect(theme.name).toBe("Array");
  });

  test("returns Array theme for undefined", () => {
    const theme = getVisualizerTheme(undefined);
    expect(theme.name).toBe("Array");
  });

  test("returns Array theme for null", () => {
    const theme = getVisualizerTheme(null);
    expect(theme.name).toBe("Array");
  });
});

describe("getThemeClasses", () => {
  test("returns combined light and dark bg classes", () => {
    const classes = getThemeClasses("Array", "bg");
    expect(classes).toContain("bg-purple-100");
    expect(classes).toContain("dark:bg-purple-950/50");
  });

  test("returns empty string for missing key", () => {
    const classes = getThemeClasses("Array", "nonexistent");
    expect(classes).toBe("");
  });

  test("works for all themes", () => {
    Object.keys(VISUALIZER_THEMES).forEach((name) => {
      const classes = getThemeClasses(name, "bg");
      expect(classes.length).toBeGreaterThan(0);
    });
  });
});

describe("getCardTheme", () => {
  test("returns object with all required fields", () => {
    const card = getCardTheme("Array");
    expect(card).toHaveProperty("color");
    expect(card).toHaveProperty("bgClasses");
    expect(card).toHaveProperty("surfaceClasses");
    expect(card).toHaveProperty("borderClasses");
    expect(card).toHaveProperty("textClasses");
    expect(card).toHaveProperty("lightBg");
    expect(card).toHaveProperty("darkBgStyle");
    expect(card).toHaveProperty("border");
  });

  test("color matches theme", () => {
    expect(getCardTheme("Stack").color).toBe("#2563eb");
  });

  test("bgClasses contains both light and dark", () => {
    const card = getCardTheme("Queue");
    expect(card.bgClasses).toContain("bg-green-100");
    expect(card.bgClasses).toContain("dark:bg-green-950/50");
  });

  test("falls back to Array for unknown theme", () => {
    const card = getCardTheme("Unknown");
    expect(card.color).toBe("#a435f0");
  });
});
