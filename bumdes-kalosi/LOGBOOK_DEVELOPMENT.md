# Logbook Pengembangan

## Manajemen Multi-Toko (Staf)
Implementasi akses staf multi-toko. Staf kini memiliki hak penuh mengelola (CRUD) produk, layanan, ringkasan, dan transaksi mereka sendiri, terbatas secara ketat hanya pada data unit bisnis khusus mereka.

## Logika Unit Khusus (Perikanan & Wisata)
Menonaktifkan fitur keranjang belanja untuk unit 'Ikan' dan 'Wisata Malam', difokuskan pada tampilan berita/informasi. Unit 'Wisata Malam' dikonfigurasi khusus hanya untuk penjualan tiket.

## Sistem Laporan Keuangan
Mengembangkan fitur rekap keuangan. Sistem mendukung pembuatan laporan keuangan parsial dan lengkap yang diekspor ke Excel, mencakup periode mingguan, bulanan, dan tahunan.

## Ekspansi Galeri
Menambahkan fitur galeri pada halaman 'Tentang Kami'. Termasuk pembuatan halaman baru untuk melihat koleksi gambar dan video kegiatan BUMDes yang lebih lengkap.

## Ubah Gaya Global & Dashboard (Culturally Arts)
Memperbarui estetika web menjadi tema 'Culturally Arts'. Perubahan visual ini diterapkan pada halaman publik global dan antarmuka dashboard internal untuk tampilan yang lebih berbudaya.

## Fitur Komentar Berita
Menambahkan fitur komentar pada halaman Berita, memungkinkan interaksi pengguna pada artikel yang dipublikasikan.

## Fitur Lupa Password
Menyelesaikan fitur 'Lupa Password', memastikan pengguna dapat memulihkan akses akun mereka kembali dengan aman.

## Pewarnaan Error Validasi
Memperbaiki tampilan error validasi pada form agar berwarna merah, sehingga lebih jelas terlihat oleh pengguna saat terjadi kesalahan input.

## Integrasi Fonnte
Menyelesaikan integrasi dengan API Fonnte untuk layanan notifikasi dan pesan WhatsApp otomatis.

## Kontak Penjual Langsung
Mengatur tombol 'Tanya Penjual' agar pesan WhatsApp diteruskan langsung ke nomor staf yang memegang produk tersebut, bukan ke super admin.

## Penanganan Pesanan Multi-Staf
Mengimplementasikan logika untuk menangani pesanan yang berisi produk dari staff berbeda. Sistem kini memisahkan dan meneruskan detail pesanan ke masing-masing staf terkait.

## Migrasi WhatsApp Cloud API (Official)
Mengganti engine notifikasi dari Fonnte (unofficial) ke WhatsApp Cloud API resmi Meta. Meningkatkan privasi dan stabilitas. Termasuk penyesuaian kode backend dan panduan setup template pesan (Production Ready).

## Update Identitas Footer
Memperbarui footer website dengan menambahkan logo identitas (Desa Kalosi & KKN Unhas) serta merapikan tata letak ikon media sosial untuk memberikan kesan yang lebih resmi dan profesional.

## Digitasi Menu & Seeding Database
Berhasil mengekstrak dan memasukkan data menu dari gambar fisik ke dalam database:
- **Digitasi:** Mengekstrak 60+ item menu (Nasi, Mie, Minuman, dll) ke format CSV.
- **Seeding:** Mengimplementasikan script seeding (`prisma/seed.ts`) yang otomatis membaca CSV.
- **Assignment Staff:** Produk otomatis dipetakan ke penanggung jawab yang sesuai (Staff Kuliner, Wisata, Mart).
- **Perbaikan Koneksi:** Mengatasi masalah kompatibilitas Prisma v7 dengan menggunakan `PrismaPg` adapter untuk koneksi database yang stabil saat seeding.

## Optimasi Performa & UX
- **Lazy Loading (Infinite Scroll):** Mengimplementasikan infinite scroll pada halaman `/layanan` menggunakan `useInfiniteQuery` dan `IntersectionObserver`. Memuat produk secara bertahap (per 12 item) untuk mengurangi beban awal halaman.
- **Optimasi Gambar:** Mengganti tag `<img>` standar dengan `next/image` pada `ProductCard` untuk performa loading yang lebih baik.
- **Anti-Flicker:** Menambahkan state `opacity` transition pada gambar produk untuk menghilangkan efek flickering/layout shift saat gambar dimuat.
- **Filter Ketegori Dinamis:** Meningkatkan interaktifitas filter kategori dengan animasi `framer-motion` (sliding pill), ikon representatif, dan badge jumlah produk yang diambil real-time dari database.


## Kesiapan Produksi (Fix Build & Checkout Refactor)
Menyelesaikan berbagai isu build production dan menyederhanakan alur checkout:
- **Refactor Checkout:** Menyederhanakan alur dengan metode 'Manual Confirmation'. Menghapus ketergantungan API backend Fonnte dan menggantinya dengan redirect window.open ke WhatsApp Client. Ini memastikan pesan selalu terkirim tanpa tergantung server pihak ketiga yang sering down.
- **Validasi Build:** Menyelesaikan 13+ error TypeScript dan konfigurasi Next.js yang menghalangi build production, antara lain:
  1. NewsFeed.tsx: Mengganti varian button invalid 'white' ke 'ghost'.
  2. ProductGrid.tsx: Inisialisasi useRef dengan null (strict typing).
  3. data-table.tsx: Menambahkan pengecekan aman (safeguard) untuk akses properti accessorKey.
  4. ProductForm.tsx: Casting manual pada zodResolver untuk kompatibilitas versi.
  5. Dashboard Router: Casting Enum ProductCategory pada filter query Prisma.
  6. Order Router: Menambahkan tipe eksplisit any[] pada array kosong untuk menghindari implicit any.
  7. Suspense Boundary: Menambahkan Suspense pada halaman /layanan dan /admin/dashboard karena penggunaan useSearchParams.
  8. Route Handlers: Memperbaiki tipe NextResponse dan handling error Zod pada API routes.
- **Cleanup:** Membersihkan variabel environment dan file whatsapp.ts yang tidak lagi digunakan.

