# Penjelasan Detail Timeline Pengerjaan (Talking Points)

Berikut adalah bahan penjelasan untuk setiap tahap timeline pada slide presentasi. Gunakan poin-poin ini untuk menjelaskan **apa** yang dikerjakan, **mengapa** itu penting, dan **bukti** bahwa target 4 minggu itu realistis.

## **Minggu 1: Setup Foundation & UI/UX Design**
**"Fokus: Membangun 'Wajah' Digital BUMDes"**

*   **Apa yang dikerjakan:**
    *   Instalasi kerangka kerja teknologi (Next.js & Tailwind CSS) untuk performa website yang cepat.
    *   Mendesain halaman depan (Landing Page) yang mencakup Katalog Kuliner, Profil Wisata Malam, dan Mart.
    *   Pengambilan dan kurasi foto produk berkualitas tinggi.
*   **Talking Point (Penjelasan ke Peserta/Dosen):**
    *   *"Di minggu pertama, fokus saya adalah 'Front-Facing'. Saya tidak mulai dari nol, tapi menggunakan template desain sistem yang sudah saya siapkan (boilerplate). Ini memangkas waktu coding dasar hingga 50%. Kita langsung fokus memasukkan foto-foto produk BUMDes agar terlihat premium dan 'Wow'."*
    *   *"Mengapa minggu 1? Karena visual adalah hal pertama yang dilihat konsumen. Kita harus memastikan tampilan mobile-nya sempurna dulu sebelum masuk ke fitur rumit."*

## **Minggu 2: Backend & Admin Dashboard (CMS)**
**"Fokus: Memberikan Kontrol Penuh ke Pengelola Desa"**

*   **Apa yang dikerjakan:**
    *   Menyiapkan database (PostgreSQL) untuk menyimpan data menu dan harga.
    *   Membuat halaman Login khusus Admin.
    *   Membuat fitur CRUD (Create, Read, Update, Delete) agar admin bisa tambah/hapus menu sendiri tanpa koding.
*   **Talking Point (Penjelasan ke Peserta/Dosen):**
    *   *"Minggu kedua adalah tentang 'Kemandirian'. Sistem yang canggih percuma kalau Desa bergantung terus pada mahasiswa KKN. Jadi, saya membangun Dashboard Admin sederhana."*
    *   *"Realistis? Ya, karena saya menggunakan layanan 'Backend-as-a-Service' (seperti Supabase/Neon) yang mempercepat pembuatan database dari hitungan hari menjadi hitungan jam. Kita hanya fokus pada fungsi inti: Ganti Harga & Tambah Foto."*

## **Minggu 3: Logic Checkout & WhatsApp Integration**
**"Fokus: Jantung Transaksi - Simplifikasi Order"**

*   **Apa yang dikerjakan:**
    *   Mengembangkan fitur "Keranjang Belanja" yang menyimpan pilihan pembeli.
    *   Membuat logika "Order Logging": Pesanan disimpan dulu di database sebagai arsip, BARU dialihkan ke WhatsApp.
    *   Integrasi format pesan WhatsApp otomatis (Pre-filled message).
*   **Talking Point (Penjelasan ke Peserta/Dosen):**
    *   *"Ini adalah fitur unggulan 'Digital Mapper'. Biasanya website desa cuma profil statis. Di minggu ke-3, saya menghidupkan fungsi transaksinya."*
    *   *"Fitur ini menjembatani kebiasaan warga. Mereka suka belanja online tapi gaptek 'Transfer Gateway'. Jadi solusinya: Pilih di Web -> Checkout -> Terkirim sebagai Chat WA ke Admin. Data pesanan tetap tercatat rapi di sistem untuk pembukuan BUMDes."*

## **Minggu 4: Deployment, Testing & Handover**
**"Fokus: Membawa ke Publik & Keberlanjutan"**

*   **Apa yang dikerjakan:**
    *   Hosting website ke server publik (VPS/Vercel) dan setup domain desa (jika ada).
    *   Uji coba kecepatan akses dan error (Bug Fixing).
    *   **Pelatihan Intensif**: Mengajarkan operator BUMDes cara pakai Admin Dashboard & cara balas pesanan WA.
*   **Talking Point (Penjelasan ke Peserta/Dosen):**
    *   *"Minggu terakhir bukan lagi soal coding, tapi 'Operational Readiness'. Website online tidak ada gunanya kalau tidak ada yang bisa mengoperasikan."*
    *   *"Target outputnya: Website bisa diakses umum, QR Code menu sudah ditempel di meja kantin, dan Admin BUMDes sudah bisa update menu sendiri depan saya. Ini menjamin keberlanjutan program setelah KKN selesai."*
