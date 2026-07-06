import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEMO_COOKIE, isDemoRole } from "@/lib/demo";

// Routes that require an authenticated session.
const protectedRoutes = [
  "/dashboard",
  "/appointments",
  "/records",
  "/providers",
  "/patients",
  "/prescriptions",
  "/settings",
  "/symptom-checker",
  "/pharmacies",
  "/subscriptions",
  "/payment-history",
  "/triage-queue",
  "/consultation",
  "/notifications",
];

// Auth pages an already-authenticated user should be bounced away from.
const authRoutes = ["/login", "/signup"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function buildCsp(): string {
  const supaHost = (() => {
    try {
      return supabaseUrl ? new URL(supabaseUrl).origin : "";
    } catch {
      return "";
    }
  })();
  const isDev = process.env.NODE_ENV === "development";
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} ${supaHost};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' ${supaHost} ${supaHost.replace("https://", "wss://")} https://api.paystack.co https://api.stripe.com;
    frame-src 'self' https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Let the Supabase auth callback and static assets through untouched.
  if (path.startsWith("/auth/callback") || path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some((r) => path === r || path.startsWith(`${r}/`));
  const isAuthPage = authRoutes.some((r) => path === r || path.startsWith(`${r}/`));

  // Demo mode: honor the demo cookie without any backend call.
  const demoRole = request.cookies.get(DEMO_COOKIE)?.value;
  if (isDemoRole(demoRole)) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL(`/dashboard/${demoRole}`, request.url));
    }
    const res = NextResponse.next({ request });
    res.headers.set("Content-Security-Policy", buildCsp());
    return res;
  }

  // No Supabase configured (pure demo deployment): treat every visitor as
  // unauthenticated — protected pages bounce to /login, everything else passes.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(redirectUrl);
    }
    const res = NextResponse.next({ request });
    res.headers.set("Content-Security-Policy", buildCsp());
    return res;
  }

  let response = NextResponse.next({ request });

  // SSR client that reads request cookies and writes refreshed cookies onto the response.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() refreshes the session and is the source of truth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  response.headers.set("Content-Security-Policy", buildCsp());
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
