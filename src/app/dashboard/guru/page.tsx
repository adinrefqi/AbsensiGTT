import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatCard";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function GuruDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const today = format(new Date(), "yyyy-MM-dd");
  const { data: todayAttendance } = teacher
    ? await supabase
        .from("attendances")
        .select("*, schools(name)")
        .eq("teacher_id", teacher.id)
        .gte("clock_in", `${today}T00:00:00`)
        .lte("clock_in", `${today}T23:59:59`)
        .single()
    : { data: null };

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const { count: weekCount } = teacher
    ? await supabase
        .from("attendances")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", teacher.id)
        .gte("clock_in", weekStart.toISOString())
    : { count: 0 };

  const statusText = !todayAttendance
    ? "Belum Absen"
    : todayAttendance.clock_out
    ? "Sudah Pulang"
    : "Sedang Mengajar";

  const statusIcon =
    !todayAttendance ? (
      <Clock className="h-6 w-6 text-amber-500" />
    ) : todayAttendance.clock_out ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Clock className="h-6 w-6 text-blue-500" />
    );

  return (
    <div>
      <Header
        title="Dashboard Guru"
        description={`${format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Status Hari Ini"
          value={statusText}
          icon={statusIcon}
        />
        <StatCard
          title="Absensi Minggu Ini"
          value={weekCount || 0}
          description="Hari mengajar"
          icon={<CheckCircle className="h-6 w-6 text-primary" />}
        />
        {todayAttendance?.clock_in && (
          <StatCard
            title="Jam Masuk"
            value={format(new Date(todayAttendance.clock_in), "HH:mm")}
            description={`Sekolah: ${(todayAttendance as any).schools?.name || "-"}`}
            icon={<Clock className="h-6 w-6 text-primary" />}
          />
        )}
      </div>

      <div className="mt-8">
        <p className="text-center text-muted-foreground">
          {!todayAttendance ? (
            <a href="/guru/absensi" className="text-primary hover:underline">
              Klik di sini untuk Clock-In
            </a>
          ) : !todayAttendance.clock_out ? (
            <a href="/guru/absensi" className="text-primary hover:underline">
              Klik di sini untuk Clock-Out
            </a>
          ) : (
            "Anda sudah menyelesaikan absensi hari ini"
          )}
        </p>
      </div>
    </div>
  );
}
