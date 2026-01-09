Sisa itu Real Conten yang mau di fokuskan misalnya kuliner, bumdes mart, perikanan, Agen LPG, Wisata Malam.

halamanya gitu..

---

## 📋 Daftar Tampilan Selanjutnya (To-Do List)

Berdasarkan Roadmap, berikut adalah halaman/tampilan yang perlu dibuat selanjutnya:

### 1. Halaman Detail Produk (`/layanan/[slug]` atau `[id]`)
- [x] Tampilan detail foto produk (Gallery).
- [x] Deskripsi lengkap.
- [x] Pilihan varian (jika ada, misal: Pedas/Sedang).
- [x] Tombol **"Tambah ke Keranjang"**.

### 2. Fitur Keranjang Belanja (Shopping Cart)
- [x] **Cart Sidebar/Drawer**: Muncul dari kanan saat klik ikon keranjang.
- [x] List item yang dipilih.
- [x] Tombol **"Checkout"**.

### 3. Halaman Checkout (`/checkout`)
- [x] Form Data Diri (Nama, No HP).
- [x] Dropdown Alamat/Dusun.
- [x] Ringkasan Pesanan.
- [x] Tombol **"Pesan via WhatsApp"** (Redirect ke WA Admin).

### 4. Admin Dashboard (Opsional / Tahap Akhir)
- [x] Halaman Login Admin.
- [x] Dashboard: Penyesuaian tampilan (Isi Card KPI, Table Filter Layanan, Remove unused buttons).
- [x] Dashboard Input Fitur Lain (Produk Baru, Berita, dll).
    - [x] Fitur Berita (Tabel, Filter, Gambar, Form Create/Edit).
    - [x] Fitur Produk (Tabel Tabs Kategori, Mock Data, Form Create/Edit/Detail, Featured Tag).
    - [x] Fitur Layanan (Tabel Tabs Kategori, Mock Data, Form Create/Edit/Detail).
    - [x] Fitur Transaksi (Rekap Pesanan, Status Update, Invoice View).
    - [x] Fitur Users (Daftar Pengguna, Role, Status).
- [x] Rekap Pesanan Masuk.

---

## 📅 Logbook: Malam Ini (Checkout & Reviews + Feedback Sekdes)

**Target Utama:**
1.  **Membereskan Logic Checkout**: Agar data persanan tersimpan otomatis ke database sebelum redirect ke WhatsApp (`Orders` table).
2.  **Fitur Ulasan (Reviews)**: Menambahkan kolom komentar/rating untuk produk.

**Saran & Masukan Pak Sekdes (To-Be Implemented):**
*   **Theme**: Ubah warna dominan website menjadi **Biru & Putih**.
*   **Stock**: Tambah fitur stok barang (khususnya LPG, Perikanan).
*   **Home Page**: Tampilkan semua layanan & tambah section "Produk Unggulan Desa".
*   **Kurir**: Tambah opsi pengiriman (Kurir / Ambil Sendiri).
*   **WhatsApp**:
    *   Floating Bubble WA di semua halaman.
    *   Setup Nomor HP Admin di Profile untuk kontak produk.

---

## 🕒 Update Terkini: Refactoring Tampilan
**Baru Saja Dikerjakan:**
- [x] **Refactor ServiceShowcase**: Memperbaiki layout grid pada `ServiceShowcase` agar neat dan responsif (Mobile/Desktop friendly). Memastikan susunan kartu layanan, spacing, dan tipografi konsisten.

## 🚀 Roadmap Backend & Full-Stack Integration

Rencana lengkap untuk menghidupkan seluruh fitur dashboard dan frontend.

### 1. Database & Schema Updates (`schema.prisma`)
Sebelum coding logic, kita perlu melengkapi tabel database.
- [x] **Model `News` (Berita)**:
    - Field: `title`, `slug` (unique), `content` (Rich Text/HTML), `thumbnail`, `author`, `publishedAt`.
- [x] **Model `User` (Manajemen Pengguna)**:
    - *Refactor*: Rename/Update model `Admin` menjadi `User`.
    - Field: `role` (Enum: `SUPER_ADMIN`, `STAFF`), `isActive`.
- [x] **Seeding Data**:
    - Buat script `prisma/seed.ts` yang mengisi data awal utk semua modul (5 Berita, 3 User, 10 Produk).

### 2. Logic: Public (Pengunjung Website)
- [x] **Berita (News)**:
    - `getNewsList`: Pagination (misal 6 berita per halaman) + Search.
    - `getNewsDetail`: Baca berita lengkap berdasarkan slug.
    - `getRecentNews`: Widget "Berita Terbaru" di sidebar/home.
- [x] **Layanan & Produk**:
    - Unifikasi logic `Product` namun difilter berdasarkan Kategori (`WISATA` = Layanan, `MART` = Produk).
    - `getAllServices`: Fetch data kategori Wisata/Jasa.
    - `getAllProducts`: Fetch data kategori Mart/Kuliner.
- [x] **Checkout System**: (Prioritas Tinggi)
    - Logic simpan Order ke DB -> Redirect WA.

### 3. Logic: Admin Dashboard
**A. Dashboard Overview (`/admin/dashboard`)**
- [x] **KPI Stats**: Hitung total `Pending Orders`, `Total Products`, `Total News`.
- [x] **Recent Activity**: List 5 pesanan/review terbaru.

**B. Modul Manajemen (`CRUD`)**
- [x] **News Management (`/admin/dashboard/news`)**:
    - [x] Create/Edit dengan Rich Text Editor sederhana (Logic Ready).
    - [x] Upload Thumbnail Berita (Field Ready).
- [x] **Products & Services (`/admin/dashboard/products` & `/services`)**:
    - [x] Bedakan UI input berdasarkan kategori (misal: "Layanan" butuh info *Durasi*, "Produk" butuh info *Stok*) (Logic Ready).
    - [x] Upload Gallery foto produk (Field Ready).
- [x] **Users Management (`/admin/dashboard/users`)**:
    - [x] List semua staff/admin.
    - [x] Fitur *Add New User* (misal untuk pegawai baru).
    - [x] Fitur *Change Role* atau *Deactivate Account*.
- [x] **Transactions (`/admin/dashboard/transactions`)**:
    - [x] Filter by Status (Pending, Completed).
    - [x] Button "Mark as Done" / "Cancel" (Status Update Ready).
    - [x] Cetak/View Invoice sederhana (opsional). ubkin dalam pdf hasinya (Data Ready).

**C. Admin Settings**
- [x] **Profile (`/admin/dashboard/profile`)**:
    - [x] Update data diri (Nama, No HP) (Logic Ready).
    - [x] **Change Password** (Penting!) (Logic Ready).

### 4. Integrasi & Utilitas
- [X] **Authentication**: Login session (NextAuth).
- [ ] **Image Upload**: Setup API route untuk upload file (bisa ke local storage `/public/uploads` atau cloud).
- [x] **Middleware**: Proteksi rute `/admin/*` agar tidak bisa ditembus tanpa login.

---

## 🔐 Panduan Cepat Implementasi Auth (Fast Track 1 Jam)

Berikut adalah langkah-langkah *copy-paste* untuk setup NextAuth v5 dengan Login Session.

### 1. Install Library
Terminal (jalankan di folder project):
```bash
pnpm add next-auth@beta @auth/prisma-adapter bcryptjs
pnpm add -D @types/bcryptjs
```

### 2. Update Database (`prisma/schema.prisma`)
Ganti model `Admin` dengan `User` dan tambah tabel session.

```prisma
// ... (datasource block)

// 1. UBAH/HAPUS model Admin lama, dan gunakan ini:
model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  password      String?   // Hashed password
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  role          String    @default("STAFF") // SUPER_ADMIN, STAFF
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

// 2. TAMBAHKAN model-model ini (Standard NextAuth):
model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```
*Setelah update, jalankan: `npx prisma db push`*

### 3. Config Env (`.env`)
```bash
AUTH_SECRET="rahasia_super_secure_bisa_generate_pake_openssl"
```

### 4. Setup Auth Config (`src/auth.ts`)
Buat file baru: `src/auth.ts`

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/server/db"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login", // Halaman login kita sendiri
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = z
          .object({ username: z.string(), password: z.string().min(1) })
          .safeParse(credentials)

        if (!parsed.success) return null
        const { username, password } = parsed.data

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user || !user.password) return null

        const match = await bcrypt.compare(password, user.password)
        if (match) return user
        
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### 5. Buat API Route (`src/app/api/auth/[...nextauth]/route.ts`)
Buat file ini (perhatikan folder `[...nextauth]`):

```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### 6. Middleware Protection (`src/middleware.ts`)
Buat file `src/middleware.ts` (sejajar dengan folder `app`):

```typescript
import NextAuth from "next-auth"
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/admin/dashboard")
  
  if (isOnDashboard) {
    if (isLoggedIn) return true
    return Response.redirect(new URL("/auth/login", req.nextUrl))
  }
  return true
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### 7. Login Page Integration
Di halaman login (`src/app/auth/login/page.tsx`), panggil server action `signIn`.
Contoh Server Action di form:
```typescript
import { signIn } from "@/auth"

export default function Page() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <input name="username" type="text" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Sign in</button>
    </form>
  )
}
```

