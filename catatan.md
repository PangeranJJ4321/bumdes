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
- [ ] **Model `News` (Berita)**:
    - Field: `title`, `slug` (unique), `content` (Rich Text/HTML), `thumbnail`, `author`, `publishedAt`.
- [ ] **Model `User` (Manajemen Pengguna)**:
    - *Refactor*: Rename/Update model `Admin` menjadi `User`.
    - Field: `role` (Enum: `SUPER_ADMIN`, `STAFF`), `isActive`.
- [ ] **Seeding Data**:
    - Buat script `prisma/seed.ts` yang mengisi data awal utk semua modul (5 Berita, 3 User, 10 Produk).

### 2. Logic: Public (Pengunjung Website)
- [ ] **Berita (News)**:
    - `getNewsList`: Pagination (misal 6 berita per halaman) + Search.
    - `getNewsDetail`: Baca berita lengkap berdasarkan slug.
    - `getRecentNews`: Widget "Berita Terbaru" di sidebar/home.
- [ ] **Layanan & Produk**:
    - Unifikasi logic `Product` namun difilter berdasarkan Kategori (`WISATA` = Layanan, `MART` = Produk).
    - `getAllServices`: Fetch data kategori Wisata/Jasa.
    - `getAllProducts`: Fetch data kategori Mart/Kuliner.
- [ ] **Checkout System**: (Prioritas Tinggi)
    - Logic simpan Order ke DB -> Redirect WA.

### 3. Logic: Admin Dashboard
**A. Dashboard Overview (`/admin/dashboard`)**
- [ ] **KPI Stats**: Hitung total `Pending Orders`, `Total Products`, `Total News`.
- [ ] **Recent Activity**: List 5 pesanan/review terbaru.

**B. Modul Manajemen (`CRUD`)**
- [ ] **News Management (`/admin/dashboard/news`)**:
    - [ ] Create/Edit dengan Rich Text Editor sederhana.
    - [ ] Upload Thumbnail Berita.
- [ ] **Products & Services (`/admin/dashboard/products` & `/services`)**:
    - [ ] Bedakan UI input berdasarkan kategori (misal: "Layanan" butuh info *Durasi*, "Produk" butuh info *Stok*).
    - [ ] Upload Gallery foto produk.
- [ ] **Users Management (`/admin/dashboard/users`)**:
    - [ ] List semua staff/admin.
    - [ ] Fitur *Add New User* (misal untuk pegawai baru).
    - [ ] Fitur *Change Role* atau *Deactivate Account*.
- [ ] **Transactions (`/admin/dashboard/transactions`)**:
    - [ ] Filter by Status (Pending, Completed).
    - [ ] Button "Mark as Done" / "Cancel".
    - [ ] Cetak/View Invoice sederhana (opsional).

**C. Admin Settings**
- [ ] **Profile (`/admin/dashboard/profile`)**:
    - [ ] Update data diri (Nama, No HP).
    - [ ] **Change Password** (Penting!).

### 4. Integrasi & Utilitas
- [ ] **Authentication**: Login session (NextAuth atau custom JWT cookies).
- [ ] **Image Upload**: Setup API route untuk upload file (bisa ke local storage `/public/uploads` atau cloud).
- [ ] **Middleware**: Proteksi rute `/admin/*` agar tidak bisa ditembus tanpa login.

