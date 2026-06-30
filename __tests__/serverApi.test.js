import { beforeAll, describe, expect, test } from "@jest/globals";

class MockHeaders {
  constructor(init = {}) {
    this.map = new Map(
      Object.entries(init).map(([key, value]) => [key.toLowerCase(), value]),
    );
  }

  get(name) {
    return this.map.get(String(name).toLowerCase()) ?? null;
  }
}

class MockResponse {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status ?? 200;
    this.headers = new MockHeaders(init.headers);
  }

  async json() {
    return this._body;
  }

  static json(body, init = {}) {
    return new MockResponse(body, init);
  }
}

globalThis.Response = MockResponse;

let jsonResponse;
let errorResponse;

beforeAll(async () => {
  ({ jsonResponse, errorResponse } = await import("../src/lib/serverApi.js"));
});

describe("serverApi response helpers", () => {
  test("jsonResponse returns JSON with the default status and content type", async () => {
    const response = jsonResponse({ ok: true });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  test("jsonResponse supports custom status codes and extra headers", async () => {
    const response = jsonResponse(
      { created: true },
      201,
      { "x-request-id": "abc-123" },
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("x-request-id")).toBe("abc-123");
    await expect(response.json()).resolves.toEqual({ created: true });
  });

  test("errorResponse normalizes message, code, and status defaults", async () => {
    const response = errorResponse({ message: "Nope", code: "BAD_THING", status: 418 });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(418);
    await expect(response.json()).resolves.toEqual({
      error: "Nope",
      code: "BAD_THING",
    });

    const fallbackResponse = errorResponse({});
    expect(fallbackResponse.status).toBe(500);
    await expect(fallbackResponse.json()).resolves.toEqual({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  });
});
