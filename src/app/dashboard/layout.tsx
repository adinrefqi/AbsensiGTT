import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import type { UserRole } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar role={role} userName={profile.full_name} />
      <main className="lg:pl-64">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
