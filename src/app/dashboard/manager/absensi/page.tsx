"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Attendance } from "@/types";

interface AttendanceWithDetail extends Attendance {
  teacher?: { full_name?: string; email?: string };
}

export default function ManagerAbsensiPage() {
  const supabase = createClient();
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  useEffect(() => {
    fetchAttendances();
  }, [selectedMonth, selectedTeacher]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split("-");
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0);

      let query = supabase
        .from("attendance")
        .select(`*, teacher:teachers(full_name, email)`)
        .gte("date", start.toISOString().split("T")[0])
        .lte("date", end.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (selectedTeacher !== "all") {
        query = query.eq("teacher_id", selectedTeacher);
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
      case "HADIR": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hadir</Badge>;
      case "IZIN": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Izin</Badge>;
      case "SAKIT": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Sakit</Badge>;
      case "ALFA": return <Badge variant="destructive">Alfa</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <Header title="Data Absensi" description="Lihat semua data absensi guru" />

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-1">
          <label className="text-sm font-medium">Bulan</label>
          <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-[180px]" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Belum ada data absensi</p>
                    <p className="text-sm">Data absensi akan muncul di sini</p>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((att, index) => (
                  <TableRow key={att.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{format(new Date(att.date), "dd MMM yyyy", { locale: id })}</TableCell>
                    <TableCell>{att.teacher?.full_name || "-"}</TableCell>
                    <TableCell>{att.check_in_time ? format(new Date(att.check_in_time), "HH:mm") : "-"}</TableCell>
                    <TableCell>{att.check_out_time ? format(new Date(att.check_out_time), "HH:mm") : "-"}</TableCell>
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
        <p className="text-sm text-muted-foreground mt-4 text-right">Total: {attendances.length} data</p>
      )}
    </div>
  );
}
