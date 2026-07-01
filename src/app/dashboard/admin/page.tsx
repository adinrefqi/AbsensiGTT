import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatCard";
import { Users, Building2, UserCog, TrendingUp, CalendarCheck, Award } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,transparent)]" />
        <div className="relative">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-blue-100 mt-2 max-w-xl">
            Kelola data guru, sekolah, dan user dengan mudah
          </p>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-blue-200" />
              <span className="text-sm text-blue-100">{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Guru"
          value={guruCount || 0}
          description="Guru Tidak Tetap (GTT)"
          icon={<Users className="h-7 w-7 text-blue-600" />}
        />
        <StatCard
          title="Total Sekolah"
          value={schoolCount || 0}
          description="Sekolah yang terdaftar"
          icon={<Building2 className="h-7 w-7 text-indigo-600" />}
        />
        <StatCard
          title="Total User"
          value={userCount || 0}
          description="User yang aktif"
          icon={<UserCog className="h-7 w-7 text-violet-600" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Ringkasan Aktivitas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-blue-600 bg-blue-100 rounded-xl p-2" />
              <div>
                <p className="font-semibold">Pengelolaan GTT</p>
                <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus data guru</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <div className="flex items-center gap-3">
              <Building2 className="h-10 w-10 text-green-600 bg-green-100 rounded-xl p-2" />
              <div>
                <p className="font-semibold">Manajemen Sekolah</p>
                <p className="text-sm text-muted-foreground">Kelola sekolah dan penugasan guru</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
