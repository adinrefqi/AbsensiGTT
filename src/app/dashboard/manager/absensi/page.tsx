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
import { CalendarIcon, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import type { Attendance } from "@/types";

interface AttendanceWithDetail extends Attendance {
  teachers?: { profiles?: { full_name?: string; email?: string } };
  schools?: { name?: string };
}

export default function ManagerAbsensiPage() {
  const supabase = createClient();
  const [attendances, setAttendances] = useState<AttendanceWithDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  useEffect(() => {
    fetchAttendances();
  }, [dateRange]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("attendances")
        .select(`*, schools(name), teachers(user_id, profiles(full_name, email))`)
        .order("clock_in", { ascending: false });

      if (dateRange.from) {
        query = query.gte("clock_in", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        query = query.lte("clock_in", dateRange.to.toISOString());
      }

      const { data } = await query;
      if (data) setAttendances(data);
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
    const minutes = Math.round((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}j ${m}m`;
  };

  return (
    <div>
      <Header title="Data Absensi" description="Lihat semua data absensi guru" />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Popover>
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
              }}
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>

        {(dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            onClick={() => setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })}
            className="text-muted-foreground"
          >
            Reset ke Bulan Ini
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
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Belum ada data absensi</p>
                    <p className="text-sm">Data absensi akan muncul di sini</p>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((att, index) => (
                  <TableRow key={att.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{format(new Date(att.clock_in), "dd MMM yyyy")}</TableCell>
                    <TableCell className="font-medium">
                      {(att as any).teachers?.profiles?.full_name || "-"}
                    </TableCell>
                    <TableCell>{(att as any).schools?.name || "-"}</TableCell>
                    <TableCell>{format(new Date(att.clock_in), "HH:mm")}</TableCell>
                    <TableCell>
                      {att.clock_out ? format(new Date(att.clock_out), "HH:mm") : "-"}
                    </TableCell>
                    <TableCell>{calculateDuration(att.clock_in, att.clock_out)}</TableCell>
                    <TableCell>{getStatusBadge(att.status)}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{att.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && attendances.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4 text-right">
          Total: {attendances.length} data
        </p>
      )}
    </div>
  );
}
