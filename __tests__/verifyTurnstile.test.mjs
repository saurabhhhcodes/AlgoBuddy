import { verifyTurnstile } from "../src/lib/verifyTurnstile";

const realFetch = global.fetch;

beforeEach(() => {
  jest.resetAllMocks();
  process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
});

afterAll(() => {
  global.fetch = realFetch;
});

describe("verifyTurnstile", () => {
  test("rejects missing token", async () => {
    const result = await verifyTurnstile("");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/missing/i);
  });

  test("rejects null token", async () => {
    const result = await verifyTurnstile(null);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/missing/i);
  });

  test("rejects token after successful verification on second call (replay protection)", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const first = await verifyTurnstile("token-replay-1");
    expect(first.ok).toBe(true);

    const second = await verifyTurnstile("token-replay-1");
    expect(second.ok).toBe(false);
    expect(second.error).toMatch(/already used/i);
  });

  test("allows different tokens independently", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const a1 = await verifyTurnstile("token-a");
    const b1 = await verifyTurnstile("token-b");
    expect(a1.ok).toBe(true);
    expect(b1.ok).toBe(true);
  });

  test("returns error on fetch failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network failure"));

    const result = await verifyTurnstile("some-token");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/failed/i);
  });

  test("returns error on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await verifyTurnstile("some-token");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/failed/i);
  });

  test("returns error when Cloudflare verification fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
    });

    const result = await verifyTurnstile("bad-token");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/failed/i);
  });

  test("returns appropriate message for timeout-or-duplicate error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    });

    const result = await verifyTurnstile("stale-token");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/expired|already used/i);
  });
});
