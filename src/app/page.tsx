import Link from "next/link";
import { GraduationCap, Users, Building2, ClipboardCheck, Shield, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Absensi GTT</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Aplikasi Resmi Yayasan Tunas Harapan
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Absensi Digital
            </span>
            <br />
            untuk Guru Tidak Tetap
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Kelola absensi guru tidak tetap dengan mudah, cepat, dan akurat.
            Dilengkapi dengan fitur laporan lengkap untuk manajemen sekolah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              Mulai Gratis
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-white transition-all"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola absensi GTT dalam satu platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <ClipboardCheck className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Absensi Real-time</h3>
              <p className="text-muted-foreground">
                Catat kehadiran guru dengan mudah dan pantau status absensi secara real-time.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manajemen GTT</h3>
              <p className="text-muted-foreground">
                Kelola data guru tidak tetap, sekolah, dan penugasan dengan sistem terorganisir.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Sekolah</h3>
              <p className="text-muted-foreground">
                Mendukung beberapa sekolah dalam satu platform dengan hak akses berbeda.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Keamanan Data</h3>
              <p className="text-muted-foreground">
                Data terlindungi dengan sistem autentikasi yang aman dan terenkripsi.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 hover:shadow-xl hover:shadow-cyan-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/25">
                <Smartphone className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Responsive Design</h3>
              <p className="text-muted-foreground">
                Akses dari komputer, tablet, atau smartphone dengan tampilan yang optimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,transparent)]" />
            <div className="relative px-8 py-16 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-8">
                Bergabung dengan ratusan guru dan sekolah yang sudah menggunakan Absensi GTT
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-base font-medium bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-xl"
              >
                Daftar Sekarang — Gratis!
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Absensi GTT</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Absensi GTT. Yayasan Tunas Harapan.
          </p>
        </div>
      </footer>
    </div>
  );
}
