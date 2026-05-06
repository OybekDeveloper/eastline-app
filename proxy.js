import { NextResponse } from "next/server";

export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;
  requestHeaders.set("x-pathname", pathname);

  const rawSession = request.cookies.get("date")?.value;
  let hasValidAdminSession = false;

  if (rawSession) {
    try {
      const parsed = JSON.parse(decodeURIComponent(rawSession));
      hasValidAdminSession =
        typeof parsed?.expiresAt === "number" && parsed.expiresAt > Date.now();
    } catch {
      hasValidAdminSession = false;
    }
  }

  if (pathname.startsWith("/dashboard") && !hasValidAdminSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && hasValidAdminSession) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
