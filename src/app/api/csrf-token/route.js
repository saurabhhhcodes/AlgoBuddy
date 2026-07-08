import { cookies } from "next/headers";
import { generateCsrfToken } from "@/lib/csrf";
import { CSRF_COOKIE_NAME } from "@/lib/csrfConstants";
import { jsonResponse } from "@/lib/serverApi";

export async function GET() {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });
  return jsonResponse({ csrfToken: token });
}
