import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Let server components handle auth - middleware just passes through
  return NextResponse.next({
    request,
  });
}
