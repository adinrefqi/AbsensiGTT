import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  // Skip auth check in middleware - let server components handle it
  return NextResponse.next({
    request,
  });
}
