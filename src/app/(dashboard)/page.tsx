import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import type { UserRole } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const role = profile.role as UserRole;

  // Redirect based on role
  switch (role) {
    case "ADMIN":
      redirect("/admin");
    case "GURU":
      redirect("/guru");
    case "MANAGER":
      redirect("/manager");
    default:
      redirect("/login");
  }
}
