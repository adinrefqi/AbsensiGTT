import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatCard";
import { Users, Building2, UserCog } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get counts
  const { count: guruCount } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true });

  const { count: schoolCount } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <Header
        title="Dashboard Admin"
        description="Kelola data guru, sekolah, dan user"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Guru"
          value={guruCount || 0}
          description="Guru Tidak Tetap (GTT)"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total Sekolah"
          value={schoolCount || 0}
          description="Sekolah yang terdaftar"
          icon={<Building2 className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total User"
          value={userCount || 0}
          description="User yang aktif"
          icon={<UserCog className="h-6 w-6 text-primary" />}
        />
      </div>
    </div>
  );
}
