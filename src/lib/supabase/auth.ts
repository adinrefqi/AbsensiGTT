import { createClient } from "./client";
import type { Profile, UserRole } from "@/types";

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Get user role from profile
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getCurrentUser();
  return profile?.role ?? null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up new user
 */
export async function signUp(
  email: string,
  password: string,
  metadata: { full_name: string; role: UserRole; phone?: string }
) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
