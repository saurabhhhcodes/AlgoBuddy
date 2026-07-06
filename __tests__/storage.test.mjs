import { saveToStorage, loadFromStorage, removeFromStorage } from "../src/utils/storage";

beforeEach(() => {
  localStorage.clear();
});

describe("saveToStorage", () => {
  test("stores stringified value in localStorage", () => {
    saveToStorage("theme", "dark");
    expect(localStorage.getItem("theme")).toBe('"dark"');
  });

  test("stores objects correctly", () => {
    const data = { a: 1, b: [2, 3] };
    saveToStorage("data", data);
    expect(JSON.parse(localStorage.getItem("data"))).toEqual(data);
  });

  test("overwrites existing key", () => {
    saveToStorage("key", "first");
    saveToStorage("key", "second");
    expect(JSON.parse(localStorage.getItem("key"))).toBe("second");
  });
});

describe("loadFromStorage", () => {
  test("retrieves stored value", () => {
    localStorage.setItem("name", JSON.stringify("AlgoBuddy"));
    expect(loadFromStorage("name", "default")).toBe("AlgoBuddy");
  });

  test("returns fallback for missing key", () => {
    expect(loadFromStorage("nonexistent", 42)).toBe(42);
  });

  test("returns fallback for invalid JSON", () => {
    localStorage.setItem("bad", "not-json");
    expect(loadFromStorage("bad", "fallback")).toBe("fallback");
  });

  test("returns parsed objects", () => {
    const obj = { x: 1, y: 2 };
    localStorage.setItem("obj", JSON.stringify(obj));
    expect(loadFromStorage("obj", null)).toEqual(obj);
  });

  test("returns array fallback", () => {
    expect(loadFromStorage("missing", [])).toEqual([]);
  });
});

describe("removeFromStorage", () => {
  test("removes existing key", () => {
    localStorage.setItem("temp", "value");
    removeFromStorage("temp");
    expect(localStorage.getItem("temp")).toBeNull();
  });

  test("does not throw for non-existent key", () => {
    expect(() => removeFromStorage("does-not-exist")).not.toThrow();
  });
});
