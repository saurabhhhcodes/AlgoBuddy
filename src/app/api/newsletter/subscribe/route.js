import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { RATE_LIMITS } from "@/config/rateLimits";

export async function POST(req) {
  try {
    const ip = getClientIp(req.headers);
    const { allowed, remaining, resetAt } = await checkRateLimit(`newsletter:subscribe:${ip}`);
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return jsonResponse({ message: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": RATE_LIMITS.NEWSLETTER_API.LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const { email, captchaToken } = body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!captchaToken) {
      return jsonResponse({ error: "Captcha token missing" }, 400);
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return jsonResponse({ error: captcha.error }, 400);
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email: normalizedEmail }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation error code
        return jsonResponse({ message: "You are already subscribed!" }, 200);
      }
      console.error("Newsletter subscription error:", error);
      return errorResponse({ status: 500, message: "Failed to subscribe. Please try again later." });
    }

    return jsonResponse({ message: "Successfully subscribed!" }, 201);
  } catch (error) {
    console.error("Newsletter API error:", error);
    return errorResponse({ status: 500, message: "Internal server error" });
  }
}
