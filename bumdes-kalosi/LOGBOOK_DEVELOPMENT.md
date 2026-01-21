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
