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