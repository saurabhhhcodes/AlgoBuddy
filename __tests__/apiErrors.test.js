import { describe, expect, test } from "@jest/globals";
import {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} from "../src/lib/apiErrors.js";

describe("ApiError class hierarchy", () => {
  test("ApiError sets its defaults and keeps Error inheritance", () => {
    const error = new ApiError("Something went wrong");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("Something went wrong");
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.status).toBe(500);
  });

  test("specialized errors set their default code, status, and names", () => {
    const authError = new AuthError();
    const rateLimitError = new RateLimitError();
    const validationError = new ValidationError();
    const configError = new ConfigError();

    expect(authError).toBeInstanceOf(ApiError);
    expect(authError.name).toBe("AuthError");
    expect(authError.message).toBe("Unauthorized");
    expect(authError.code).toBe("AUTH_ERROR");
    expect(authError.status).toBe(401);

    expect(rateLimitError).toBeInstanceOf(ApiError);
    expect(rateLimitError.name).toBe("RateLimitError");
    expect(rateLimitError.message).toBe("Too many requests");
    expect(rateLimitError.code).toBe("RATE_LIMIT");
    expect(rateLimitError.status).toBe(429);

    expect(validationError).toBeInstanceOf(ApiError);
    expect(validationError.name).toBe("ValidationError");
    expect(validationError.message).toBe("Validation failed");
    expect(validationError.code).toBe("VALIDATION_ERROR");
    expect(validationError.status).toBe(400);

    expect(configError).toBeInstanceOf(ApiError);
    expect(configError.name).toBe("ConfigError");
    expect(configError.message).toBe("Server configuration error");
    expect(configError.code).toBe("CONFIG_ERROR");
    expect(configError.status).toBe(500);
  });

  test("specialized errors keep custom messages while preserving defaults", () => {
    expect(new AuthError("Denied")).toMatchObject({
      name: "AuthError",
      message: "Denied",
      code: "AUTH_ERROR",
      status: 401,
    });

    expect(new RateLimitError("Slow down")).toMatchObject({
      name: "RateLimitError",
      message: "Slow down",
      code: "RATE_LIMIT",
      status: 429,
    });

    expect(new ValidationError("Invalid payload")).toMatchObject({
      name: "ValidationError",
      message: "Invalid payload",
      code: "VALIDATION_ERROR",
      status: 400,
    });

    expect(new ConfigError("Missing env")).toMatchObject({
      name: "ConfigError",
      message: "Missing env",
      code: "CONFIG_ERROR",
      status: 500,
    });
  });
});
