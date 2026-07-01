"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signUp } from "@/lib/supabase/auth";
import { z } from "zod";
import type { UserRole } from "@/types";

const registerSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  role: z.enum(["ADMIN", "GURU", "MANAGER"]),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await signUp(data.email, data.password, {
        full_name: data.full_name,
        role: data.role as UserRole,
        phone: data.phone,
      });

      if (error) {
        toast.error(error.message || "Registrasi gagal");
        return;
      }

      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-xl shadow-blue-500/10 border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 pb-4">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-3">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground mt-1">
              Daftar untuk mengakses Absensi GTT
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Masukkan nama lengkap"
                className="h-11"
                {...register("full_name")}
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="h-11"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                No. Telepon <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="h-11"
                {...register("phone")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role Akun
              </Label>
              <Select
                onValueChange={(value) => value && setValue("role", value as UserRole)}
                value={selectedRole}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Pilih role akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="GURU">Guru (GTT)</SelectItem>
                  <SelectItem value="MANAGER">Manager / Kepala Sekolah</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="h-11 pr-10"
                  {...register("password")}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan password lagi"
                  className="h-11 pr-10"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Daftar Sekarang
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground justify-center pb-6">
          <p>
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
