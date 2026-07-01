# Desain Sistem — Absensi GTT

> **Versi:** 1.0  
> **Status:** Final  
> **Tanggal:** 30 Juni 2026  
> **Framework:** Next.js 14 (App Router) + shadcn/ui + Tailwind CSS

---

## 1. Design Philosophy

Aplikasi Absensi GTT mengusung desain **modern dashboard** dengan nuansa profesional, bersih, dan efisien. Terinspirasi dari dashboard admin modern seperti Linear, Vercel Dashboard, dan shadcn/ui aesthetic.

**Prinsip desain:**
- **Clarity first** — user menyelesaikan tugas tanpa kebingungan
- **Progressive disclosure** — tampilkan informasi penting dulu, detail bisa diakses kemudian
- **Mobile-aware** — GPS & kamera adalah fitur mobile; desain harus responsif
- **Accessible** — kontras cukup, label jelas, navigasi keyboard possible

---

## 2. Design Tokens

### 2.1 Color Palette

```css
/* Primary — brand identity */
--primary:         #6366f1  /* Indigo-500 */
--primary-foreground: #ffffff
--primary-hover:   #4f46e5  /* Indigo-600 */

/* Secondary — accent pendukung */
--secondary:       #8b5cf6  /* Violet-500 */
--secondary-foreground: #ffffff

/* Accent — sukses/positif */
--accent:          #10b981  /* Emerald-500 */
--accent-foreground: #ffffff

/* Surface & Background */
--background:      #f8fafc  /* Slate-50 */
--surface:         #ffffff  /* White */
--sidebar:         #0f172a  /* Slate-900 (dark sidebar) */

/* Text */
--text:            #0f172a  /* Slate-900 */
--text-muted:      #64748b  /* Slate-500 */
--text-light:      #94a3b8  /* Slate-400 */
--text-inverse:    #ffffff

/* Border */
--border:          #e2e8f0  /* Slate-200 */

/* Semantic */
--success:         #22c55e  /* Green-500 */
--warning:         #f59e0b  /* Amber-500 */
--error:           #ef4444  /* Red-500 */
--info:            #3b82f6  /* Blue-500 */
```

### 2.2 Typography

| Elemen | Font | Weight | Size | Line Height |
|--------|------|--------|------|-------------|
| **Headings** | Inter | Bold (700) | 2xl-4xl | 1.2 |
| **Body** | Inter | Regular (400) | sm (14px) / base (16px) | 1.5 |
| **Small/Muted** | Inter | Regular (400) | xs (12px) - sm (14px) | 1.4 |
| **Monospace** | JetBrains Mono / Geist Mono | Medium (500) | sm (14px) | 1.4 |
| **Sidebar nav** | Inter | Medium (500) | sm (14px) | - |

**Hierarki Heading:**
```
Page Title →   text-3xl font-bold tracking-tight
Section →      text-2xl font-semibold
Card Title →   text-lg font-semibold
Sub-label →    text-sm font-medium text-muted-foreground
```

### 2.3 Spacing

| Token | Value | Tailwind |
|-------|-------|----------|
| Page padding | 1.5rem | p-6 |
| Card padding | 1.5rem | p-6 |
| Section gap | 2rem | gap-8 |
| Stack gap (vertical) | 1rem | space-y-4 |
| Inline gap | 0.75rem | gap-3 |
| Container max-width | 1280px | max-w-7xl |
| Sidebar width | 256px | w-64 |
| Sidebar collapsed | 64px | w-16 |

### 2.4 Border Radius

| Elemen | Radius | Tailwind |
|--------|--------|----------|
| Cards | 0.5rem | rounded-lg |
| Buttons (default) | 0.375rem | rounded-md |
| Badges | 9999px | rounded-full |
| Modal/Dialog | 0.75rem | rounded-xl |
| Input fields | 0.375rem | rounded-md |
| Avatar | 9999px | rounded-full |

### 2.5 Shadows

```css
/* Card */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Dropdown */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Modal */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## 3. Layout Structure

### 3.1 Main Layout (Dashboard)

```
┌──────────┬────────────────────────────────────────────┐
│          │  Header                                    │
│ Sidebar  │  ┌─ Breadcrumb ─────────────────────────┐  │
│  256px   │  │  Page Title                          │  │
│          │  └──────────────────────────────────────┘  │
│  • Home  │                                            │
│  • Guru  │  ┌───────────┐ ┌───────────┐ ┌───────────┐│
│  • ...   │  │ StatCard  │ │ StatCard  │ │ StatCard  ││
│          │  └───────────┘ └───────────┘ └───────────┘│
│  [User]  │                                            │
│  [Logout]│  ┌──────────────────────────────────────┐  │
│          │  │  Table / Content Area                │  │
│          │  │                                      │  │
│          │  └──────────────────────────────────────┘  │
└──────────┴────────────────────────────────────────────┘
```

### 3.2 Auth Layout

```
┌────────────────────────────────────────┐
│                                        │
│           ┌──────────────────┐         │
│           │   Logo           │         │
│           │                  │         │
│           │   Login Form     │         │
│           │   ──────────     │         │
│           │   Email          │         │
│           │   Password       │         │
│           │   [Submit]       │         │
│           │                  │         │
│           └──────────────────┘         │
│                                        │
└────────────────────────────────────────┘
```

---

## 4. Komponen UI

### 4.1 Global Components (shadcn/ui)

| Komponen | Source | Customization |
|----------|--------|---------------|
| Button | shadcn/ui | Variants: default, outline, ghost, destructive; Sizes: sm, default, lg |
| Card | shadcn/ui | Header, Content, Footer slots |
| Input | shadcn/ui | With label, error state, disabled state |
| Select | shadcn/ui | Native-feel dropdown dengan trigger + content |
| Badge | shadcn/ui | Variants: default, secondary, outline, success, warning, error |
| Table | shadcn/ui | Sortable headers via state, striped rows opsional |
| Dialog | shadcn/ui | Modal untuk form CRUD, konfirmasi hapus |
| DropdownMenu | shadcn/ui | User menu, action per row di tabel |
| Avatar | shadcn/ui | User avatar dengan fallback inisial |
| Skeleton | shadcn/ui | Loading placeholder untuk card & tabel |
| Tabs | shadcn/ui | Navigasi konten dalam satu halaman |
| Separator | shadcn/ui | Divider horizontal/vertikal |
| Sheet | shadcn/ui | Slide-over panel untuk sidebar mobile |
| Sonner | shadcn/ui | Toast notifikasi (sonner library) |
| Alert | shadcn/ui | Alert untuk error/warning/info |
| Popover | shadcn/ui | Date picker container |
| Calendar | shadcn/ui | Date picker (react-day-picker) |
| Textarea | shadcn/ui | Multi-line input untuk catatan |
| Label | shadcn/ui | Form label |

### 4.2 Layout Components (Kustom)

#### Sidebar (`Sidebar.tsx`)
- **Desktop:** Fixed sidebar, 256px width, dark background (Slate-900)
- **Mobile:** Sheet (slide-over) yang muncul via hamburger button
- **Items:** Logo di atas, navigasi berdasarkan role, user info + logout di bawah
- **Active state:** Indigo highlight pada link aktif
- **Icons:** Lucide React icons untuk setiap nav item

**Navigasi per Role:**

| Role | Menu Items |
|------|-----------|
| **ADMIN** | Dashboard, Kelola Guru, Kelola Sekolah, Kelola User |
| **GURU** | Dashboard, Absensi, Riwayat |
| **MANAGER** | Dashboard, Laporan Detail |

#### Header (`Header.tsx`)
- **Content:** Page title (dinamis), breadcrumbs opsional
- **Height:** ~64px, border-bottom tipis
- **Mobile:** Tombol hamburger untuk toggle sidebar

#### StatCard (`StatCard.tsx`)
- **Props:** icon, label, value, description (opsional)
- **Layout:** Card kecil dengan icon di kiri, value + label di kanan
- **Variant:** Default (putih) atau colored (sesuai semantic)
- **Loading state:** Skeleton placeholder

```
┌──────────────────────────┐
│  ┌────┐                  │
│  │ 🏫 │  Total Guru      │
│  │    │  42              │
│  └────┘                  │
└──────────────────────────┘
```

### 4.3 Feature-Specific Components

#### AttendanceForm (Halaman Absensi Guru)
- **Step-by-step wizard-style:**
  1. Pilih sekolah dari dropdown
  2. Deteksi lokasi GPS (dengan fallback manual input)
  3. Validasi radius — tampilkan "Dalam Radius ✅" atau "Di Luar Radius ❌"
  4. Kamera/foto selfie (file input → preview)
  5. Catatan opsional (textarea)
  6. Tombol Clock-In / Clock-Out
- **Loading state:** Tombol disabled + spinner saat submit
- **Error state:** Alert merah jika GPS gagal / foto terlalu besar
- **Success state:** Toast sukses + redirect

#### AttendanceTable
- **Kolom:** No, Tanggal, Sekolah, Jam Masuk, Jam Pulang, Durasi, Status, Aksi
- **Status Badge:**
  - `HADIR` → hijau (bg-green-100 text-green-800)
  - `TIDAK_HADIR` → merah (bg-red-100 text-red-800)
  - `BELUM_CLOCK_OUT` → kuning (bg-amber-100 text-amber-800)
- **Empty state:** Ilustrasi + "Belum ada data absensi"

#### StatCard (Dashboard)
- Grid 1-4 kolom tergantung screen
- Icon + value besar + label + trend indicator (opsional)

#### ChartCard (Manager Dashboard)
- Card wrapper dengan title + line chart
- Line chart dari Recharts dengan data kehadiran harian
- Tooltip saat hover, responsive

---

## 5. Page Inventory & Layout

### 5.1 Auth Pages

| Halaman | Route | Layout | Elemen |
|---------|-------|--------|--------|
| Login | `/login` | Auth (centered card) | Form email+password, tombol login, link ke register |
| Register | `/register` | Auth (centered card) | Form email+password+role, tombol register |

### 5.2 Admin Pages

| Halaman | Route | Komponen Utama |
|---------|-------|----------------|
| Dashboard Admin | `/admin` | 3 StatCard (Total Guru, Sekolah, User) |
| Kelola Guru | `/admin/guru` | DataTable + Dialog form CRUD |
| Kelola Sekolah | `/admin/sekolah` | DataTable + Dialog form CRUD (dengan input lat/lng) |
| Kelola User | `/admin/user` | DataTable + Dialog form CRUD |

### 5.3 Guru Pages

| Halaman | Route | Komponen Utama |
|---------|-------|----------------|
| Dashboard Guru | `/guru` | StatCard status hari ini + tombol clock-in/out |
| Absensi | `/guru/absensi` | AttendanceForm (wizard GPS + foto) |
| Riwayat | `/guru/riwayat` | AttendanceTable + filter tanggal |

### 5.4 Manager Pages

| Halaman | Route | Komponen Utama |
|---------|-------|----------------|
| Dashboard Manager | `/manager` | StatCard ringkasan + ChartCard (line chart tren) |
| Detail Absensi | `/manager/absensi` | AttendanceTable + filter (guru, tanggal, status) |
| Laporan | `/manager/laporan` | Filter form + tabel + tombol export Excel/CSV |

---

## 6. Responsive Design

| Breakpoint | Width | Layout |
|------------|-------|--------|
| **Mobile** | < 640px | Single column, sidebar jadi sheet, card full width, tabel horizontal scroll |
| **Tablet** | 640-1024px | 2 column grid, sidebar tetap tapi tipis, tabel tetap |
| **Desktop** | > 1024px | 3-4 column grid, sidebar penuh 256px, semua elemen normal |

**Mobile-specific adjustments:**
- Sidebar → Sheet (slide dari kiri, hamburger button di header)
- StatCards → 1-2 column grid
- DataTable → horizontal scroll wrapper
- AttendanceForm → full screen step-by-step
- Tombol aksi → full width

---

## 7. Interaction & Micro-interactions

### 7.1 Loading States

| State | Implementasi |
|-------|-------------|
| **Page load** | Suspense + Skeleton untuk tabel & card |
| **Form submit** | Tombol disabled + spinner (lucide `Loader2`) |
| **Data fetch** | Skeleton rows / shimmer animation |
| **Image upload** | Progress bar atau spinner overlay pada preview foto |
| **GPS detection** | "Mendeteksi lokasi..." dengan spinner |

### 7.2 Transitions

- Sidebar: `translate-x` dengan transition 300ms ease
- Modal/Dialog: fade + scale (default shadcn)
- Dropdown: fade in 150ms
- Toast: slide in from right, auto-dismiss 4s

### 7.3 Feedback

| Action | Feedback |
|--------|----------|
| Sukses clock-in | ✅ Toast hijau "Clock-in berhasil" |
| Gagal GPS | ❌ Toast merah "Lokasi tidak terdeteksi. Aktifkan GPS" |
| Validasi radius gagal | ⚠️ Alert "Anda berada di luar radius sekolah (X meter)" |
| Data berhasil disimpan | ✅ Toast "Data berhasil disimpan" |
| Konfirmasi hapus | Dialog "Yakin ingin menghapus?" |
| Error server | ❌ Toast "Terjadi kesalahan. Coba lagi." |

---

## 8. States Visual Reference

Setiap komponen yang menampilkan data harus mencakup **4 state**:

```
┌──────────────────────┐    ┌──────────────────────┐
│  Loading State       │    │  Empty State         │
│                      │    │                      │
│  ┌────┐ ┌────┐       │    │     📭               │
│  │████│ │████│       │    │  Belum ada data      │
│  │████│ │████│       │    │  absensi hari ini    │
│  └────┘ └────┘       │    │                      │
└──────────────────────┘    └──────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐
│  Error State         │    │  Success/Data State  │
│                      │    │                      │
│  ❌ Gagal memuat     │    │  ✅ 12 data ditemukan│
│  [Coba Lagi]         │    │  [Tabel Data Lengkap]│
└──────────────────────┘    └──────────────────────┘
```

---

## 9. Iconography

- **Library:** Lucide React
- **Style:** Regular outline, 1.25px stroke
- **Size:** 
  - Nav icons: 20px (w-5)
  - Card icons: 24px (w-6) 
  - Button icons: 16px (w-4)
  - Page empty state: 48-64px
- **Key icons per fitur:**

| Fitur | Icon |
|-------|------|
| Dashboard | `LayoutDashboard` |
| Guru | `ChalkboardTeacher` / `Users` |
| Sekolah | `Building2` / `School` |
| User | `UserCircle` |
| Absensi | `ClipboardCheck` |
| Laporan | `FileSpreadsheet` |
| Clock-in | `LogIn` |
| Clock-out | `LogOut` |
| Riwayat | `History` |
| Export | `Download` |
| Filter | `Filter` |
| GPS | `MapPin` |

---

## 10. Animasi & Micro-interactions (Advanced)

Animasi akan diimplementasikan secara bertahap menggunakan Tailwind CSS animate utilities + framer-motion (opsional fase 2).

**Saat ini:**
- Hover: scale-101 pada card, bg shift pada button
- Focus: ring-2 ring-primary pada input
- Active: scale-95 pada button klik
- Loading: animate-spin pada Loader2 icon
- Skeleton: animate-pulse

---

## 11. Aksesibilitas

- Semua form input punya `<label>` eksplisit
- Color contrast ratio ≥ 4.5:1 untuk text normal
- Focus visible pada semua interactive element
- Role attributes pada custom components
- Alt text pada icon (sr-only)
- Keyboard navigable (Tab, Enter, Escape)
- Error messages terasosiasi dengan input via `aria-describedby`

---

## 12. File & Folder Structure (Frontend)

```
src/
├── app/
│   ├── (auth)/                    # Auth layout group
│   │   ├── layout.tsx             # Centered card layout
│   │   ├── login/page.tsx         # Login form page
│   │   └── register/page.tsx      # Register form page
│   ├── (dashboard)/               # Dashboard layout group
│   │   ├── layout.tsx             # Sidebar + header + main
│   │   ├── page.tsx               # Redirect based on role
│   │   ├── admin/                 # Admin pages
│   │   ├── guru/                  # Guru pages
│   │   └── manager/               # Manager pages
│   ├── api/                       # API route handlers
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing / redirect
│   └── globals.css                # Tailwind + custom CSS
├── components/
│   ├── ui/                        # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Header.tsx             # Dashboard header
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   └── StatCard.tsx           # Statistic card
│   ├── attendance/                # (future) Attendance-specific components
│   ├── reports/                   # (future) Report components
│   └── charts/                    # (future) Chart wrappers
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── middleware.ts          # Auth middleware
│   └── utils.ts                   # cn() utility
├── types/
│   └── index.ts                   # TypeScript interfaces
└── middleware.ts                  # Next.js middleware
```

---

## 13. Component Hierarchy (Key Pages)

### Halaman Absensi Guru
```
Page (/guru/absensi)
├── PageHeader (title + breadcrumb)
└── AttendanceForm
    ├── SchoolSelect (dropdown)
    ├── GPSStatus (alert success/error)
    ├── PhotoUpload (preview + input)
    ├── NotesInput (textarea)
    └── SubmitButton (Clock-In / Clock-Out)
```

### Halaman Dashboard Manager
```
Page (/manager)
├── PageHeader (title + periode)
├── Grid
│   ├── StatCard (Total Hari)
│   ├── StatCard (Persentase Hadir)
│   └── StatCard (Total Jam)
└── ChartCard
    └── LineChart (tren kehadiran)
```

### Halaman Laporan Manager
```
Page (/manager/laporan)
├── PageHeader
├── FilterBar
│   ├── Select (Guru)
│   ├── DatePicker (Start)
│   ├── DatePicker (End)
│   ├── Select (Status)
│   └── Button (Export Excel)
└── DataTable (AttendanceTable)
    ├── ColumnHeaders (sortable)
    ├── Row → Badge status
    └── Pagination
```

---

*Dokumen desain ini mereferensi implementasi现有 dari SPEC.md, komponen shadcn/ui yang terinstal, dan struktur kode sumber Absensi GTT.*
