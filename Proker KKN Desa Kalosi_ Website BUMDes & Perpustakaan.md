# **Laporan Kajian Teknis dan Strategis: Transformasi Digital Ekosistem Desa Kalosi**

## **Cetak Biru Implementasi Platform E-Commerce BUMDes dan Sistem Manajemen Perpustakaan Digital**

Disiapkan untuk: Pemerintah Desa Kalosi & Tim Pelaksana Program Kerja KKN  
Lokasi: Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan  
Fokus Program: Digitalisasi BUMDes "Sumber Kalosi" & Modernisasi Perpustakaan Desa  
Tanggal: 27 Desember 2025

## ---

**Bab I: Pendahuluan dan Konteks Strategis**

### **1.1 Latar Belakang dan Urgensi Digitalisasi Perdesaan**

Dalam era percepatan transformasi digital nasional, desa tidak lagi dipandang sebagai entitas periferal, melainkan sebagai garda terdepan pembangunan ekonomi dan literasi. Desa Kalosi, yang terletak di Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), memiliki posisi strategis dengan potensi demografis dan ekonomi yang signifikan. Berdasarkan arahan strategis dari Sekretaris Desa (Sekdes) Kalosi, Bapak Baharuddin, S.Kom, terdapat dua mandat utama yang harus dieksekusi melalui program kerja (Proker) Kuliah Kerja Nyata (KKN) tahun ini: pembangunan infrastruktur digital untuk Badan Usaha Milik Desa (BUMDes) dan modernisasi manajemen perpustakaan desa.

Inisiatif ini bukan sekadar pembuatan situs web semata, melainkan sebuah upaya rekayasa ulang proses bisnis (business process reengineering) yang bertujuan untuk mengatasi hambatan geografis dan operasional yang selama ini membatasi pertumbuhan ekonomi desa. BUMDes "Sumber Kalosi" saat ini menghadapi tantangan dalam memperluas pasar produk kuliner dan wisatanya karena ketergantungan pada metode pemasaran manual. Sementara itu, perpustakaan desa, yang seharusnya menjadi pusat literasi, mengalami stagnasi fungsi akibat ketiadaan sistem manajemen koleksi yang terintegrasi dan akses digital terhadap bahan bacaan (e-book).1

Urgensi dari laporan ini terletak pada kebutuhan untuk menerjemahkan visi digital Pemerintah Desa Kalosi menjadi sebuah peta jalan teknis yang terperinci, terukur, dan dapat diimplementasikan (actionable). Mengingat latar belakang pendidikan Sekretaris Desa yang mumpuni di bidang komputer (Sarjana Komputer), ekspektasi terhadap kualitas teknis dan keberlanjutan sistem yang dibangun sangatlah tinggi. Oleh karena itu, laporan ini dirancang untuk memberikan panduan komprehensif mulai dari pemilihan arsitektur perangkat lunak, konfigurasi teknis, prosedur operasional standar (SOP), hingga strategi legalitas domain .desa.id.

### **1.2 Profil Demografis dan Administratif Desa Kalosi**

Pemahaman mendalam mengenai struktur demografi dan administrasi Desa Kalosi merupakan prasyarat mutlak dalam merancang antarmuka pengguna (User Interface/UI) dan pengalaman pengguna (User Experience/UX) yang tepat sasaran. Desa Kalosi dipimpin oleh Kepala Desa Bapak Abdul Malik, dibantu oleh Sekretaris Desa Bapak Baharuddin, S.Kom. Struktur organisasi yang solid ini juga didukung oleh Kepala Dusun dan Kepala Urusan (Kaur) yang mengelola berbagai aspek pemerintahan.1

Data demografis menunjukkan bahwa Desa Kalosi memiliki populasi sebesar 5.880 jiwa, yang terdiri dari 2.816 laki-laki dan 2.913 perempuan, dengan total 700 Kepala Keluarga (KK). Komposisi penduduk yang relatif seimbang antara laki-laki dan perempuan ini memberikan wawasan penting bagi strategi pemasaran BUMDes. Misalnya, segmen perempuan sering kali menjadi pengambil keputusan utama dalam pembelian kuliner rumah tangga, sementara segmen pemuda (yang tercermin dari demografi usia produktif) merupakan target utama untuk wahana wisata malam dan penggunaan perpustakaan digital.1

Tingkat literasi digital masyarakat desa dapat diasumsikan berada pada tahap menengah, mengingat penggunaan WhatsApp yang masif sebagai alat komunikasi dan transaksi harian. Fakta bahwa transaksi jual beli BUMDes saat ini masih menggunakan WhatsApp secara manual mengindikasikan bahwa masyarakat sudah nyaman dengan *conversational commerce* (perdagangan berbasis percakapan), namun belum siap atau belum terlayani oleh platform aggregator besar seperti GrabFood. Oleh karena itu, solusi teknologi yang ditawarkan tidak boleh mencabut kebiasaan ini, melainkan harus mengoptimalkannya.

### **1.3 Rumusan Masalah dan Tujuan Teknis**

Berdasarkan analisis awal dan *request* dari pengguna, teridentifikasi beberapa masalah teknis dan operasional yang menjadi fokus utama laporan ini:

1. **Inefisiensi Transaksi BUMDes:** Proses pemesanan produk kuliner dan tiket wisata BUMDes saat ini dilakukan secara manual melalui pesan teks WhatsApp. Hal ini menyebabkan risiko *human error* dalam pencatatan pesanan, kesulitan dalam rekapitulasi keuangan harian, dan keterbatasan dalam menampilkan katalog produk secara visual yang menarik. Tidak adanya integrasi dengan platform pengiriman pihak ketiga mengharuskan BUMDes mengelola logistik "antar jemput" secara mandiri, yang memerlukan sistem manajemen kurir yang terstruktur.  
2. **Stagnasi Manajemen Perpustakaan:** Perpustakaan desa memiliki koleksi fisik, namun tidak memiliki katalog digital (OPAC). Hal ini membuat masyarakat sulit mengetahui ketersediaan buku tanpa datang ke lokasi. Selain itu, ada kebutuhan spesifik untuk mengelola dan mengunggah *e-book*, yang tidak dapat diakomodasi oleh sistem pembukuan manual. Kebutuhan ini mencerminkan keinginan untuk transformasi menuju perpustakaan hibrida (fisik dan digital).  
3. **Infrastruktur Digital yang Belum Terpadu:** Meskipun desa mungkin telah memiliki jejak digital (seperti subdomain dari penyedia layanan pihak ketiga), belum ada sistem terpusat yang dikelola secara mandiri sepenuhnya di bawah domain resmi pemerintah desa (.desa.id), yang menjamin kedaulatan data dan keberlanjutan jangka panjang.

Tujuan dari laporan ini adalah menyediakan arsitektur solusi untuk:

* Membangun **Landing Page BUMDes** yang berfungsi sebagai katalog digital interaktif dengan fitur "Checkout to WhatsApp" untuk menjembatani kesenjangan teknologi.  
* Mengimplementasikan **Sistem Informasi Manajemen Perpustakaan** berbasis web yang mendukung sirkulasi buku fisik dan repositori *e-book*.  
* Menyusun **SOP Layanan Antar Jemput** dan **SOP Sirkulasi Pustaka** untuk memastikan sistem berjalan lancar pasca-KKN.

## ---

**Bab II: Transformasi Digital BUMDes "Sumber Kalosi"**

### **2.1 Analisis Bisnis dan Portofolio Usaha**

BUMDes "Sumber Kalosi" merupakan entitas ekonomi vital yang memiliki portofolio bisnis yang beragam. Memahami keragaman ini sangat penting karena situs web yang dibangun harus mampu mengakomodasi karakteristik unik dari setiap unit usaha. Berdasarkan data lapangan, BUMDes ini bergerak di beberapa sektor utama 2:

| Unit Usaha | Karakteristik Produk | Kebutuhan Fitur Website |
| :---- | :---- | :---- |
| **Kuliner (Food Court)** | *High frequency*, harga rendah-menengah, *perishable* (mudah rusak), *on-demand*. Contoh: Nasi Goreng, Sarebba, Jus. | Katalog visual, variasi produk (pedas/tidak), perhitungan total harga otomatis, integrasi ongkir lokal. |
| **Wisata Malam (Wahana)** | *Experience-based*, visual, tiket masuk/sewa. Contoh: Mobil Gowes, Istana Balon, Mobil Listrik. | Galeri foto/video *heroic*, informasi harga tiket, status operasional (buka/tutup), lokasi (peta). |
| **Perdagangan (Mart & Agen)** | Barang ritel, stok fisik, kebutuhan pokok. Contoh: Agen LPG, Air Galon, BUMDes Mart. | Tampilan stok (opsional), tombol pemesanan cepat untuk layanan antar (gas/galon). |
| **Jasa & Event** | Penyewaan tempat, panggung, karaoke. | Informasi fasilitas, kalender ketersediaan, kontak *booking* khusus. |

Kompleksitas ini menuntut sebuah platform yang fleksibel. *Landing page* tidak bisa hanya sekadar brosur statis; ia harus menjadi *dashboard* interaktif yang mengarahkan pengunjung ke layanan yang mereka butuhkan. "Wisata Malam" khususnya, yang merupakan inovasi unggulan dengan wahana seperti Mobil Listrik Monalisa dan motor trail anak, memerlukan pendekatan visual yang kuat untuk menarik pengunjung dari luar desa.3

### **2.2 Arsitektur Sistem: Model "WhatsApp-First Commerce"**

Mengingat kendala infrastruktur pembayaran digital (jarangnya penggunaan *e-wallet* atau kartu kredit di pedesaan) dan kebiasaan lokal, laporan ini merekomendasikan pendekatan **Catalog Mode dengan WhatsApp Checkout**. Ini berbeda dengan *e-commerce* konvensional yang memaksa pengguna membuat akun dan membayar di web.

**Logika Alur Sistem:**

1. **Katalog Digital:** Pengunjung mengakses bumdes.kalosi.desa.id dan melihat menu makanan serta daftar wahana layaknya di aplikasi GrabFood/Gofood.  
2. **Add to Cart:** Pengunjung memilih item (misal: 2 Nasi Goreng, 1 Jus Jeruk) dan memasukkannya ke keranjang belanja virtual di website. Fitur ini krusial karena memungkinkan pemesanan majemuk (multiple items) dalam satu kali transaksi, sesuatu yang sulit dilakukan via chat manual tanpa mengetik panjang.  
3. **Checkout Transparan:** Saat menekan tombol "Pesan Sekarang", sistem tidak meminta data bank, melainkan formulir sederhana (Nama, Alamat/Dusun, Metode Pengiriman).  
4. **WhatsApp Bridge:** Sistem secara otomatis menyusun pesan terformat (pre-filled message) dan membuka aplikasi WhatsApp pengguna. Pesan tersebut berisi detail pesanan, subtotal harga, dan alamat pengiriman, yang langsung dikirim ke nomor Admin BUMDes.

**Keunggulan Model Ini:**

* **Friksi Rendah:** Tidak perlu login, tidak perlu email, tidak perlu transfer bank di awal.  
* **Akurasi Data:** Admin menerima pesanan yang sudah tertulis rapi, mengurangi kesalahan dengar atau salah catat dibandingkan pesanan telepon/chat manual.  
* **Database Produk:** BUMDes memiliki data produk mana yang paling sering dilihat di website, memberikan wawasan analitik yang tidak bisa didapat dari chat biasa.

### **2.3 Spesifikasi Teknis dan Implementasi Plugin**

Untuk merealisasikan arsitektur di atas, platform **WordPress** dengan **WooCommerce** adalah pilihan mutlak karena fleksibilitas dan ekosistem plugin-nya yang luas. Berikut adalah konfigurasi teknis mendalam yang harus dilakukan oleh tim KKN:

#### **2.3.1 Core Platform & Tema**

* **CMS:** WordPress (Versi terbaru).  
* **Tema:** **Astra** atau **OceanWP**. Kedua tema ini sangat ringan dan kompatibel penuh dengan Elementor dan WooCommerce. Kecepatan muat (loading speed) adalah prioritas utama untuk pengguna dengan sinyal seluler pedesaan yang mungkin tidak stabil.  
* **Page Builder:** **Elementor**. Digunakan untuk mendesain *Landing Page* visual yang menampilkan keindahan Wisata Malam Kalosi tanpa perlu menulis kode HTML/CSS dari nol.

#### **2.3.2 Mesin E-Commerce: WooCommerce**

WooCommerce akan difungsikan dalam "Catalog Mode" yang dimodifikasi.

* **Pengaturan Mata Uang:** Rupiah (IDR).  
* **Pengaturan Lokasi:** Sulawesi Selatan.  
* **Pengaturan Produk:**  
  * *Simple Product:* Untuk tiket wahana atau air galon.  
  * *Variable Product:* Untuk makanan (misal: Nasi Goreng \- Varian: Pedas, Sedang, Tidak Pedas).  
* **Manajemen Stok:** Dinonaktifkan untuk menu kuliner (made to order), namun bisa diaktifkan untuk barang ritel di BUMDes Mart jika diperlukan.

#### **2.3.3 Integrasi WhatsApp: Plugin "OneClick Chat to Order"**

Ini adalah komponen "jantung" dari sistem ini. Plugin **OneClick Chat to Order** (sebelumnya OneClick WhatsApp Order) direkomendasikan karena kemampuannya mengambil data dari keranjang belanja WooCommerce.5

**Konfigurasi Kritis:**

1. **Multi-Number Routing:** Jika BUMDes memiliki admin berbeda untuk Dapur (makanan) dan Loket (wahana), plugin ini memungkinkan pengaturan nomor WA yang berbeda untuk kategori produk yang berbeda. Namun, untuk tahap awal, disarankan menggunakan satu nomor terpusat ("Admin Dispatcher") untuk menghindari kebingungan.  
2. **Floating Button:** Mengaktifkan tombol melayang di pojok kanan bawah untuk konsultasi umum ("Apakah buka malam ini?", "Bisa pesan untuk acara ulang tahun?"). Ini penting untuk menjaga interaksi manusiawi.6  
3. **Template Pesan (Shortcode Generator):** Tim KKN harus menyusun template pesan yang jelas.  
   * *Format:* Halo BUMDes Sumber Kalosi, saya ingin memesan: \[woo\_cart\_items\]. Total: \[woo\_cart\_total\]. Alamat saya di: \[customer\_address\]. Mohon diproses.  
   * Fitur ini memastikan bahwa Admin BUMDes langsung tahu apa yang harus disiapkan tanpa perlu tanya-jawab berulang kali.  
4. **Mobile Optimization:** Mengatur agar tombol hanya muncul atau memiliki ukuran yang sesuai di tampilan seluler, karena 90% akses diprediksi berasal dari smartphone warga.7

### **2.4 Strategi Desain UX/UI (User Experience)**

Desain situs web harus menjembatani dua fungsi: **Promosi** (Visual) dan **Transaksi** (Fungsional).

Bagian 1: Hero Section (Daya Tarik Visual)  
Bagian paling atas website harus menampilkan video pendek atau slider foto berkualitas tinggi dari Wisata Malam Kalosi. Foto anak-anak bermain di Istana Balon atau keramaian lampu di malam hari akan membangun persepsi "tempat yang hidup". Judul utama (Headline) harus kuat, misalnya: "Pusat Hiburan Keluarga & Kuliner Terbaik di Dua Pitue." Tombol aksi (CTA) harus jelas: "Lihat Menu" dan "Wahana Kami".  
Bagian 2: Katalog Kuliner (Fungsional)  
Tampilan produk makanan harus menggunakan Grid Layout. Foto makanan adalah kunci konversi. Tim KKN wajib melakukan sesi fotografi produk yang serius. Foto Sarebba harus terlihat hangat dan menggugah selera; foto Nasi Goreng harus terlihat porsinya. Di bawah setiap produk, tombol "Pesan via WA" atau "Tambah ke Keranjang" harus berwarna kontras (misal: Hijau WhatsApp).  
Bagian 3: Integrasi Kurir Desa  
Karena sistem "antar jemput" adalah fitur utama, website harus memiliki banner atau bagian khusus yang menjelaskan cara kerjanya.

* **Informasi:** "Lapar tapi malas keluar? Tim Kurir BUMDes siap antar ke depan rumah Anda."  
* **Transparansi Ongkir:** Menampilkan tabel biaya kirim berdasarkan dusun (akan dibahas di bagian Logistik).

## ---

**Bab III: Modernisasi Perpustakaan Desa Melalui SLiMS**

### **3.1 Mengapa SLiMS (Senayan Library Management System)?**

Permintaan pengguna adalah membuat "website manajemen perpustakaan" yang bisa "pinjam buku" dan "upload e-book". Meskipun ada plugin WordPress untuk buku (seperti *WebLibrarian* atau *Mooberry*), fitur mereka sangat terbatas untuk manajemen perpustakaan yang sebenarnya.8 Mereka lebih cocok untuk penulis yang memajang bukunya sendiri, bukan perpustakaan dengan ribuan judul dan sirkulasi peminjam.

Laporan ini sangat merekomendasikan penggunaan **SLiMS 9 Bulian**. SLiMS adalah perangkat lunak sumber terbuka (open source) buatan anak bangsa (Kemendikbud) yang telah menjadi standar *de facto* perpustakaan di Indonesia.

* **Kecocokan Fitur:** SLiMS memiliki modul sirkulasi lengkap (peminjaman, pengembalian, denda), manajemen keanggotaan, dan yang paling penting, fitur **Lampiran Berkas (File Attachment)** untuk repositori *e-book*.10  
* **Efisiensi Biaya:** Gratis (lisensi GPL v3).  
* **Skalabilitas:** Jika koleksi perpustakaan Desa Kalosi tumbuh menjadi 10.000 buku, SLiMS tetap sanggup menanganinya.

### **3.2 Arsitektur Repositori E-Book**

Salah satu syarat utama adalah kemampuan mengunggah *e-book*. Dalam SLiMS, fitur ini bukan sekadar "upload". Ini adalah manajemen aset digital.

**Mekanisme Teknis:**

1. **Modul Bibliografi:** Admin memasukkan data buku (Judul, Pengarang, Tahun, ISBN).  
2. **Repository Server:** Di dalam data bibliografi tersebut, admin mengunggah file PDF, EPUB, atau materi multimedia lainnya.  
3. **Hak Akses:** SLiMS memungkinkan pengaturan privasi.  
   * *Public Access:* E-book peraturan desa atau panduan pertanian bisa diunduh siapa saja.  
   * *Member Only:* E-book novel atau materi berhak cipta terbatas hanya bisa dibaca oleh warga yang sudah mendaftar menjadi anggota perpustakaan dan *login*. Ini melindungi desa dari isu pelanggaran hak cipta.

Konfigurasi Server untuk E-Book:  
Masalah umum pada shared hosting adalah batas ukuran upload. File e-book PDF berkualitas tinggi bisa mencapai 10-50 MB, sementara default PHP seringkali hanya 2 MB. Tim KKN harus melakukan konfigurasi manual pada file .user.ini atau php.ini di cPanel hosting:

Ini, TOML

upload\_max\_filesize \= 64M  
post\_max\_size \= 64M  
memory\_limit \= 256M

Tanpa konfigurasi ini, fitur upload e-book akan gagal.

### **3.3 Transformasi Layanan: Dari Gudang ke Hub Literasi**

Implementasi website perpustakaan (pustaka.kalosi.desa.id) mengubah paradigma layanan perpustakaan desa.

* **Katalog Online (OPAC):** Warga bisa mencari buku dari rumah melalui HP. Mereka bisa tahu apakah buku "Harry Potter" sedang dipinjam atau tersedia di rak.  
* **Kartu Anggota Digital:** SLiMS dapat mencetak kartu anggota dengan *barcode*. Tim KKN dapat mencetak kartu ini untuk anak-anak sekolah. Proses peminjaman menjadi canggih: Pustakawan memindai kartu anggota, lalu memindai *barcode* buku. Selesai dalam 5 detik. Pengalaman "modern" ini sangat penting untuk menarik minat baca anak-anak di era gadget.

## ---

**Bab IV: Operasional Logistik dan SOP (Standar Operasional Prosedur)**

Teknologi hanyalah alat; keberhasilannya bergantung pada prosedur manusia yang menjalankannya. Laporan ini menyusun SOP draft untuk kedua sistem.

### **4.1 SOP Layanan Antar Jemput (Kurir BUMDes)**

Layanan "antar jemput" yang disebutkan dalam *request* harus diformalisasi. Saat ini, mungkin sistemnya "siapa yang sempat, dia yang antar". Untuk skala bisnis yang lebih besar via website, dibutuhkan sistem zonasi.12

**Zonasi Tarif Pengiriman (Usulan):**

* **Zona 1 (Pusat Desa/Sekitar BUMDes):** Radius 1 KM. Tarif: Gratis atau Rp 2.000 (biaya bensin).  
* **Zona 2 (Dusun Tetangga):** Radius 2-4 KM. Tarif: Rp 5.000.  
* **Zona 3 (Batas Kecamatan):** Tarif: Negosiasi/Khusus.

**Alur Kerja Kurir (Workflow):**

1. **Penerimaan Order:** Admin menerima WA dari website. Admin membalas: *"Pesanan diterima. Total Rp 50.000. Ongkir ke Dusun III Rp 5.000. Total Bayar Rp 55.000. Mohon disiapkan uang pas/kembalian."*  
2. **Dispatch:** Admin meneriakkan pesanan ke Dapur dan memanggil Kurir yang *standby*.  
3. **Pengantaran:** Kurir mengambil makanan. Kurir WA ke pembeli: *"Saya jalan sekarang"*.  
4. **Transaksi:** Kurir menyerahkan makanan, menerima uang tunai.  
5. **Setoran:** Setelah kembali ke posko BUMDes, Kurir menyetor uang penjualan ke Kasir, dan menyimpan uang ongkir (atau sistem bagi hasil, misal 80% kurir, 20% kas BUMDes).

Sistem ini memberdayakan pemuda desa yang memiliki motor sebagai mitra kurir, menciptakan lapangan kerja mikro baru.

### **4.2 SOP Manajemen Perpustakaan**

**Pendaftaran Anggota:**

* Syarat: KTP/KK Desa Kalosi (untuk warga), Kartu Pelajar (untuk siswa).  
* Proses: Admin menginput data ke SLiMS, mengambil foto anggota via webcam, dan mencetak kartu.

**Sirkulasi (Peminjaman & Pengembalian):**

* Batas Pinjam: Maksimal 2 buku selama 7 hari.  
* Denda: Rp 500 per hari keterlambatan (nominal kecil sebagai disiplin, bukan pendapatan). Uang denda masuk kas perpustakaan untuk pemeliharaan buku.  
* E-Book: Tidak ada batas waktu, namun akses *download* dibatasi untuk anggota aktif.

## ---

**Bab V: Infrastruktur, Legalitas, dan Keberlanjutan**

### **5.1 Tata Kelola Domain .desa.id**

Penggunaan domain kalosi.digitaldesa.id saat ini 1 adalah langkah awal yang baik, namun itu adalah subdomain milik pihak ketiga (PT Digital Desa Indonesia). Untuk kemandirian jangka panjang, sangat disarankan Desa Kalosi mendaftarkan domain resmi **kalosi.desa.id**. Domain ini adalah identitas resmi pemerintah desa di internet, diakui oleh Kementerian Kominfo, dan meningkatkan kepercayaan publik (trust).14

Persyaratan Pendaftaran (Sesuai Permen Kominfo):  
Tim KKN harus memfasilitasi penyiapan dokumen digital (scan):

1. **SK Pengangkatan Kepala Desa** (Bapak Abdul Malik).  
2. **SK Pengangkatan Perangkat Desa** (Sekdes atau Operator yang ditunjuk sebagai admin domain).  
3. **Surat Kuasa** dari Kepala Desa kepada Admin Domain (menggunakan kop surat desa dan materai).  
4. **Surat Permohonan** Pendaftaran Nama Domain Desa.

Biaya domain .desa.id sangat terjangkau, yaitu gratis untuk tahun pertama (dalam banyak promo registrar) atau sekitar Rp 55.000 per tahun untuk perpanjangan.15 Ini jauh lebih murah daripada domain .com dan menunjukkan identitas instansi pemerintah.

### **5.2 Spesifikasi Hosting**

Karena menjalankan dua aplikasi berat (WordPress dan SLiMS) secara bersamaan, *hosting* gratisan tidak akan cukup. Dibutuhkan **Shared Hosting cPanel** dengan spesifikasi minimal:

* **Disk Space:** 5 GB \- 10 GB (SSD). Ini penting karena SLiMS akan menyimpan banyak file *e-book* PDF dan WordPress akan menyimpan banyak foto makanan resolusi tinggi.  
* **RAM:** 1 GB (Dedicated). SLiMS membutuhkan memori yang cukup saat melakukan pencarian katalog.  
* **Bandwidth:** Unlimited.  
* **Lokasi Server:** Indonesia (Jakarta/Surabaya). Penting agar akses dari Desa Kalosi cepat (latensi rendah).

### **5.3 Anggaran dan Keberlanjutan**

Program KKN sering gagal setelah mahasiswa pulang karena masalah biaya perpanjangan server. Oleh karena itu, strategi keberlanjutan harus disusun sejak awal.

* **Estimasi Biaya Tahunan:** Rp 700.000 \- Rp 1.000.000 (untuk Hosting \+ Domain).  
* **Sumber Dana:** Dana Desa (APBDes). Tim KKN harus membantu Sekdes menyusun proposal agar biaya ini masuk dalam pos anggaran "Penyelenggaraan Informasi Publik Desa" atau "Pemberdayaan BUMDes". Mengingat BUMDes adalah unit profit, biaya website BUMDes seharusnya bisa ditutup dari sebagian kecil keuntungan penjualan *Nasi Goreng* atau tiket *Wisata Malam*.

## ---

**Bab VI: Peta Jalan Implementasi (Action Plan)**

Berikut adalah jadwal kerja teknis selama periode KKN (asumsi 45 hari) untuk memastikan kedua sistem "Go Live".

### **Minggu 1: Analisis & Pengadaan**

* **Hari 1-3:** Pertemuan intensif dengan Sekdes Baharuddin dan Direktur BUMDes. Finalisasi daftar menu, harga, dan aturan peminjaman buku.  
* **Hari 4-5:** Inventarisasi buku fisik di perpustakaan. Pemilahan buku rusak dan layak.  
* **Hari 6-7:** Pendaftaran domain kalosi.desa.id dan pembelian hosting. Upload dokumen legalitas ke registrar.

### **Minggu 2: Instalasi & Konfigurasi Inti**

* **Hari 8-10:** Instalasi SLiMS 9 Bulian di subdomain pustaka.kalosi.desa.id. Setting parameter dasar (Nama, Logo, Denda).  
* **Hari 11-13:** Instalasi WordPress di bumdes.kalosi.desa.id. Instalasi tema Astra, Elementor, dan WooCommerce.  
* **Hari 14:** Konfigurasi plugin "OneClick Chat to Order". Tes koneksi tombol WA ke HP Admin.

### **Minggu 3: Konten & Data Entry (Fase Terberat)**

* **Hari 15-18:** **Sesi Foto Produk.** Foto semua menu makanan dan wahana wisata malam. Edit agar cerah dan menarik.  
* **Hari 19-21:** Input produk ke WooCommerce. Menulis deskripsi yang menarik ("Nasi Goreng Spesial Kalosi dengan bumbu rahasia...").  
* **Hari 22-28:** **Input Data Buku.** Mahasiswa KKN bekerja bergantian menginput data buku ke SLiMS. Target: 50-100 buku per hari. Cetak dan tempel stiker barcode pada buku.

### **Minggu 4: E-Book & Uji Coba**

* **Hari 29-31:** Upload koleksi E-Book awal (Materi pelajaran sekolah, panduan pertanian, peraturan desa). Pastikan file bisa diunduh.  
* **Hari 32-34:** Simulasi Order BUMDes. Lakukan 20x pesanan palsu untuk melatih Admin merespons WA dan menghitung ongkir.  
* **Hari 35:** Simulasi Peminjaman Buku. Latih Pustakawan menggunakan *barcode scanner* (atau aplikasi scanner di HP Android jika alat belum ada).

### **Minggu 5: Pelatihan & Peluncuran**

* **Hari 36-40:** Pendampingan penuh (Mentoring). Mahasiswa KKN duduk di samping operator BUMDes dan Pustakawan saat jam kerja. Jangan hanya memberi manual, tapi biarkan mereka mengoperasikan sendiri dengan diawasi.  
* **Hari 41-42:** Finalisasi Modul Panduan (PDF & Video Tutorial).  
* **Hari 45:** *Grand Launching* & Serah Terima.

## ---

**Bab VII: Penutup**

Implementasi kedua program kerja ini memiliki potensi dampak yang transformatif bagi Desa Kalosi. Dengan **Website BUMDes**, "Sumber Kalosi" tidak hanya mendigitalkan penjualan, tetapi juga memperluas jangkauan pasar "Wisata Malam" ke audiens yang lebih luas di luar kecamatan, sekaligus merapikan manajemen logistik kurir desa. Dengan **Sistem Perpustakaan SLiMS**, desa melompat jauh ke depan dalam penyediaan akses literasi, memberikan warga akses ke ribuan ilmu pengetahuan baik melalui buku fisik maupun *e-book* digital.

Kunci keberhasilan jangka panjang terletak pada **komitmen operasional**. Infrastruktur teknologi yang dibangun oleh mahasiswa KKN hanyalah kerangka; "nyawa" dari sistem ini adalah kedisiplinan admin BUMDes dalam merespons *chat* dan ketekunan pustakawan dalam mengelola sirkulasi. Dengan dukungan latar belakang IT dari Sekretaris Desa, peluang keberlanjutan sistem ini sangat tinggi, menjadikan Desa Kalosi sebagai model percontohan desa digital cerdas di Kabupaten Sidrap.

---

**Lampiran Rekomendasi Teknis Singkat:**

* **Nama Domain:** kalosi.desa.id  
* **Subdomain BUMDes:** bumdes.kalosi.desa.id  
* **Subdomain Perpus:** pustaka.kalosi.desa.id  
* **Software Perpus:** SLiMS 9 Bulian  
* **Software BUMDes:** WordPress \+ WooCommerce \+ OneClick Chat to Order  
* **Server:** Linux Hosting (cPanel), PHP 7.4/8.1, MariaDB.

#### **Karya yang dikutip**

1. Website Resmi Desa Kalosi, diakses Desember 27, 2025, [https://kalosi.digitaldesa.id/](https://kalosi.digitaldesa.id/)  
2. Pemkab Sidrap Apresiasi Inovasi Bumdes Desa Kalosi Hadirkan Destinasi Wisata, diakses Desember 27, 2025, [https://sidrapkab.go.id/berita/detail\_berita/pemkab-sidrap-apresiasi-inovasi-bumdes-desa-kalosi-hadirkan-destinasi-wisata](https://sidrapkab.go.id/berita/detail_berita/pemkab-sidrap-apresiasi-inovasi-bumdes-desa-kalosi-hadirkan-destinasi-wisata)  
3. BUMDES SUMBER KALOSI | Website Resmi Desa Kalosi, diakses Desember 27, 2025, [https://kalosi.digitaldesa.id/wisata/bumdes-sumber-kalosi](https://kalosi.digitaldesa.id/wisata/bumdes-sumber-kalosi)  
4. BUMDES GERBANG EMAS DESA KALOSI KEC. DUA PITUE KAB. SIDRAP \- YouTube, diakses Desember 27, 2025, [https://www.youtube.com/watch?v=Bh5aptwqoeM](https://www.youtube.com/watch?v=Bh5aptwqoeM)  
5. OneClick Chat to Order – WordPress plugin, diakses Desember 27, 2025, [https://wordpress.org/plugins/oneclick-whatsapp-order/](https://wordpress.org/plugins/oneclick-whatsapp-order/)  
6. OneClick Chat to Order Plugin \- WordPress.com, diakses Desember 27, 2025, [https://wordpress.com/plugins/oneclick-whatsapp-order](https://wordpress.com/plugins/oneclick-whatsapp-order)  
7. OneClick Chat to Order \- WP Hive, diakses Desember 27, 2025, [https://wphive.com/plugins/oneclick-whatsapp-order/](https://wphive.com/plugins/oneclick-whatsapp-order/)  
8. The 5 best WordPress plug-ins for librarians in 2025 | The Jotform Blog, diakses Desember 27, 2025, [https://www.jotform.com/blog/wordpress-plugins-for-librarians/](https://www.jotform.com/blog/wordpress-plugins-for-librarians/)  
9. Features \- Mooberry Book Manager, diakses Desember 27, 2025, [https://www.mooberrybookmanager.com/features/](https://www.mooberrybookmanager.com/features/)  
10. Official Website of Koha Library Software, diakses Desember 27, 2025, [https://koha-community.org/](https://koha-community.org/)  
11. 7 Best Open Source Library Management Software \- It's FOSS, diakses Desember 27, 2025, [https://itsfoss.com/open-source-library-management-software/](https://itsfoss.com/open-source-library-management-software/)  
12. Sosialisasi Standar Operasional Prosedure Pengadaan Barang/Jasa BUMDesa untuk Tingkatkan Akuntabilitas \- dispermades, diakses Desember 27, 2025, [https://dispermades.karanganyarkab.go.id/2025/11/14/sosialisasi-standar-operasional-prosedure-pengadaan-barang-jasa-bumdesa-untuk-tingkatkan-akuntabilitas/](https://dispermades.karanganyarkab.go.id/2025/11/14/sosialisasi-standar-operasional-prosedure-pengadaan-barang-jasa-bumdesa-untuk-tingkatkan-akuntabilitas/)  
13. Sop Pengadaan Barjas Bumdes-Bumdesa Bersama Kec. Pamarican Kab. Ciamis \- Scribd, diakses Desember 27, 2025, [https://id.scribd.com/document/882329314/7-Sop-Pengadaan-Barjas-Bumdes-bumdesa-Bersama-Kec-Pamarican-Kab-Ciamis](https://id.scribd.com/document/882329314/7-Sop-Pengadaan-Barjas-Bumdes-bumdesa-Bersama-Kec-Pamarican-Kab-Ciamis)  
14. Permohonan Domain Desa – Diskominfo Kabupaten Landak, diakses Desember 27, 2025, [https://diskominfo.landakkab.go.id/permohonan-domain-desa/](https://diskominfo.landakkab.go.id/permohonan-domain-desa/)  
15. Syarat & Biaya \- Kementerian Komunikasi dan Informatika \-, diakses Desember 27, 2025, [https://domain.layanan.go.id/syarat-biaya](https://domain.layanan.go.id/syarat-biaya)  
16. id Domain Registration \- Namecheap, diakses Desember 27, 2025, [https://www.namecheap.com/domains/registration/cctld/id/](https://www.namecheap.com/domains/registration/cctld/id/)