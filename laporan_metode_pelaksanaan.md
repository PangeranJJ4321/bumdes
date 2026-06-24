# METODE PELAKSANAAN

Metode pelaksanaan program kerja individu KKN Tematik Inovasi Daerah Gelombang 115 Universitas Hasanuddin dengan judul **"Pengembangan Website Landing Page BUMDes Kalosi (Digitalisasi Pemasaran & Manajemen Pesanan Terintegrasi)"** diuraikan dalam beberapa poin di bawah ini:

---

## 1. Waktu dan Tempat

### A. Tempat Pelaksanaan
Kegiatan pengabdian dan pengembangan program kerja ini dilaksanakan di **Desa Kalosi, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Provinsi Sulawesi Selatan**. Seluruh koordinasi, analisis kebutuhan, pengumpulan data usaha, pengujian sistem, hingga pelatihan pengelola dipusatkan di Kantor Desa Kalosi serta Posko KKN Universitas Hasanuddin Desa Kalosi.

### B. Waktu Pelaksanaan
Pelaksanaan program kerja ini terbagi ke dalam dua lini masa utama, yaitu periode KKN secara umum dan durasi pengerjaan teknis proyek website BUMDes:
1. **Periode KKN Gelombang 115**: Berlangsung selama kurang lebih 7 minggu, terhitung mulai dari pembekalan tematik pada **18 Desember 2025** hingga pelaksanaan Seminar Hasil pada **7 Februari 2026**.
2. **Durasi Pengerjaan Website BUMDes**: Proses perancangan, koding, integrasi database, deployment, hingga pelatihan operator BUMDes dilaksanakan selama 5 minggu, dimulai dari tahap *Setup Project* pada **2 Januari 2026** hingga tahap *Handover* (Serah Terima) sistem dan buku panduan pada **5 Februari 2026**.
Pengerjaan pembuatan dan publikasi website ini dilaksanakan secara intensif mulai tanggal 2 Januari 2026 hingga serah terima pada 5 Februari 2026 di Desa Kalosi, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.
---

## 2. Khalayak Sasaran

Program kerja digitalisasi ini dirancang untuk memberikan dampak positif bagi tiga kelompok khalayak sasaran utama di Desa Kalosi:

1. **Pengelola / Operator BUMDes "Sumber Kalosi" (Sasaran Primer)**
   - *Kebutuhan*: Memerlukan sistem manajemen yang praktis untuk mempromosikan unit usaha (Kuliner/Food Court, Wisata Malam Monalisa & Istana Balon, BUMDes Mart, Agen LPG, dan Unit Perikanan Ketapang) serta memerlukan pembukuan pesanan otomatis agar tidak menumpuk dalam bentuk riwayat chat manual yang tidak terstruktur.
   - *Dampak*: Memperoleh hak akses Dashboard Admin terproteksi untuk melakukan manajemen data produk (CRUD), memoderasi ulasan pengunjung, serta memantau grafik/rekap transaksi riil secara mandiri.
2. **Masyarakat Lokal / Warga Desa Kalosi (Sasaran Sekunder)**
   - *Kebutuhan*: Memerlukan platform katalog online yang mudah diakses melalui *smartphone* untuk memesan makanan, gas LPG, air galon, atau hasil perikanan tanpa perlu mengantri secara fisik di lokasi.
   - *Dampak*: Kemudahan melakukan transaksi melalui fitur *WhatsApp Checkout* yang familier, aman, dan tanpa mengharuskan proses pendaftaran akun (login) yang rumit.
3. **Wisatawan dan Pengunjung Luar Desa (Sasaran Tersier)**
   - *Kebutuhan*: Membutuhkan media informasi tepercaya mengenai profil usaha desa, detail wahana wisata malam (seperti Mobil Listrik, Istana Balon), harga tiket masuk, dan rute lokasi.
   - *Dampak*: Menarik minat kunjungan wisatawan luar daerah berkat tampilan antarmuka (UI/UX) website yang modern, profesional, dan representatif (*Wow Factor*).

---

## 3. Metode Pengabdian

Metode pelaksanaan pengabdian dalam pengembangan website BUMDes ini mengadopsi kerangka kerja **System Development Life Cycle (SDLC)** dengan pendekatan partisipatif-kolaboratif bersama pemerintah desa dan pengelola BUMDes. Tahapan pengabdian meliputi:

```mermaid
flowchart TD
    A[Tahap 1: Observasi & Analisis Kebutuhan] --> B[Tahap 2: Perancangan UI/UX & Database]
    B --> C[Tahap 3: Implementasi & Koding]
    C --> D[Tahap 4: Deployment & Quality Assurance]
    D --> E[Tahap 5: Pelatihan & Handover]
    
    subgraph Aktivitas Utama
        A1["Observasi BUMDes & Rapat Pemdes (23-29 Des)"] -.-> A
        B1["Desain UI/UX & PostgreSQL Prisma Schema (30 Des-5 Jan)"] -.-> B
        C1["Frontend, Cart, Auth & WA Checkout (6-22 Jan)"] -.-> C
        D1["VPS Setup, Docker & Nginx Deployment (23 Jan-2 Feb)"] -.-> D
        E1["Buku Panduan & Transfer Knowledge (3-5 Feb)"] -.-> E
    end
    
    style A fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
    style B fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
    style C fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
    style D fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
    style E fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
```

### Tahap 1: Observasi Lapangan & Analisis Kebutuhan (23 - 29 Desember 2025)
- Melakukan observasi langsung ke unit-unit usaha fisik yang dikelola oleh BUMDes Kalosi.
- Melangsungkan rapat koordinasi dan diskusi intensif bersama Sekretaris Desa (Sekdes) Kalosi guna mengidentifikasi masalah utama berupa keterbatasan pemasaran digital dan pencatatan transaksi manual.
- Menyusun dokumen spesifikasi kebutuhan sistem (*Product Requirement Document* / PRD) untuk menyepakati fitur-fitur utama website.

### Tahap 2: Perancangan UI/UX & Skema Basis Data (30 Desember 2025 - 5 Januari 2026)
- Mendesain tampilan halaman website (*landing page*) yang modern dan mudah dibuka lewat HP menggunakan teknologi web terkini (Next.js dan Tailwind CSS).
- Merancang bagan penyimpanan data digital (skema database PostgreSQL menggunakan sistem Prisma ORM) untuk mengelola data pengguna/staf, daftar produk usaha desa (kuliner, wisata, mart, perikanan), rekap transaksi, serta ulasan pengunjung.

### Tahap 3: Implementasi Sistem & Koding (6 - 22 Januari 2026)
- Membangun halaman katalog produk yang mudah digunakan warga, dilengkapi dengan fitur keranjang belanja digital otomatis (menggunakan pustaka `react-use-cart`) untuk menampung pilihan belanjaan langsung di HP pembeli tanpa perlu mendaftar akun.
- Mengembangkan sistem pencatatan otomatis di server yang menyimpan data belanjaan ke database (*Order Logging*) sebelum diarahkan ke chat WhatsApp pengelola BUMDes.
- Menyusun fitur keamanan halaman kontrol pengelola (/admin) menggunakan sistem autentikasi bersandi (NextAuth) agar data pembukuan aman dari akses luar.
- Membuat sistem kompresi gambar otomatis (menggunakan library `sharp`) agar setiap foto produk yang diunggah otomatis berukuran sangat kecil (format WebP) sehingga website sangat ringan dibuka dan hemat kuota internet pembeli.

### Tahap 4: Hosting & Pengujian Fungsionalitas (23 Januari - 2 Februari 2026)
- Menyewa server komputer aktif 24 jam (Virtual Private Server/VPS) dan menyetel pengaturan jalur jaringan (Nginx), wadah program mandiri (Docker), serta gembok pengaman digital (sertifikat SSL dari Let's Encrypt) agar website aman diakses.
- Mempublikasikan (*deployment*) aplikasi web secara online ke server VPS produksi.
- Melakukan uji coba kecepatan (memastikan website terbuka kurang dari 3 detik) serta menguji ketahanan alur pemesanan agar tidak ada pesanan yang gagal masuk.
- Mengatur fitur pratinjau tautan (SEO & Open Graph) agar saat tautan website dibagikan melalui WhatsApp atau Facebook, otomatis muncul gambar logo BUMDes dan ringkasan profil yang rapi.

### Tahap 5: Pelatihan Pengelola & Handover (3 - 5 Februari 2026)
- Memasukkan data riil produk, deskripsi kuliner, harga promosi, dan foto resolusi tinggi ke sistem database VPS.
- Menyusun Buku Panduan Operasional Website (User Manual) yang berisi panduan teknis langkah demi langkah pengoperasian dashboard admin.
- Mengadakan pelatihan intensif tatap muka (transfer knowledge) dengan operator BUMDes tentang tata cara pembaruan katalog produk, pengubahan harga, pemrosesan pesanan, dan penanganan ulasan.
- Menyerahkan sistem website BUMDes secara resmi kepada pihak desa.

---

## 4. Indikator Keberhasilan

Kriteria keberhasilan dari program kerja pengabdian ini diukur melalui parameter berikut:

1. **Keberhasilan Fungsional (Fungsionalitas Sistem)**
   - Semua halaman utama (Katalog Produk, Keranjang Belanja, Pemesanan WhatsApp, Pengisian Ulasan, dan Halaman Kontrol Admin) 100% berfungsi lancar tanpa adanya kesalahan sistem (*zero major bugs*).
   - Fitur pencatatan otomatis (*Order Logging*) berhasil menyimpan data transaksi pembeli di server sebelum diarahkan ke chat WhatsApp pengelola.
2. **Keberhasilan Teknis (Kecepatan & Tampilan)**
   - Website memiliki kecepatan memuat halaman di bawah 3 detik saat diakses menggunakan jaringan seluler 4G di desa.
   - Tampilan website otomatis menyesuaikan dengan ukuran layar HP warga (responsif dan mobile-friendly).
   - Pratinjau tautan (SEO) terbukti menampilkan nama BUMDes dan deskripsi yang rapi saat tautan website dibagikan.
3. **Keberhasilan Operasional & Adopsi (Kemandirian Pengelola)**
   - Operator BUMDes dapat melakukan pembaharuan data produk (CRUD), moderasi ulasan, dan pergantian password staf secara mandiri menggunakan Dashboard Admin.
   - Adanya berkas Buku Panduan Operasional yang dicetak dan diserahkan sebagai jaminan keberlanjutan (*sustainability*) pemeliharaan aplikasi.
4. **Keberhasilan Diseminasi**
   - Website berhasil di-online-kan (dideploy) di server VPS publik sehingga dapat diakses oleh khalayak umum.
   - Tersusunnya artikel publikasi/hilirisasi program kerja serta terlaksananya Seminar Hasil KKN dengan lancar.

---

## 5. Metode Evaluasi

Evaluasi dilakukan sepanjang proses pengembangan untuk meminimalisasi ketidaksesuaian sistem dengan kebutuhan riil di lapangan. Metode evaluasi terdiri atas tiga mekanisme:

1. **Evaluasi Teknis (Pengujian Sistem / Alpha Testing)**
   - Dilakukan pengujian internal secara bertahap selama pembuatan kode program. Contohnya meliputi pengujian ketahanan keranjang belanja saat halaman dimuat ulang, validasi isian formulir transaksi agar tidak ada kolom penting (seperti nomor HP atau alamat) yang terlewat, serta pengujian kata sandi halaman kontrol admin untuk memastikan keamanan data pembukuan.
2. **Evaluasi Partisipatif dengan Pemangku Kepentingan (Feedback Loop)**
   - Melangsungkan sesi diskusi dan koordinasi berkala bersama Sekretaris Desa Kalosi (seperti rapat koordinasi pada tanggal 26, 28, dan 29 Januari 2026).
   - Mengadakan rapat evaluasi langsung bersama Kepala Desa Kalosi pada tanggal **28 Januari 2026** untuk mempresentasikan perkembangan fitur terkini, menerima masukan penyempurnaan (seperti penggantian tema warna dominan menjadi biru-putih sesuai masukan desa, penyederhanaan alur checkout ke WhatsApp manual, dan penambahan fitur kelola stok).
3. **Uji Penerimaan Pengguna (User Acceptance Testing / Beta Testing)**
   - Melakukan uji coba langsung dengan meminta calon operator BUMDes mengoperasikan panel administrator secara mandiri di bawah pengawasan mahasiswa KKN.
   - Operator diminta melakukan skenario penambahan produk baru beserta gambarnya, mengedit harga produk unggulan, mengubah status pemesanan, dan melakukan checkout mandiri. Evaluasi diukur dari tingkat pemahaman dan kemudahan operator dalam menyelesaikan tugas-tugas tersebut tanpa instruksi pemrograman.

---

## 6. Lampiran: Dokumentasi Pelaksanaan Kegiatan

Berikut adalah bukti dokumentasi pelaksanaan program kerja pembuatan website BUMDes Kalosi yang diambil langsung dari data logbook kegiatan:

| No | Tanggal | Aktivitas Kegiatan | Foto Dokumentasi KKN |
| :---: | :---: | :--- | :--- |
| **1** | 27 Desember 2025 | Diskusi Seminar Proker Utama & Individu bersama Sekdes Kalosi | ![Diskusi Sekdes](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-21_091616.406576.jpg) |
| **2** | 30 Desember 2025 | Seminar Program Kerja KKN Gelombang 115 Desa Kalosi | ![Seminar Proker](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-10_123250.742920.jpg) |
| **3** | 2 Januari 2026 | Setup Project Next.js & Konfigurasi Lingkungan Awal | ![Setup Project](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-10_123301.270896.jpg) |
| **4** | 4 Januari 2026 | Pembuatan Desain Landing Page & Koding UI/UX Publik | ![Desain & Koding](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-10_123307.147150.jpg) |
| **5** | 8 Januari 2026 | Implementasi Autentikasi Keamanan Dashboard Admin Website | ![Autentikasi Dashboard](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-10_123400.729332.jpg) |
| **6** | 9 Januari 2026 | Integrasi Database PostgreSQL & Pengembangan Fitur Konfigurasi | ![Integrasi DB](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-10_123403.204022.jpg) |
| **7** | 14 Januari 2026 | Optimalisasi Dashboard Multi-Role (Admin & Staff) BUMDes | ![Dashboard Multi-Role](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-01-21_093652.423100.jpeg) |
| **8** | 26 Januari 2026 | Rapat Koordinasi dengan Pemdes Kalosi & QA Website | ![Rapat & QA](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-02-02_121718.010320.jpg) |
| **9** | 29 Januari 2026 | Setup Server VPS & Deployment BUMDes Sumber Kalosi Part 1 | ![VPS & Deployment](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-02-02_121453.711046.jpg) |
| **10** | 5 Februari 2026 | Serah Terima (Handover) Website secara Resmi & Buku Panduan | ![Serah Terima](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-02-13_062623.006203.jpeg) |
| **11** | 7 Februari 2026 | Seminar Hasil Program Kerja KKN Universitas Hasanuddin | ![Seminar Hasil](https://sipbpm.unhas.ac.id/media/logbook/2026/H071231056/npc_number_2026-02-13_062630.172932.jpg) |
