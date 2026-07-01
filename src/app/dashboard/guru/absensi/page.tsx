"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { calculateDistance } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { School, Attendance } from "@/types";

export default function AbsensiPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [distance, setDistance] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchData();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
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
      setUser(user);

      // Get teacher data
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("*, teacher_schools(school_id)")
        .eq("user_id", user.id)
        .single();

      if (teacherData) {
        setTeacher(teacherData);

        // Get schools
        const schoolIds = teacherData.teacher_schools?.map((ts: any) => ts.school_id) || [];
        if (schoolIds.length > 0) {
          const { data: schoolsData } = await supabase
            .from("schools")
            .select("*")
            .in("id", schoolIds);
          setSchools(schoolsData || []);
        }
      }

      // Get today's attendance
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: attendanceData } = teacherData
        ? await supabase
            .from("attendances")
            .select("*")
            .eq("teacher_id", teacherData.id)
            .gte("clock_in", `${today}T00:00:00`)
            .lte("clock_in", `${today}T23:59:59`)
            .single()
        : { data: null };

      setTodayAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolChange = (schoolId: string | null | undefined) => {
    if (!schoolId) return;
    setSelectedSchoolId(schoolId);
    const school = schools.find((s) => s.id === schoolId);
    setSelectedSchool(school || null);
    setDistance(null);
    setLocationStatus("idle");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung browser ini");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        setLocationStatus("success");

        // Calculate distance if school is selected
        if (selectedSchool) {
          const dist = calculateDistance(
            newLocation.lat,
            newLocation.lng,
            selectedSchool.lat,
            selectedSchool.lng
          );
          setDistance(dist);
        }
      },
      (error) => {
        toast.error("Gagal mendapatkan lokasi: " + error.message);
        setLocationStatus("error");
      }
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setPhoto(dataUrl);
      stopCamera();

      // Convert to File
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setPhotoFile(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
        });
    }
  };

  const isWithinRadius = selectedSchool && distance !== null && distance <= selectedSchool.radius_meter;
  const isClockOut = todayAttendance && !todayAttendance.clock_out;

  const handleSubmit = async () => {
    if (!teacher || !selectedSchoolId) {
      toast.error("Pilih sekolah terlebih dahulu");
      return;
    }

    if (!location || !isWithinRadius) {
      toast.error("Lokasi tidak valid atau di luar radius sekolah");
      return;
    }

    if (!photo) {
      toast.error("Ambil foto selfie terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      // Upload photo to Supabase Storage
      let photoUrl = "";
      if (photoFile) {
        const fileName = `${teacher.id}/${Date.now()}-selfie.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("attendance-photos")
          .upload(fileName, photoFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Continue without photo URL if upload fails
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("attendance-photos")
            .getPublicUrl(fileName);
          photoUrl = publicUrl;
        }
      }

      if (isClockOut) {
        // Clock out
        const { error } = await supabase
          .from("attendances")
          .update({
            clock_out: new Date().toISOString(),
            clock_out_lat: location.lat,
            clock_out_lng: location.lng,
            clock_out_photo_url: photoUrl || null,
            notes: notes || null,
            status: "HADIR",
          })
          .eq("id", todayAttendance!.id);

        if (error) throw error;
        toast.success("Clock-out berhasil!");
      } else {
        // Clock in
        const { error } = await supabase.from("attendances").insert({
          teacher_id: teacher.id,
          school_id: selectedSchoolId,
          clock_in: new Date().toISOString(),
          clock_in_lat: location.lat,
          clock_in_lng: location.lng,
          clock_in_photo_url: photoUrl || null,
          notes: notes || null,
          status: "BELUM_CLOCK_OUT",
        });

        if (error) throw error;
        toast.success("Clock-in berhasil!");
      }

      // Reset form
      setSelectedSchoolId("");
      setSelectedSchool(null);
      setLocation(null);
      setDistance(null);
      setLocationStatus("idle");
      setPhoto(null);
      setPhotoFile(null);
      setNotes("");

      // Refresh data
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
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div>
        <Header title="Absensi" description="Clock-in dan clock-out harian" />
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Data guru tidak ditemukan. Hubungi admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div>
        <Header title="Absensi" description="Clock-in dan clock-out harian" />
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Anda belum terdaftar di sekolah mana pun. Hubungi admin untuk mendapatkan akses sekolah.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Absensi"
        description={`${format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}`}
      />

      {todayAttendance && !todayAttendance.clock_out && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Anda sudah clock-in</strong> pada pukul{" "}
            {format(new Date(todayAttendance.clock_in), "HH:mm")}. Silakan clock-out saat pulang.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isClockOut ? "Clock-Out" : "Clock-In"}</CardTitle>
          <CardDescription>
            {isClockOut
              ? "Pastikan Anda sudah di sekolah untuk clock-out"
              : "Ikuti langkah-langkah berikut untuk melakukan absensi"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Select School */}
          <div className="space-y-2">
            <Label className="text-base font-medium">1. Pilih Sekolah</Label>
            <Select value={selectedSchoolId || ""} onValueChange={(v) => handleSchoolChange(v || null)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Pilih sekolah tempat mengajar" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Detect Location */}
          <div className="space-y-2">
            <Label className="text-base font-medium">2. Deteksi Lokasi</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={detectLocation}
                disabled={locationStatus === "loading"}
                className="flex-1"
              >
                {locationStatus === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mendeteksi...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Deteksi Lokasi
                  </>
                )}
              </Button>
            </div>

            {location && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Lokasi terdeteksi:</strong>{" "}
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                {distance !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    {isWithinRadius ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={isWithinRadius ? "text-green-700" : "text-red-700"}>
                      {isWithinRadius
                        ? `Dalam radius (${Math.round(distance)}m dari sekolah)`
                        : `Di luar radius! (${Math.round(distance)}m dari sekolah, maksimal ${selectedSchool?.radius_meter}m)`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Take Photo */}
          <div className="space-y-2">
            <Label className="text-base font-medium">3. Ambil Foto Selfie</Label>
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Selfie"
                  className="w-full max-w-sm mx-auto rounded-lg border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoFile(null);
                  }}
                >
                  Hapus
                </Button>
              </div>
            ) : showCamera ? (
              <div className="space-y-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-w-sm mx-auto rounded-lg border"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={stopCamera}>
                    Batal
                  </Button>
                  <Button onClick={takePhoto}>
                    <Camera className="h-4 w-4 mr-2" />
                    Ambil Foto
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={startCamera} className="w-full max-w-sm">
                <Camera className="h-4 w-4 mr-2" />
                Buka Kamera
              </Button>
            )}
          </div>

          {/* Step 4: Notes (optional) */}
          <div className="space-y-2">
            <Label className="text-base font-medium">4. Catatan (Opsional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan jika ada..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={
              submitting ||
              !selectedSchoolId ||
              !location ||
              !isWithinRadius ||
              !photo
            }
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : isClockOut ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Clock-Out
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Clock-In
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
