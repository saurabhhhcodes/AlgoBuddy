import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  validateCsrfOrigin,
  isStateChangingMethod,
  isApiRoute,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrfConstants";
import { validateCsrfTokenEdge } from "@/lib/csrfToken";
import { getSupabaseConfig } from "@/lib/shared-utils";

const SUPABASE_ENV_ERROR =
  "Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and add your Supabase project URL and anon key.";

const CSRF_EXEMPT_ROUTES = new Set(["/api/csrf-token"]);

const protectedRoutes = ["/arena", "/practice", "/profile"];

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseConfig = getSupabaseConfig();
  if (!supabaseConfig) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(SUPABASE_ENV_ERROR);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
            }),
          );
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  // Forward the verified user to route handlers so they can skip
  // a redundant getUser() call, cutting auth latency in half.
  const requestHeaders = new Headers(request.headers);

  // Always strip client-supplied identity headers first
  requestHeaders.delete('x-user-id');
  requestHeaders.delete('x-user-email');

  if (user) {
    // Only set after Supabase has verified the session
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');
  }

  // Preserve the response that may have Supabase session cookies set
  // during getUser() via the setAll() callback. Creating a new response below
  // without these cookies would silently log users out on session refresh.
  const prevResponse = supabaseResponse;
  supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Copy Set-Cookie headers from the previous response (set by Supabase's setAll)
  // so that session refresh cookies reach the browser.
  prevResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      supabaseResponse.headers.append('Set-Cookie', value);
    }
  });

  const pathname = request.nextUrl.pathname;
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (error || !user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    isApiRoute(pathname) &&
    isStateChangingMethod(request.method) &&
    !CSRF_EXEMPT_ROUTES.has(pathname)
  ) {
    if (request.nextUrl.pathname.startsWith('/api/chatbot')) {
      return NextResponse.next();
    }

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF validation failed: untrusted origin" },
        { status: 403 },
      );
    }

    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    if (!headerToken || !cookieToken) {
      return NextResponse.json(
        { error: "CSRF validation failed: token missing" },
        { status: 403 },
      );
    }

    if (!(await validateCsrfTokenEdge(cookieToken))) {
      return NextResponse.json(
        { error: "CSRF validation failed: invalid token signature" },
        { status: 403 },
      );
    }

    if (headerToken !== cookieToken) {
      return NextResponse.json(
        { error: "CSRF validation failed: token mismatch" },
        { status: 403 },
      );
    }
  }

  return supabaseResponse;
}


