# Absensi GTT

Aplikasi web full-stack untuk mengelola kehadiran Guru Tidak Tetap (GTT) / Guru Terbang di sekolah-sekolah.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI:** shadcn/ui + Lucide React icons
- **Backend:** Next.js API Routes
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Charts:** Recharts
- **Export:** xlsx

## Setup

1. **Clone & install:**
   ```bash
   npm install
   ```

2. **Setup Supabase:**
   - Buat project di [supabase.com](https://supabase.com)
   - Copy `.env.example` → `.env.local`
   - Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari Supabase dashboard

3. **Setup database:**
   - Jalankan SQL schema di Supabase SQL Editor
   - Enable RLS (Row Level Security) di semua tabel

4. **Run:**
   ```bash
   npm run dev
   ```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

App deploys ke Vercel. Set environment variables di Vercel dashboard.

## Features

- **Admin:** CRUD sekolah, guru, user
- **Guru:** Clock-in/out dengan GPS + selfie
- **Manager:** Dashboard + laporan + export Excel/CSV
