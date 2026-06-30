/**
 * Unit tests for the BoundedMap utility in arena-socket-server/index.js.
 * Uses an inlined copy so we can validate the eviction and Map semantics
 * without booting the socket server.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

class BoundedMap {
  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
    this._map = new Map();
  }
  get(key) {
    return this._map.get(key);
  }
  set(key, value) {
    const hadKey = this._map.has(key);
    const previous = hadKey ? this._map.get(key) : undefined;
    if (hadKey) {
      this._map.delete(key);
    } else if (this._map.size >= this.maxSize) {
      const oldest = this._map.keys().next().value;
      if (oldest !== undefined) this._map.delete(oldest);
    }
    this._map.set(key, value);
    return previous;
  }
  delete(key) {
    return this._map.delete(key);
  }
  clear() {
    this._map.clear();
  }
  entries() {
    return this._map.entries();
  }
  get size() {
    return this._map.size;
  }
}

test("BoundedMap set returns the previous value when key exists", () => {
  const map = new BoundedMap(3);

  assert.equal(map.set("alpha", 1), undefined);
  assert.equal(map.set("alpha", 2), 1);
  assert.equal(map.get("alpha"), 2);
});

test("BoundedMap evicts the oldest entry when maxSize is exceeded", () => {
  const map = new BoundedMap(2);

  map.set("a", 1);
  map.set("b", 2);
  map.set("c", 3);

  assert.equal(map.get("a"), undefined);
  assert.equal(map.get("b"), 2);
  assert.equal(map.get("c"), 3);
  assert.equal(map.size, 2);
});

test("BoundedMap delete returns true for existing keys and false otherwise", () => {
  const map = new BoundedMap(2);

  map.set("a", 1);
  assert.equal(map.delete("a"), true);
  assert.equal(map.delete("missing"), false);
  assert.equal(map.size, 0);
});

test("BoundedMap get returns undefined for missing keys", () => {
  const map = new BoundedMap(2);

  assert.equal(map.get("missing"), undefined);
});

test("BoundedMap clear removes all entries", () => {
  const map = new BoundedMap(2);

  map.set("a", 1);
  map.set("b", 2);
  map.clear();

  assert.equal(map.size, 0);
  assert.deepEqual([...map.entries()], []);
});
