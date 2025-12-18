"use server";

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./src/lib/rateLimit";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (pathname.startsWith("/api/")) {
    if (!rateLimit(ip, 100, 60000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const sessionCookie = request.cookies.get(
    process.env.COOKIE_NAME || "cooking-cat"
  );

  let session = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      session = null;
    }
  }

  if (
    pathname.includes(".") ||
    pathname.includes("/~") ||
    pathname.startsWith("/auth/")
  ) {
    return NextResponse.next();
  }

  if (!session && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
