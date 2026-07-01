import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatCard";
import { TrendChart } from "@/components/layout/TrendChart";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";

export default async function ManagerDashboard() {
  const supabase = await createClient();

  const monthStart = startOfMonth(new Date()).toISOString();
  const monthEnd = endOfMonth(new Date()).toISOString();

  const { count: totalAttendance } = await supabase
    .from("attendances")
    .select("*", { count: "exact", head: true })
    .gte("clock_in", monthStart)
    .lte("clock_in", monthEnd);

  const { count: hadirCount } = await supabase
    .from("attendances")
    .select("*", { count: "exact", head: true })
    .eq("status", "HADIR")
    .gte("clock_in", monthStart)
    .lte("clock_in", monthEnd);

  const { data: attendances } = await supabase
    .from("attendances")
    .select("clock_in, clock_out")
    .gte("clock_in", monthStart)
    .lte("clock_in", monthEnd)
    .not("clock_out", "is", null);

  let totalMinutes = 0;
  if (attendances) {
    attendances.forEach((att) => {
      if (att.clock_in && att.clock_out) {
        totalMinutes += (new Date(att.clock_out).getTime() - new Date(att.clock_in).getTime()) / 60000;
      }
    });
  }
  const avgMinutes = attendances?.length ? Math.round(totalMinutes / attendances.length) : 0;
  const avgHours = Math.floor(avgMinutes / 60);
  const remainingMins = avgMinutes % 60;

  const presentRate = totalAttendance ? Math.round((hadirCount! / totalAttendance) * 100) : 0;

  // Get trend data (last 7 days)
  const { data: trendData } = await supabase
    .from("attendances")
    .select("clock_in")
    .gte("clock_in", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .lte("clock_in", new Date().toISOString());

  return (
    <div>
      <Header
        title="Dashboard Manager"
        description={`Rekapitulasi ${format(new Date(), "MMMM yyyy", { locale: id })}`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Absensi"
          value={totalAttendance || 0}
          description="Bulan ini"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Tingkat Kehadiran"
          value={`${presentRate}%`}
          description="Hadir tepat waktu"
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
        />
        <StatCard
          title="Rata-rata Durasi"
          value={`${avgHours}h ${remainingMins}m`}
          description="Per absensi"
          icon={<Clock className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Tren"
          value={presentRate >= 90 ? "Baik" : presentRate >= 70 ? "Cukup" : "Perlu Perbaikan"}
          description="Bulanan"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="mt-8">
        <TrendChart data={trendData || []} />
      </div>

      <div className="mt-8">
        <p className="text-center text-muted-foreground">
          <a href="/manager/laporan" className="text-primary hover:underline">
            Lihat Laporan Detail
          </a>
        </p>
      </div>
    </div>
  );
}
