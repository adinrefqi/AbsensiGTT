"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Attendance } from "@/types";

export default function AbsensiPage() {
  const supabase = createClient();
  const [teacher, setTeacher] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const { data: teacherData } = await supabase
        .from("teachers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (teacherData) {
        setTeacher(teacherData);
      }

      const today = format(new Date(), "yyyy-MM-dd");
      const { data: attendanceData } = teacherData
        ? await supabase.from("attendance").select("*").eq("teacher_id", teacherData.id).eq("date", today).single()
        : { data: null };

      setTodayAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      toast.error("Gagal mengakses kamera");
    }
  };

  const stopCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setPhoto(canvas.toDataURL("image/jpeg", 0.8));
      stopCamera();
    }
  };

  const isClockOut = todayAttendance && !todayAttendance.check_out_time;

  const handleSubmit = async () => {
    if (!teacher) {
      toast.error("Data guru tidak ditemukan");
      return;
    }

    setSubmitting(true);
    try {
      if (isClockOut) {
        const { error } = await supabase.from("attendance").update({
          check_out_time: new Date().toISOString(),
          notes: notes || null,
        }).eq("id", todayAttendance!.id);
        if (error) throw error;
        toast.success("Clock-out berhasil!");
      } else {
        const { error } = await supabase.from("attendance").insert({
          teacher_id: teacher.id,
          date: new Date().toISOString().split("T")[0],
          check_in_time: new Date().toISOString(),
          status: "HADIR",
          notes: notes || null,
        });
        if (error) throw error;
        toast.success("Clock-in berhasil!");
      }
      setNotes("");
      setPhoto(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Absensi" description="Clock-in dan clock-out harian" />
        <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div>
        <Header title="Absensi" description="Clock-in dan clock-out harian" />
        <Card><CardContent className="py-8 text-center"><p className="text-muted-foreground">Data guru tidak ditemukan. Hubungi admin.</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div>
      <Header title="Absensi" description={`${format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}`} />

      {todayAttendance && !todayAttendance.check_out_time && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Anda sudah clock-in</strong> pada pukul {todayAttendance.check_in_time ? format(new Date(todayAttendance.check_in_time), "HH:mm") : "-"}. Silakan clock-out saat pulang.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isClockOut ? "Clock-Out" : "Clock-In"}</CardTitle>
          <CardDescription>{isClockOut ? "Pastikan Anda sudah di sekolah untuk clock-out" : "Ikuti langkah-langkah berikut untuk melakukan absensi"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">1. Catatan (Opsional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tambahkan catatan jika ada..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">2. Ambil Foto Selfie</Label>
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Selfie" className="w-full max-w-sm mx-auto rounded-lg border" />
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => setPhoto(null)}>Hapus</Button>
              </div>
            ) : showCamera ? (
              <div className="space-y-2">
                <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-sm mx-auto rounded-lg border" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={stopCamera}>Batal</Button>
                  <Button onClick={takePhoto}><Camera className="h-4 w-4 mr-2" />Ambil Foto</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={startCamera} className="w-full max-w-sm"><Camera className="h-4 w-4 mr-2" />Buka Kamera</Button>
            )}
          </div>

          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : <><CheckCircle className="h-4 w-4 mr-2" />{isClockOut ? "Clock-Out" : "Clock-In"}</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
