import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Public routes
  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route
  );

  if (isProtectedRoute) {
    const supabaseResponse = await updateSession(request);

    // Check if user is authenticated by looking at cookies
    const userCookie = request.cookies.get("sb-access-token") ||
                       request.cookies.get("supabase-auth-token") ||
                       request.cookies.getAll().find(c => c.name.includes("auth-token") || c.name.includes("access-token"));

    if (!userCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  return await updateSession(request);
}
