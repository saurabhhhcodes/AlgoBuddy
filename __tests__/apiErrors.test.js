import {
  ApiError,
  AuthError,
  RateLimitError,
  ValidationError,
  ConfigError,
} from "@/lib/apiErrors";

describe("ApiError", () => {
  it("creates error with default values", () => {
    const error = new ApiError("Something went wrong");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Something went wrong");
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.status).toBe(500);
    expect(error.name).toBe("ApiError");
  });

  it("creates error with custom code and status", () => {
    const error = new ApiError("Custom error", "CUSTOM_CODE", 400);
    expect(error.message).toBe("Custom error");
    expect(error.code).toBe("CUSTOM_CODE");
    expect(error.status).toBe(400);
  });

  it("can be thrown and caught", () => {
    expect(() => {
      throw new ApiError("Test error");
    }).toThrow(ApiError);
  });

  it("preserves stack trace", () => {
    const error = new ApiError("Test");
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ApiError");
  });
});

describe("AuthError", () => {
  it("creates error with default message", () => {
    const error = new AuthError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(AuthError);
    expect(error.message).toBe("Unauthorized");
    expect(error.code).toBe("AUTH_ERROR");
    expect(error.status).toBe(401);
    expect(error.name).toBe("AuthError");
  });

  it("creates error with custom message", () => {
    const error = new AuthError("Invalid token");
    expect(error.message).toBe("Invalid token");
    expect(error.code).toBe("AUTH_ERROR");
    expect(error.status).toBe(401);
  });

  it("is instance of ApiError", () => {
    const error = new AuthError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(AuthError);
  });

  it("can be checked with instanceof", () => {
    const error = new AuthError();
    expect(error instanceof AuthError).toBe(true);
    expect(error instanceof ApiError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});

describe("RateLimitError", () => {
  it("creates error with default message", () => {
    const error = new RateLimitError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error.message).toBe("Too many requests");
    expect(error.code).toBe("RATE_LIMIT");
    expect(error.status).toBe(429);
    expect(error.name).toBe("RateLimitError");
  });

  it("creates error with custom message", () => {
    const error = new RateLimitError("Rate limit exceeded for IP");
    expect(error.message).toBe("Rate limit exceeded for IP");
    expect(error.code).toBe("RATE_LIMIT");
    expect(error.status).toBe(429);
  });

  it("is instance of ApiError", () => {
    const error = new RateLimitError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(RateLimitError);
  });
});

describe("ValidationError", () => {
  it("creates error with default message", () => {
    const error = new ValidationError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe("Validation failed");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.status).toBe(400);
    expect(error.name).toBe("ValidationError");
  });

  it("creates error with custom message", () => {
    const error = new ValidationError("Email is required");
    expect(error.message).toBe("Email is required");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.status).toBe(400);
  });

  it("is instance of ApiError", () => {
    const error = new ValidationError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(ValidationError);
  });
});

describe("ConfigError", () => {
  it("creates error with default message", () => {
    const error = new ConfigError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(ConfigError);
    expect(error.message).toBe("Server configuration error");
    expect(error.code).toBe("CONFIG_ERROR");
    expect(error.status).toBe(500);
    expect(error.name).toBe("ConfigError");
  });

  it("creates error with custom message", () => {
    const error = new ConfigError("Missing database URL");
    expect(error.message).toBe("Missing database URL");
    expect(error.code).toBe("CONFIG_ERROR");
    expect(error.status).toBe(500);
  });

  it("is instance of ApiError", () => {
    const error = new ConfigError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(ConfigError);
  });
});

describe("Error hierarchy", () => {
  it("all errors inherit from ApiError", () => {
    const errors = [
      new AuthError(),
      new RateLimitError(),
      new ValidationError(),
      new ConfigError(),
    ];

    for (const error of errors) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("each error has correct status code", () => {
    expect(new AuthError().status).toBe(401);
    expect(new RateLimitError().status).toBe(429);
    expect(new ValidationError().status).toBe(400);
    expect(new ConfigError().status).toBe(500);
    expect(new ApiError().status).toBe(500);
  });

  it("each error has correct error code", () => {
    expect(new AuthError().code).toBe("AUTH_ERROR");
    expect(new RateLimitError().code).toBe("RATE_LIMIT");
    expect(new ValidationError().code).toBe("VALIDATION_ERROR");
    expect(new ConfigError().code).toBe("CONFIG_ERROR");
    expect(new ApiError().code).toBe("INTERNAL_ERROR");
  });

  it("each error has correct name", () => {
    expect(new AuthError().name).toBe("AuthError");
    expect(new RateLimitError().name).toBe("RateLimitError");
    expect(new ValidationError().name).toBe("ValidationError");
    expect(new ConfigError().name).toBe("ConfigError");
    expect(new ApiError().name).toBe("ApiError");
  });
});

describe("Error serialization", () => {
  it("toJSON includes all properties", () => {
    const error = new ValidationError("Invalid input");
    const json = error.toJSON ? error.toJSON() : { message: error.message, code: error.code, status: error.status, name: error.name };
    
    expect(json.message).toBe("Validation failed");
    expect(json.code).toBe("VALIDATION_ERROR");
    expect(json.status).toBe(400);
    expect(json.name).toBe("ValidationError");
  });

  it("can be serialized with JSON.stringify", () => {
    const error = new AuthError("Token expired");
    const str = JSON.stringify(error);
    const parsed = JSON.parse(str);
    
    expect(parsed.message).toBe("Token expired");
    expect(parsed.code).toBe("AUTH_ERROR");
    expect(parsed.status).toBe(401);
  });
});

describe("Error catching and filtering", () => {
  it("can filter by error code", () => {
    const errors = [
      new AuthError(),
      new RateLimitError(),
      new ValidationError(),
      new ConfigError(),
    ];

    const authErrors = errors.filter((e) => e.code === "AUTH_ERROR");
    expect(authErrors).toHaveLength(1);
    expect(authErrors[0]).toBeInstanceOf(AuthError);
  });

  it("can filter by status code", () => {
    const errors = [
      new AuthError(),
      new RateLimitError(),
      new ValidationError(),
      new ConfigError(),
    ];

    const clientErrors = errors.filter((e) => e.status < 500);
    expect(clientErrors).toHaveLength(3);
  });

  it("can distinguish ApiError from other errors", () => {
    const errors = [
      new ApiError(),
      new AuthError(),
      new Error("Regular error"),
      new TypeError("Type error"),
    ];

    const apiErrors = errors.filter((e) => e instanceof ApiError);
    expect(apiErrors).toHaveLength(2);
  });
});