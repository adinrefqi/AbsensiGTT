"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, History, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Attendance } from "@/types";

export default function RiwayatPage() {
  const supabase = createClient();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    fetchAttendances();
  }, [dateRange]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teacherData } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!teacherData) return;

      let query = supabase
        .from("attendances")
        .select("*, schools(name)")
        .eq("teacher_id", teacherData.id)
        .order("clock_in", { ascending: false });

      if (dateRange.from) {
        query = query.gte("clock_in", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        query = query.lte("clock_in", dateRange.to.toISOString());
      }

      const { data } = await query;
      if (data) {
        setAttendances(data);
      }
    } catch (error) {
      console.error("Error fetching attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "HADIR":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hadir</Badge>;
      case "TIDAK_HADIR":
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      case "BELUM_CLOCK_OUT":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Belum Pulang</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateDuration = (clockIn: string, clockOut: string | null | undefined) => {
    if (!clockOut) return "-";
    const start = new Date(clockIn).getTime();
    const end = new Date(clockOut).getTime();
    const minutes = Math.round((end - start) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      <Header title="Riwayat Absensi" description="Lihat riwayat absensi Anda" />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM yyyy")} -{" "}
                  {format(dateRange.to, "dd MMM yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy")
              )
            ) : (
              "Pilih rentang tanggal"
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                setDateRange({ from: range?.from, to: range?.to });
                if (range?.to) setCalendarOpen(false);
              }}
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>

        {(dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            onClick={() => setDateRange({})}
            className="text-muted-foreground"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Belum ada data absensi</p>
                    <p className="text-sm">Riwayat absensi Anda akan muncul di sini</p>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((attendance, index) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {format(new Date(attendance.clock_in), "dd MMM yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(attendance.clock_in), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{(attendance as any).schools?.name || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(attendance.clock_in), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      {attendance.clock_out
                        ? format(new Date(attendance.clock_out), "HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>{calculateDuration(attendance.clock_in, attendance.clock_out)}</TableCell>
                    <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
