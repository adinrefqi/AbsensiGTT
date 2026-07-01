# PRD: Absensi GTT — Aplikasi Absensi Guru Terbang/Tidak Tetap

> **Versi:** 1.0  
> **Status:** Draft  
> **Tanggal:** 30 Juni 2026

---

## 1. Ringkasan Eksekutif

**Absensi GTT** adalah aplikasi web full-stack untuk mengelola kehadiran Guru Tidak Tetap (GTT) / Guru Terbang di sekolah-sekolah di bawah Yayasan Tunas Harapan. Aplikasi ini menggantikan sistem absensi manual (buku/Google Forms) dengan sistem digital yang mencakup clock-in/out berbasis lokasi GPS, foto selfie, serta dashboard laporan real-time untuk manajemen.

---

## 2. Tujuan & Sasaran

### 2.1 Tujuan Bisnis
1. **Digitalisasi absensi GTT** — catat kehadiran secara real-time tanpa kertas
2. **Akuntabilitas kehadiran** — validasi lokasi GPS dan foto selfie memastikan guru benar-benar hadir di sekolah
3. **Efisiensi pelaporan** — manager sekolah tidak perlu merekap manual; laporan siap export Excel/CSV
4. **Transparansi** — data kehadiran riwayat bisa diakses guru dan manager kapan saja

### 2.2 Sasaran (OKRs)
| Objective | Key Result |
|-----------|------------|
| Digitalisasi absensi | 100% GTT menggunakan aplikasi untuk clock-in/out |
| Akurasi data | ≥95% absensi tervalidasi GPS dalam radius sekolah |
| Efisiensi laporan | Waktu rekap laporan turun dari ~2 jam/hari → 5 menit/hari |
| Kepuasan pengguna | Survey skor ≥4/5 dari guru dan manager |

---

## 3. Target Pengguna & Persona

### 3.1 Admin Sekolah (Power User)
| Atribut | Detail |
|---------|--------|
| **Peran** | Admin/TU yayasan atau sekolah |
| **Kebutuhan** | CRUD master data (guru, sekolah, user), reset password |
| **Skill teknis** | Dasar — bisa pakai browser |
| **Frekuensi pakai** | Harian di awal bulan & saat ada perubahan data |

### 3.2 Guru Tidak Tetap (GTT) / Guru Terbang
| Atribut | Detail |
|---------|--------|
| **Peran** | Guru yang mengajar di 1+ sekolah (bukan PNS/GTY) |
| **Kebutuhan** | Clock-in saat datang, clock-out saat pulang, lihat riwayat |
| **Skill teknis** | Minimal — bisa pakai smartphone browser |
| **Frekuensi pakai** | Setiap hari mengajar (2-4×/hari) |
| **Pain point** | Lupa absen, GPS tidak aktif, foto selfie gagal |

### 3.3 Manager Sekolah
| Atribut | Detail |
|---------|--------|
| **Peran** | Kepala sekolah / wakil yang mengawasi GTT |
| **Kebutuhan** | Dashboard kehadiran, laporan bulanan, export Excel |
| **Skill teknis** | Dasar — bisa filter & export data |
| **Frekuensi pakai** | Mingguan / akhir bulan |

---

## 4. Fitur & Requirements

### 4.1 Authentication & Authorization
| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| AUTH-01 | Login | Email + password via Supabase Auth | P0 |
| AUTH-02 | Register (Admin) | Admin bisa buat akun guru/manager baru | P0 |
| AUTH-03 | Logout | Hapus session dan redirect ke login | P0 |
| AUTH-04 | Role-based redirect | Setelah login, redirect sesuai role (ADMIN/GURU/MANAGER) | P0 |
| AUTH-05 | Session management | Middleware ambil & refresh session via Supabase SSR | P0 |

### 4.2 Role Admin
| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| ADM-01 | Dashboard admin | Statistik total guru, sekolah, user | P0 |
| ADM-02 | CRUD Guru | Tambah/edit/hapus data guru, link ke profile user | P0 |
| ADM-03 | CRUD Sekolah | Tambah/edit/hapus data sekolah (termasuk koordinat GPS & radius) | P0 |
| ADM-04 | CRUD User | Kelola akun user, reset password | P0 |
| ADM-05 | Assign guru-sekolah | Relasi many-to-mana: satu guru bisa mengajar di banyak sekolah | P0 |

### 4.3 Role Guru (GTT)
| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| GRU-01 | Clock-in | Pilih sekolah → validasi GPS dalam radius → foto selfie → catatan opsional → clock-in | P0 |
| GRU-02 | Clock-out | Validasi GPS → foto selfie → catatan opsional → clock-out | P0 |
| GRU-03 | Riwayat pribadi | Tabel riwayat absensi dengan filter tanggal | P1 |
| GRU-04 | Status hari ini | Lihat status sudah clock-in/out hari ini di halaman utama guru | P0 |

### 4.4 Role Manager
| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| MGR-01 | Dashboard | Ringkasan kehadiran bulan ini, grafik tren (line chart) | P0 |
| MGR-02 | Statistik | Persentase kehadiran, total jam mengajar, rata-rata durasi | P0 |
| MGR-03 | Laporan detail | Tabel absensi dengan filter (guru, tanggal, status) | P0 |
| MGR-04 | Export Excel | Download laporan sebagai file .xlsx | P1 |
| MGR-05 | Export CSV | Download laporan sebagai file .csv | P2 |

### 4.5 Fitur Teknis Lintas-Role
| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| TEC-01 | Validasi GPS | Hitung distance antara lokasi user & sekolah menggunakan Haversine; validasi dalam radius_meter | P0 |
| TEC-02 | Upload foto | Simpan foto selfie ke Supabase Storage bucket | P0 |
| TEC-03 | Loading states | Skeleton & spinner untuk semua operasi async | P0 |
| TEC-04 | Empty states | Ilustrasi + pesan saat data kosong | P1 |
| TEC-05 | Error handling | Toast notifikasi sukses/error via sonner | P0 |
| TEC-06 | RLS (Row Level Security) | Policy per tabel di Supabase sesuai role | P0 |

---

## 5. Alur Pengguna (User Flows)

### 5.1 Flow: Clock-In
```
Login (GURU) → Halaman Guru → Klik "Clock-In" 
→ Pilih Sekolah → GPS diaktifkan (browser prompt) 
→ Validasi lokasi vs radius sekolah 
→ Jika dalam radius: Kamera terbuka → Foto selfie 
→ Opsional: isi catatan → Submit → Toast sukses
→ Redirect ke riwayat
```

### 5.2 Flow: Clock-Out
```
Login (GURU) → Halaman Guru → Lihat sesi aktif 
→ Klik "Clock-Out" → GPS diaktifkan
→ Validasi radius → Foto selfie → Submit
→ Hitung durasi (clock_out - clock_in) → Toast sukses
```

### 5.3 Flow: Laporan Manager
```
Login (MANAGER) → Dashboard → Lihat ringkasan & grafik
→ Klik "Laporan Detail" → Filter (bulan, guru, status)
→ Tabel muncul → Klik "Export Excel" → File terunduh
```

---

## 6. Struktur Data

### 6.1 Entity Relationship (Ringkasan)

```
profiles (1) ──── (1) teachers
profiles (1) ──── (M) manager_schools (M) ──── (1) schools
teachers (1) ──── (M) teacher_schools (M) ──── (1) schools
teachers (1) ──── (M) attendances (M) ──── (1) schools
```

### 6.2 Tabel Utama

| Tabel | Fungsi |
|-------|--------|
| `profiles` | Data user (full_name, role, phone, email) |
| `schools` | Data sekolah (name, address, lat, lng, radius_meter) |
| `teachers` | Data guru (user_id FK, subjects array) |
| `teacher_schools` | Relasi many-to-many guru ↔ sekolah |
| `manager_schools` | Relasi many-to-many manager ↔ sekolah |
| `attendances` | Data absensi (clock_in, clock_out, lokasi, foto, status) |

---

## 7. Non-Functional Requirements

| Kategori | Requirement |
|----------|-------------|
| **Performa** | Page load < 2 detik (First Contentful Paint) |
| **Performa** | Upload foto < 5 detik (rata-rata 500KB) |
| **Keamanan** | Semua API route dilindungi middleware auth |
| **Keamanan** | RLS aktif di semua tabel Supabase |
| **Keamanan** | Validasi input dengan Zod di client & server |
| **Kompatibilitas** | Chrome, Firefox, Safari (2 versi terakhir) |
| **Kompatibilitas** | Mobile browser (GPS & kamera harus berfungsi di Android/iOS) |
| **Availability** | Uptime ≥ 99.9% (via Vercel + Supabase) |
| **Storage** | Foto selfie disimpan di Supabase Storage, auto-compress |

---

## 8. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| **UI Library** | shadcn/ui + Lucide React icons |
| **State** | Server Components + Client Components (minimal) |
| **Backend** | Next.js API Routes (Route Handlers) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (email/password) + SSR |
| **Storage** | Supabase Storage (bucket: `attendance-photos`) |
| **Charts** | Recharts |
| **Export** | xlsx (Excel) |
| **Date** | date-fns |
| **Forms** | react-hook-form + zod |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 9. Milestone & Timeline

| Milestone | Status | Target |
|-----------|--------|--------|
| M1: Project setup + dependencies ✅ | Selesai | - |
| M2: Supabase client + auth setup ✅ | Selesai | - |
| M3: Halaman login/register ✅ | Selesai | - |
| M4: Layout dashboard + sidebar ✅ | Selesai | - |
| M5: Modul Admin (CRUD sekolah, guru, user) ✅ | Selesai | - |
| M6: Modul Guru (clock-in/out + riwayat) ✅ | Selesai | - |
| M7: Modul Manager (dashboard + laporan) ✅ | Selesai | - |
| M8: Polish — empty states, error handling, loading | Belum | Q3 2026 |
| M9: Testing + bug fixing | Belum | Q3 2026 |
| M10: Deployment & UAT | Belum | Q3 2026 |

---

## 10. Success Metrics

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| Adoption rate | 100% GTT aktif pakai dalam 2 minggu | Hitung distinct teacher_id di attendances |
| GPS validation rate | ≥ 95% absensi dalam radius | Bandingkan total absensi vs yang lolos validasi |
| Export usage | ≥ 80% manager export laporan tiap bulan | Log hit API export |
| Error rate | < 5% gagal upload foto | Bandingkan upload attempts vs sukses |
| User satisfaction | ≥ 4/5 | Google Form survey setelah 1 bulan |

---

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| GPS tidak akurat di dalam ruangan | Clock-in gagal padahal guru di sekolah | Tambah opsi "verifikasi manual" untuk admin |
| Foto selfie gagal (izin kamera, memori) | Clock-in/out terhambat | Fallback: upload dari galeri; kompres otomatis |
| Koneksi internet lambat/gangguan | Data absensi tidak tersimpan | Implementasi retry logic + loading state jelas |
| Guru lupa clock-in/out | Data absensi tidak lengkap | Notifikasi reminder (opsional — fase 2) |
| Battery drain GPS/kamera | Pengalaman pengguna buruk | Optimasi: hanya aktifkan GPS saat clock-in/out |

---

## 12. Future Scope (Fase 2)

- Notifikasi reminder via WhatsApp/Email
- Multi-bahasa (Indonesia + Inggris)
- Laporan PDF
- Dashboard superadmin untuk yayasan (lintas sekolah)
- Manajemen jadwal mengajar GTT
- Integrasi penggajian (jumlah jam × tarif)
- Dark mode

---

*Dokumen ini disusun berdasarkan spesifikasi teknis (SPEC.md) dan implementasi现有 kode sumber Absensi GTT.*
