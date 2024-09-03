import { NextResponse } from "next/server";

export function middleware(request) {
  const url = new URL(request.url);
  const cookies = request.cookies;
  const dateCookie = cookies.get("date");

  // Check if the request is for the login page
  if (url.pathname === "/login") {
    if (dateCookie) {
      try {
        const { expiresAt } = JSON.parse(dateCookie.value);

        // Redirect to dashboard if cookie is valid
        if (expiresAt && Date.now() <= expiresAt) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.log("Error parsing cookie:", error);
      }
    }
  }

  // Check if the request is for the dashboard page
  if (url.pathname === "/dashboard") {
    if (!dateCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { expiresAt } = JSON.parse(dateCookie.value);

      if (!expiresAt || Date.now() > expiresAt) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.log("Error parsing cookie:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard'],
};
