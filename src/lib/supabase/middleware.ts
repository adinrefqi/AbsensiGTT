import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Use Node.js runtime for middleware (Supabase uses Node.js APIs)
export const runtime = "nodejs";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Browser Supabase client for Edge Runtime (no Node.js APIs)
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        authorization: request.headers.get("Authorization") ?? "",
      },
    },
  });

  await supabase.auth.getUser();

  return NextResponse.next({ request });
}
