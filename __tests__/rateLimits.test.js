const { RATE_LIMITS } = require("../src/config/rateLimits");

describe("RATE_LIMITS", () => {
  test("exports CONTACT_API config", () => {
    expect(RATE_LIMITS.CONTACT_API).toBeDefined();
    expect(RATE_LIMITS.CONTACT_API.LIMIT).toBe(5);
  });

  test("exports SMTP config", () => {
    expect(RATE_LIMITS.SMTP).toBeDefined();
    expect(typeof RATE_LIMITS.SMTP.DAILY_QUOTA).toBe("number");
  });

  test("SMTP DAILY_QUOTA is a positive number", () => {
    expect(RATE_LIMITS.SMTP.DAILY_QUOTA).toBeGreaterThan(0);
  });

  test("CONTACT_API.LIMIT is exactly 5", () => {
    expect(RATE_LIMITS.CONTACT_API.LIMIT).toBe(5);
  });

  test("no extra keys in RATE_LIMITS", () => {
    expect(Object.keys(RATE_LIMITS)).toEqual(["CONTACT_API", "SMTP"]);
  });
});
