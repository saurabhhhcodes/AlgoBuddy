import { PersistenceManager, STORAGE_KEYS } from "@/lib/persistence";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      upsert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

describe("PersistenceManager", () => {
  let persistenceManager;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    persistenceManager = new (require("@/lib/persistence").PersistenceManager)();
  });

  describe("get", () => {
    it("returns null when key does not exist", async () => {
      const result = await persistenceManager.get("PRACTICE_PROGRESS");
      expect(result).toBeNull();
    });

    it("returns parsed value from localStorage", async () => {
      localStorageMock.setItem("algobuddy_practice_progress", JSON.stringify({ problem1: { status: "completed" } }));
      const result = await persistenceManager.get("PRACTICE_PROGRESS");
      expect(result).toEqual({ problem1: { status: "completed" } });
    });

    it("returns null for invalid JSON", async () => {
      localStorageMock.setItem("algobuddy_practice_progress", "invalid json");
      const result = await persistenceManager.get("PRACTICE_PROGRESS");
      expect(result).toBeNull();
    });
  });

  describe("set", () => {
    it("stores value in localStorage", () => {
      persistenceManager.set("PRACTICE_PROGRESS", { problem1: { status: "completed" } });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "algobuddy_practice_progress",
        JSON.stringify({ problem1: { status: "completed" } })
      );
    });
  });

  describe("remove", () => {
    it("removes key from localStorage", () => {
      persistenceManager.remove("PRACTICE_PROGRESS");
      expect(localStorage.removeItem).toHaveBeenCalledWith("algobuddy_practice_progress");
    });
  });

  describe("loadFromServer", () => {
    it("returns null when no userId", async () => {
      const result = await persistenceManager.loadFromServer("practice_progress", null);
      expect(result).toBeNull();
    });

    it("calls supabase with correct parameters", async () => {
      const mockSupabase = require("@/lib/supabase").supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null })),
        })),
      });

      const result = await persistenceManager.loadFromServer("practice_progress", "user123");
      expect(result).toEqual([{ id: 1 }]);
    });

    it("returns null on error", async () => {
      const mockSupabase = require("@/lib/supabase").supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: { message: "Error" } })),
        })),
      });

      const result = await persistenceManager.loadFromServer("practice_progress", "user123");
      expect(result).toBeNull();
    });
  });

  describe("syncToServer", () => {
    it("calls supabase upsert", async () => {
      const mockSupabase = require("@/lib/supabase").supabase;
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn(() => Promise.resolve({ error: null })),
      });

      await persistenceManager.syncToServer("practice_progress", [{ problem_id: "1", status: "completed" }]);
      expect(mockSupabase.from).toHaveBeenCalledWith("practice_progress");
    });

    it("handles error gracefully", async () => {
      const mockSupabase = require("@/lib/supabase").supabase;
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn(() => Promise.resolve({ error: { message: "Error" } })),
      });

      await expect(persistenceManager.syncToServer("practice_progress", [{ problem_id: "1" }]))
        .resolves.not.toThrow();
    });
  });

  describe("mergeProgress", () => {
    it("prefers server data when newer", () => {
      const local = {
        "problem1": { status: "completed", updatedAt: "2024-01-01T00:00:00Z" },
      };
      const server = [
        { problem_id: "problem1", status: "in_progress", updated_at: "2024-01-02T00:00:00Z" },
      ];

      const merged = persistenceManager.mergeProgress(local, server, "user123");
      expect(merged.problem1.status).toBe("in_progress");
    });

    it("keeps local data when newer", () => {
      const local = {
        "problem1": { status: "completed", updatedAt: "2024-01-02T00:00:00Z" },
      };
      const server = [
        { problem_id: "problem1", status: "in_progress", updated_at: "2024-01-01T00:00:00Z" },
      ];

      const merged = persistenceManager.mergeProgress(local, server, "user123");
      expect(merged.problem1.status).toBe("completed");
    });

    it("handles empty server data", () => {
      const local = { "problem1": { status: "completed", updatedAt: "2024-01-01T00:00:00Z" } };
      const merged = persistenceManager.mergeProgress(local, [], "user123");
      expect(merged).toEqual(local);
    });

    it("handles empty local data", () => {
      const server = [{ problem_id: "problem1", status: "completed", updated_at: "2024-01-01T00:00:00Z" }];
      const merged = persistenceManager.mergeProgress({}, server, "user123");
      expect(merged.problem1.status).toBe("completed");
    });
  });

  describe("mergeBookmarks", () => {
    it("merges local and server bookmarks", () => {
      const local = [{ id: "1", name: "local" }];
      const server = [{ id: "2", name: "server" }];

      const merged = persistenceManager.mergeBookmarks(local, server, "id");
      expect(merged).toHaveLength(2);
    });

    it("prefers server data on conflict", () => {
      const local = [{ id: "1", name: "local" }];
      const server = [{ id: "1", name: "server" }];

      const merged = persistenceManager.mergeBookmarks(local, server, "id");
      expect(merged).toHaveLength(1);
      expect(merged[0].name).toBe("server");
    });

    it("handles empty arrays", () => {
      const merged = persistenceManager.mergeBookmarks([], [], "id");
      expect(merged).toEqual([]);
    });

    it("uses problem_id as fallback idField", () => {
      const local = [{ problem_id: "1", name: "local" }];
      const server = [{ problem_id: "2", name: "server" }];

      const merged = persistenceManager.mergeBookmarks(local, server, "id");
      expect(merged).toHaveLength(2);
    });
  });
});