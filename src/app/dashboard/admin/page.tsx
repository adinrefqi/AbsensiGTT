import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/layout/StatCard";
import { Users, Building2, UserCog, TrendingUp, CalendarCheck, Award, Clock, CheckCircle } from "lucide-react";

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

  // Get recent attendance
  const { count: todayAttendance } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("date", new Date().toISOString().split("T")[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,transparent)]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <CalendarCheck className="h-5 w-5" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-blue-100 max-w-xl">
            Kelola data guru, sekolah, dan user dengan mudah
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        <StatCard
          title="Absensi Hari Ini"
          value={todayAttendance || 0}
          description="Guru yang hadir"
          icon={<CheckCircle className="h-7 w-7 text-green-600" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
              <p className="text-sm text-muted-foreground">Ringkasan aktivitas sistem</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Pengelolaan GTT</p>
                <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus data guru</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
              <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/25">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Manajemen Sekolah</p>
                <p className="text-sm text-muted-foreground">Kelola sekolah dan penugasan guru</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Menu Cepat</h2>
              <p className="text-sm text-muted-foreground">Akses cepat ke fitur utama</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a href="/dashboard/admin/guru" className="group p-4 rounded-xl border hover:border-blue-200 hover:bg-blue-50/50 transition-all">
              <Users className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Kelola Guru</p>
              <p className="text-xs text-muted-foreground">Tambah & edit data guru</p>
            </a>
            <a href="/dashboard/admin/sekolah" className="group p-4 rounded-xl border hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
              <Building2 className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Kelola Sekolah</p>
              <p className="text-xs text-muted-foreground">Atur data sekolah</p>
            </a>
            <a href="/dashboard/admin/user" className="group p-4 rounded-xl border hover:border-violet-200 hover:bg-violet-50/50 transition-all">
              <UserCog className="h-8 w-8 text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Kelola User</p>
              <p className="text-xs text-muted-foreground">Atur akun pengguna</p>
            </a>
            <a href="/dashboard/manager/laporan" className="group p-4 rounded-xl border hover:border-green-200 hover:bg-green-50/50 transition-all">
              <TrendingUp className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Lihat Laporan</p>
              <p className="text-xs text-muted-foreground">Export data absensi</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
