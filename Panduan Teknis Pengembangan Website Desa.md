# **Transformasi Arsitektur Web Modern: Eksplorasi Mendalam Ekosistem React dan Next.js untuk Solusi Enterprise dan UMKM**

## **1\. Pendahuluan: Dominasi dan Evolusi Stack React/Next.js dalam Pengembangan Web Kontemporer**

Dalam dekade terakhir, paradigma pengembangan web telah mengalami pergeseran tektonik dari arsitektur monolitik yang kaku menuju ekosistem yang terkomposisi, modular, dan berbasis komponen. Di pusat revolusi ini berdiri **React** sebagai perpustakaan antarmuka (UI) dan **Next.js** sebagai meta-framework yang membungkusnya menjadi solusi full-stack yang komprehensif. Pernyataan bahwa seorang pengembang dapat membangun hampir semua jenis aplikasi web—mulai dari platform *e-commerce* terdesentralisasi hingga sistem manajemen data yang kompleks—hanya dengan mengandalkan keahlian dalam React dan Next.js adalah tesis yang sangat valid dan didukung oleh data empiris dari lanskap teknologi saat ini.

Laporan ini menyajikan analisis mendalam dan komprehensif mengenai kapabilitas, pola arsitektur, dan strategi implementasi untuk memanfaatkan React dan Next.js sebagai fondasi teknologi utama. Analisis ini tidak hanya sekadar memvalidasi preferensi pengembang terhadap stack ini, tetapi juga mengeksplorasi bagaimana ekosistem ini telah berkembang untuk menggantikan peran tradisional bahasa backend seperti PHP atau Python dalam banyak kasus penggunaan.

Kita akan membedah secara rinci bagaimana stack ini menangani berbagai skenario: mulai dari *Conversational Commerce* yang memanfaatkan integrasi WhatsApp untuk pasar negara berkembang, hingga sistem manajemen perpustakaan (Library Management Systems) yang membutuhkan integritas data relasional. Lebih jauh lagi, laporan ini akan menavigasi kompleksitas *deployment* modern pada infrastruktur warisan (legacy) seperti cPanel, serta memberikan evaluasi kritis terhadap layanan Backend-as-a-Service (BaaS) seperti Supabase dan Firebase, dan Headless CMS seperti Sanity dan Contentful, khususnya dalam konteks batasan *free tier* untuk proyek skala kecil dan menengah.

Tujuan utama dari dokumen ini adalah memberikan panduan strategis dan teknis bagi pengembang yang telah "terbiasa" dengan React/Next.js untuk memaksimalkan potensi stack tersebut, mengubah keakraban menjadi keunggulan kompetitif dalam membangun solusi digital yang tangguh, skalabel, dan efisien biaya di tahun 2025 dan seterusnya.

## **2\. Arsitektur E-Commerce Terdesentralisasi: Paradigma "Checkout" via WhatsApp**

Evolusi *e-commerce* tidak lagi tunggal. Sementara perusahaan ritel raksasa tetap bertahan dengan arsitektur *headless* yang kompleks dengan gateway pembayaran terintegrasi, sektor Usaha Mikro, Kecil, dan Menengah (UMKM)—terutama di wilayah di mana penetrasi kartu kredit rendah namun penggunaan aplikasi pesan instan tinggi—telah beralih ke model "Conversational Commerce". Dalam ekosistem React/Next.js, model ini diimplementasikan melalui arsitektur "No-Backend" atau "Low-Backend" yang cerdas, yang membebankan manajemen sesi ke sisi klien dan transaksional ke platform WhatsApp.

### **2.1. Filosofi "No-Backend" dalam Perdagangan Digital**

Model *e-commerce* tradisional menuntut infrastruktur backend yang berat untuk mengelola sesi keranjang belanja (*server-side sessions*), integrasi gateway pembayaran yang ketat (seperti Stripe atau Midtrans), dan persistensi pesanan ke dalam database relasional. Bagi banyak pengembang independen atau proyek UMKM, lapisan ini seringkali merupakan *over-engineering* yang tidak perlu.

Model "WhatsApp Checkout" membalikkan paradigma ini dengan memanfaatkan perangkat pengguna sebagai penyimpanan data sementara (*state*) dan WhatsApp sebagai saluran pemrosesan pesanan.

#### **2.1.1. Manajemen State Klien: Peran Vital react-use-cart**

Jantung dari arsitektur ini adalah manajemen *state* yang persisten di sisi klien. Pustaka seperti react-use-cart telah muncul sebagai standar *de facto* dalam domain ini.1 Berbeda dengan manajemen sesi sisi server yang membebani memori server dan database (seperti Redis), react-use-cart memanfaatkan LocalStorage pada browser pengguna untuk menyimpan data keranjang belanja.

Implikasi arsitektural dari pendekatan ini sangat signifikan:

1. **Reduksi Biaya Server:** Karena keranjang belanja hidup di browser pengguna, server (dalam hal ini hosting Next.js) tidak perlu melakukan operasi tulis (*write operations*) ke database setiap kali pengguna menambahkan barang. Ini memungkinkan penggunaan paket hosting yang sangat minimalis atau bahkan statis.1  
2. **Persistensi Tanpa Login:** Pengguna tidak perlu membuat akun atau *login* untuk agar keranjang belanja mereka tersimpan. Jika mereka menutup tab dan kembali lagi nanti, LocalStorage memastikan item mereka masih ada, mengurangi friksi dan potensi *churn*.1  
3. **Kinerja (Performance):** Operasi penambahan, pengurangan, dan penghapusan item terjadi secara instan di memori klien, memberikan umpan balik antarmuka (UI feedback) yang jauh lebih cepat dibandingkan menunggu respons API server.1

#### **2.1.2. Mekanisme Integrasi Checkout WhatsApp**

Titik kritis dalam arsitektur ini adalah transisi dari "Keranjang Belanja" ke "Pemesanan". Alih-alih mengarahkan pengguna ke formulir pembayaran yang aman, aplikasi menghasilkan pesan teks terstruktur yang merinci pesanan tersebut. Pesan ini kemudian dienkripsi menjadi tautan deep-link wa.me.2

Alur logika integrasi ini biasanya mengikuti langkah-langkah berikut:

1. **Agregasi Data:** Aplikasi mengiterasi objek keranjang yang tersimpan dalam *state* (misalnya, mengambil array items, menghitung cartTotal, dan totalUniqueItems dari hook useCart).1  
2. **Konstruksi Templat Pesan:** Sebuah string literal dibangun yang mencakup nama produk, varian, kuantitas, harga satuan, dan subtotal. Implementasi yang lebih canggih juga menyertakan ID referensi unik atau tautan kembali ke halaman produk untuk memudahkan penjual memverifikasi stok.4  
3. **Encoding URL:** String tersebut harus melewati proses encodeURIComponent untuk memastikan kompatibilitas dengan standar URL, menangani karakter khusus seperti spasi, baris baru (\\n), dan simbol mata uang agar terbaca dengan rapi di antarmuka obrolan WhatsApp.  
4. **Redireksi & Inisiasi Chat:** Pengguna diarahkan ke endpoint API WhatsApp, yang secara otomatis membuka aplikasi di ponsel atau WhatsApp Web di desktop, dengan pesan pesanan yang sudah terisi di kolom input.4

Metode ini secara efektif mengubah aplikasi pesan menjadi Sistem Manajemen Pesanan (OMS) manual, di mana negosiasi pembayaran, konfirmasi stok, dan logistik pengiriman diselesaikan melalui percakapan manusia-ke-manusia.6

### **2.2. Templat Arsitektural dan Boilerplate**

Ekosistem React/Next.js menyediakan berbagai templat yang menstandarisasi arsitektur ini, memungkinkan pengembang untuk melewati fase inisiasi proyek yang memakan waktu.

#### **2.2.1. Integrasi NextMerce dan Sanity CMS**

Salah satu contoh arsitektur hibrida yang menonjol adalah integrasi Next.js dengan Sanity CMS, seperti yang terlihat pada templat NextMerce.7 Dalam konfigurasi ini:

* **Sanity CMS** bertindak sebagai *Product Information Management* (PIM). Ia menyimpan data produk, gambar, deskripsi, harga, dan status inventaris.  
* **Next.js** mengambil data ini pada saat *build time* (menggunakan getStaticProps atau metode *fetch* pada App Router) untuk menghasilkan halaman produk statis (Static Site Generation/SSG).7

Pendekatan ini menawarkan keseimbangan optimal: situs web sangat ramah SEO dan cepat karena halaman produk sudah di-render sebelumnya (pre-rendered) 8, namun fungsionalitas keranjang belanja tetap dinamis di sisi klien. Sanity juga memungkinkan pembaruan konten secara *real-time*; webhook dapat dikonfigurasi untuk memicu pembangunan ulang (*rebuild*) situs Next.js setiap kali data produk diubah di CMS, menjaga katalog tetap sinkron.9

#### **2.2.2. Vercel Commerce dan Kinerja Tinggi**

Untuk pengembang yang mencari fondasi rekayasa yang lebih ketat, **Vercel Commerce** merepresentasikan puncak arsitektur *e-commerce* Next.js.10 Meskipun sering dikonfigurasi untuk gateway pembayaran tradisional, desain modularnya memungkinkan komponen *checkout* diganti dengan modul logika WhatsApp. Templat ini memanfaatkan **React Server Components (RSC)** dan **Suspense** untuk menangani *streaming* data, memastikan bahwa katalog besar pun dapat dimuat secara perseptual lebih cepat daripada arsitektur SPA tradisional. Penggunaan fitur Next.js 14+ seperti App Router menyederhanakan logika routing, membuat struktur direktori lebih intuitif bagi pengembang yang mengelola kategori produk yang kompleks.10

### **2.3. Pertimbangan Operasional untuk Perdagangan via WhatsApp**

#### **2.3.1. Friksi Pengalaman Pengguna (UX) vs. Kenyamanan**

Meskipun model WhatsApp menyederhanakan stack teknologi, ia memperkenalkan tantangan UX yang spesifik. Tingkat pengabaian keranjang (*cart abandonment*) bisa menjadi tinggi jika transisi dari "Tambah ke Keranjang" ke "Chat WhatsApp" terasa kasar atau mengejutkan.11 Studi UX menunjukkan bahwa mendikte alur pengguna terlalu kaku—misalnya, memaksa *checkout* segera setelah menambahkan satu item—dapat menjadi kontraproduktif. Sebaliknya, ikon keranjang yang persisten atau modal konfirmasi yang memungkinkan pengguna untuk "Lanjut Belanja" lebih disukai.11 Tombol aksi utama (CTA) harus diberi label secara eksplisit, misalnya "Pesan via WhatsApp", untuk mengelola ekspektasi pengguna dan membedakannya dari *checkout* otomatis standar.

#### **2.3.2. Privasi Data dan Keamanan**

Ketika memindahkan proses *checkout* ke aplikasi pesan, aplikasi web secara inheren menangani lebih sedikit data sensitif (seperti nomor kartu kredit), yang secara drastis mengurangi beban kepatuhan (seperti PCI-DSS). Namun, tanggung jawab pengembang bergeser ke validasi data. Karena parameter URL pesan WhatsApp dapat dimanipulasi oleh pengguna yang paham teknologi (misalnya, mengubah harga di string pesan sebelum mengirim), penjual **wajib** memvalidasi harga dan total pesanan yang diterima di chat terhadap katalog harga mereka saat ini sebelum memproses transaksi. Langkah validasi manual ini adalah komponen operasional kritis dalam arsitektur ini yang tidak boleh diabaikan.4

### **2.4. Strategi UI Komponen untuk E-Commerce**

Dalam membangun antarmuka *e-commerce*, penggunaan pustaka komponen berbasis utilitas seperti **Tailwind CSS** sangat disarankan untuk mempercepat pengembangan tanpa mengorbankan fleksibilitas desain.

* **Flowbite & FlyonUI:** Pustaka seperti Flowbite menyediakan komponen siap pakai seperti "Product Card", "Shopping Cart Modal", dan formulir checkout yang dibangun di atas kelas-kelas Tailwind.12 Penggunaan komponen ini memastikan konsistensi visual dan responsivitas di seluruh perangkat (mobile vs desktop), yang krusial untuk konversi *e-commerce*.  
* **Shadcn/ui:** Untuk pendekatan yang lebih granular dan terfokus pada aksesibilitas, *shadcn/ui* (yang sering disebut dalam ekosistem Next.js modern 14) menawarkan komponen yang dapat disalin-tempel (*copy-paste*) langsung ke dalam kode sumber proyek. Ini memberikan kontrol penuh kepada pengembang atas logika dan *styling* komponen, berbeda dengan pustaka komponen tradisional yang terbungkus dalam paket npm yang kaku.

## **3\. Sistem Manajemen Informasi & Data: Studi Kasus Sistem Perpustakaan**

Bergerak melampaui *e-commerce*, fleksibilitas stack React/Next.js mungkin paling baik dicontohkan dalam aplikasi intensif data seperti Sistem Manajemen Perpustakaan (Library Management Systems \- LMS). Sistem ini menuntut manajemen relasi data yang kuat (Buku, Pengguna, Transaksi Peminjaman), kemampuan pencarian yang kompleks, dan alur otentikasi yang aman.

### **3.1. Perbandingan Stack: MERN vs. Next.js \+ BaaS**

Pendekatan tradisional untuk membangun LMS sering kali melibatkan stack **MERN** (MongoDB, Express, React, Node.js). Meskipun efektif, pendekatan ini mengharuskan pengembang untuk memelihara server backend terpisah dan mendefinisikan skema database secara manual dalam kode (model Mongoose).16 Paradigma Next.js modern menantang status quo ini dengan mengintegrasikan logika backend melalui API Routes atau memanfaatkan Backend-as-a-Service (BaaS) seperti Supabase.

#### **3.1.1. Warisan Stack MERN**

Repositori seperti Library-Management-System-MERN 17 dan LibraryManagement 16 mendemonstrasikan struktur monolitik klasik. Di sini, backend (Express.js) mengekspos endpoint REST (/api/books, /api/users), dan frontend React mengonsumsinya. Meskipun menawarkan kontrol total, ini mengharuskan pengelolaan *uptime* server, koneksi database, dan dokumentasi API. Bagi seorang pengembang yang "terbiasa dengan React," beban kognitif untuk memelihara backend Express sering kali menjadi gangguan dari fokus utama pada antarmuka pengguna dan logika bisnis.18

#### **3.1.2. Evolusi Next.js \+ Supabase**

Proyek sumber terbuka yang lebih baru, seperti University-Library-Management-System--NextJS-FullStack 19 atau library-management-system oleh ChanMeng666 20, menunjukkan pergeseran menuju **Supabase**. Stack ini menggantikan MongoDB/Express dengan PostgreSQL dan API yang dibuat secara otomatis.

* **Integritas Relasional:** Berbeda dengan model dokumen MongoDB, Supabase menyediakan database relasional Postgres. Untuk sebuah LMS, ini sangat krusial. Entitas "Buku" memiliki hubungan ketat dengan entitas "Pengguna" melalui "Transaksi Peminjaman". *SQL Joins* jauh lebih efisien dan akurat untuk query seperti "tampilkan semua buku yang sedang dipinjam oleh User X dan terlambat lebih dari 3 hari" dibandingkan dengan *aggregation pipelines* NoSQL yang sering ditemukan dalam implementasi MERN.19  
* **Kapabilitas Real-time:** Fitur langganan *real-time* Supabase memungkinkan dasbor admin diperbarui secara instan ketika buku dikembalikan atau dipinjam, sebuah fitur yang memerlukan pengaturan WebSockets (Socket.io) manual yang rumit dalam stack MERN.21  
* **Kecepatan Pengembangan:** Dengan menggunakan API Routes Next.js atau pustaka klien Supabase secara langsung, pengembang dapat mengeliminasi *boilerplate* logika routing dan kontroler yang biasanya memadati aplikasi Express.22

### **3.2. Arsitektur "Client-Side Only" (Firebase)**

Untuk sistem perpustakaan skala kecil, yang mungkin ditujukan untuk penggunaan pribadi atau komunitas kecil, arsitektur "Client-Side Only" adalah opsi yang layak dan sering diabaikan. Proyek seperti library-management-system oleh fdeliu 23 dan Library-Management-System-Client 24 memanfaatkan **Firebase**.

* **Mekanisme:** Aplikasi ini menginisialisasi SDK Firebase langsung di dalam komponen React. Pengambilan data (*data fetching*) terjadi di dalam hook useEffect.  
* **Kelebihan & Kekurangan:** Keuntungan utamanya adalah kesederhanaan dan *zero backend code*. Kekurangannya adalah paparan logika bisnis ke klien. Tanpa aturan keamanan yang ketat (Firestore Security Rules), pengguna yang cerdik secara teoritis dapat memanipulasi JavaScript untuk menandai buku sebagai "dikembalikan" tanpa otorisasi.25  
* **Relevansi bagi Pengguna:** Mengingat pengguna menyatakan "terbiasa dengan React/Next.js," pola ini memungkinkan mereka membangun sistem fungsional murni dengan kode frontend, memperlakukan database hanya sebagai API lain yang dikonsumsi, tanpa perlu menyentuh logika server Node.js.

### **3.3. Fitur Lanjutan dalam LMS Berbasis Next.js**

Implementasi LMS modern dengan Next.js melampaui operasi CRUD dasar dengan memanfaatkan fitur spesifik framework:

* **Pencarian dan Penyaringan via URL:** Memanfaatkan URL Search Params di Next.js untuk menangani penyaringan (misalnya, ?genre=fiksi\&status=tersedia) memungkinkan status pencarian yang dapat dibagikan (*shareable state*) dan efisiensi penyaringan di sisi server.26  
* **Otentikasi & Manajemen Peran:** Mengintegrasikan NextAuth atau Supabase Auth menangani kompleksitas login aman. Implementasi tingkat lanjut membatasi rute administratif (misalnya, /admin/tambah-buku) menggunakan **Next.js Middleware**, memastikan bahwa pengguna standar sama sekali tidak dapat mengakses antarmuka sensitif tersebut, bahkan jika mereka mengetahui URL-nya.27  
* **Pelacakan Buku Otomatis:** Beberapa templat sumber terbuka mengintegrasikan API eksternal (seperti Google Books API) untuk mengisi detail buku secara otomatis hanya berdasarkan input ISBN. Fitur ini dapat ditangani dengan elegan oleh Next.js API Routes yang bertindak sebagai proksi untuk menyembunyikan kunci API dari klien.28

## **4\. Ekosistem Backend & Database: Analisis Komparatif BaaS dan Headless CMS**

Keputusan kritis bagi setiap pengembang React/Next.js adalah menentukan di mana data akan tinggal. Pilihan ini biasanya jatuh antara **Backend-as-a-Service (BaaS)** seperti Supabase/Firebase atau **Headless CMS** seperti Sanity/Contentful. Keputusan ini berdampak langsung pada biaya, skalabilitas, dan umur panjang "free tier"—sebuah pertimbangan utama untuk proyek pribadi atau *bootstrapped*.

### **4.1. Supabase vs. Firebase: Pertarungan Basis Data**

Kedua platform menawarkan *free tier* yang murah hati, namun model operasional dan batasan tersembunyinya berbeda secara signifikan.

#### **4.1.1. Supabase (Penantang Berbasis SQL)**

* **Arsitektur:** Dibangun di atas PostgreSQL. Ini menawarkan tampilan berbasis tabel yang intuitif bagi pengembang yang terbiasa dengan spreadsheet atau SQL tradisional.29  
* **Batasan Free Tier:** Supabase menawarkan 500MB ruang database dan 5GB bandwidth. Namun, ada satu peringatan kritis untuk "proyek desa" atau situs dengan lalu lintas rendah: **Kebijakan Jeda (Pausing Policy)**. Proyek *free tier* akan "dijeda" (paused) oleh Supabase setelah 1 minggu tidak ada aktivitas untuk menghemat sumber daya server.30  
* **Masalah "Pausing" & Solusinya:** Ketika dijeda, API menjadi tidak responsif hingga diaktifkan kembali secara manual di dasbor. Ini sangat merugikan untuk situs portofolio atau demo yang mungkin hanya dikunjungi sesekali.  
  * *Solusi Teknis:* Komunitas pengembang telah mengembangkan mekanisme "Keep Alive". Sebuah alur kerja **GitHub Actions** dapat dikonfigurasi untuk menjalankan *cron job* (misalnya, setiap hari) yang memanggil endpoint API tertentu di aplikasi Next.js. Endpoint ini kemudian melakukan operasi baca ringan (*lightweight read*) ke database Supabase, memberi sinyal aktivitas dan mencegah proyek dijeda.31  
* **Row Level Security (RLS):** Supabase memungkinkan definisi kebijakan keamanan langsung di tingkat database (contoh: auth.uid() \= user\_id). Ini memungkinkan klien Next.js untuk melakukan query database secara langsung tanpa lapisan API perantara, sambil tetap menjaga keamanan data per pengguna—sebuah pendorong produktivitas yang masif.34

#### **4.1.2. Firebase (Veteran NoSQL)**

* **Arsitektur:** Menggunakan model *document-store* (Firestore). Ia unggul dalam skalabilitas horizontal dan pembaruan *real-time* (seperti aplikasi chat).29  
* **Batasan Free Tier:** Paket "Spark" sangat murah hati dengan batasan berdasarkan penggunaan (usage-based), bukan waktu. Ia mengizinkan 50.000 pembacaan dan 20.000 penulisan per hari.35 Berbeda dengan Supabase, **Firebase tidak pernah menjeda proyek yang tidak aktif**. Sebuah proyek dapat dibiarkan non-aktif selama bertahun-tahun dan akan tetap bangun seketika saat ada permintaan.36  
* **Trade-offs:** Model harga adalah "pay-as-you-go" jika Anda melebihi batas. Meskipun *free tier*\-nya besar, query yang kompleks dalam NoSQL seringkali memerlukan pembacaan dokumen ganda, yang dapat memakan kuota jauh lebih cepat daripada yang diperkirakan.37 Selain itu, memodelkan data relasional yang kompleks (seperti dalam LMS) jauh lebih sulit dan kurang intuitif di Firestore dibandingkan di Supabase.38

Berikut adalah tabel perbandingan untuk memudahkan pemilihan strategi database:

| Fitur | Supabase (PostgreSQL) | Firebase (Firestore NoSQL) |
| :---- | :---- | :---- |
| **Model Data** | Relasional (Tabel, Foreign Keys). Ideal untuk data terstruktur (LMS, ERP). | Dokumen (JSON-like collections). Ideal untuk data hirarkis/fleksibel (Chat, Social). |
| **Query** | SQL Penuh & API JS (Mirip ORM). Sangat *powerful* untuk filtering kompleks. | Terbatas pada indeks yang dibuat. Query relasional sulit. |
| **Real-time** | Berbasis langganan Postgres (Changesets). | *Best-in-class* real-time updates. |
| **Free Tier** | 500MB DB. Proyek mati setelah 1 minggu inaktivitas. | 1GB Storage. 50k reads/hari. **Tidak pernah mati (Always On).** |
| **Otentikasi** | Terintegrasi erat dengan RLS database. | Terpisah, namun mudah diintegrasikan. |
| **Rekomendasi** | Gunakan untuk aplikasi bisnis, LMS, Dashboard Admin. | Gunakan untuk aplikasi chat, MVP cepat, Proyek hobi jangka panjang. |

### **4.2. Headless CMS: Sanity vs. Contentful vs. Strapi**

Untuk situs yang padat konten (blog, portofolio, katalog *e-commerce*), menggunakan Headless CMS jauh lebih unggul daripada database mentah.

* **Sanity (Pilihan Fleksibel):** Bagi pengembang Next.js, Sanity sering menjadi pemenang karena pendekatan "Content Lake" dan kemampuan untuk menanamkan **Sanity Studio** (antarmuka editor) langsung ke dalam rute aplikasi Next.js (misalnya, di /admin).9 Bahasa query mereka, GROQ, sangat ekspresif. Selain itu, *free tier*\-nya sangat sulit untuk dihabiskan untuk proyek pribadi, tidak seperti Contentful yang memiliki batasan model yang ketat.40  
* **Contentful (Standar Enterprise):** Perubahan terbaru pada paket gratis Contentful (efektif April 2025\) telah memperkenalkan batas **25 model konten** (content types).41 Ini bisa menjadi sangat membatasi untuk skema *e-commerce* atau LMS yang kompleks. Namun, untuk integrasi tim pemasaran perusahaan, Contentful tetap menjadi standar emas.  
* **Strapi (Opsi Self-Hosted):** Jika pengembang ingin kontrol penuh dan menghindari *vendor lock-in*, Strapi adalah pilihan *open-source* terbaik yang bisa di-hosting sendiri (self-hosted) di server yang sama dengan aplikasi Next.js (jika menggunakan VPS) atau layanan terpisah.42

## **5\. Tantangan Deployment & Infrastruktur pada Lingkungan Terbatas**

Query pengguna menyiratkan keakraban dengan ekosistem React, namun *deployment* sering kali menjadi rintangan utama, terutama jika infrastruktur yang tersedia adalah *shared hosting* berbasis **cPanel**, yang sangat umum di Indonesia, dibandingkan dengan lingkungan modern seperti Vercel atau Netlify.

### **5.1. Tantangan "cPanel" untuk Aplikasi Node.js**

Lingkungan *shared hosting* biasanya menjalankan server web Apache/Nginx atau LiteSpeed dan dioptimalkan untuk PHP (WordPress). Mereka sering kali tidak memiliki kemampuan untuk menjalankan proses Node.js yang persisten (*long-lived processes*) yang diperlukan untuk fitur Server-Side Rendering (SSR) Next.js.43

* **Node.js Selector:** Beberapa host cPanel menawarkan fitur "Setup Node.js App" (menggunakan CloudLinux). Ini memungkinkan pengguna menjalankan server Next.js mandiri. Namun, fitur ini sering kali terganggu oleh batasan memori yang ketat dan versi Node.js yang usang, serta masalah *kill process* otomatis oleh server jika penggunaan sumber daya melonjak.44  
* **Konflik Port:** Shared hosting jarang mengizinkan aplikasi untuk melakukan *binding* ke port sembarang, mengharuskan penulisan ulang .htaccess yang rumit untuk mem-proksi lalu lintas ke aplikasi Next.js.43

### **5.2. Solusi Robust: Ekspor Statis (output: 'export')**

Solusi paling tangguh dan bebas sakit kepala untuk deployment cPanel adalah **Next.js Static Exports**.

* **Konfigurasi:** Dengan menetapkan output: 'export' di dalam next.config.js (atau next.config.mjs), Next.js akan membangun seluruh aplikasi menjadi folder (biasanya bernama out) yang berisi file HTML, CSS, dan JavaScript murni.45  
* **Deployment:** File-file ini dapat diunggah langsung ke folder public\_html di cPanel melalui FTP atau File Manager. Server cPanel akan memperlakukannya sebagai situs web statis standar, menyajikannya dengan kinerja sangat tinggi dan beban pemrosesan server nol.47  
* **Trade-offs (Kompromi):**  
  * **Rute Dinamis:** Rute seperti /produk/\[id\] harus dihasilkan pada saat *build time* menggunakan fungsi generateStaticParams. Jika ID produk tidak diketahui saat *build* (misalnya produk baru ditambahkan ke database setelah deployment), halaman tersebut tidak akan ada sampai situs di-*rebuild*.48  
  * **Tidak Ada Komponen Server Runtime:** Fitur yang mengandalkan header permintaan (*request headers*), cookie server, atau getServerSideProps tidak akan berfungsi. Aplikasi harus bergantung sepenuhnya pada *Client-Side Rendering (CSR)* untuk data dinamis.45  
  * **Optimasi Gambar:** Komponen \<Image\> default Next.js bergantung pada API optimasi sisi server. Dalam mode ekspor statis, pengembang harus beralih ke *loader* eksternal (seperti Cloudinary, Imgix) atau mengatur unoptimized: true di konfigurasi.46

### **5.3. Workaround "Custom Server" untuk SSR**

Bagi mereka yang mutlak memerlukan SSR di cPanel, opsi "Standalone Build" adalah alternatifnya, meski berisiko.

* **Standalone Mode:** Mengatur output: 'standalone' menghasilkan folder server Node.js minimal yang hanya menyertakan file-file yang diperlukan.  
* **Titik Masuk Server:** Pengembang harus membuat file server.js kustom untuk menjembatani titik masuk cPanel (yang sering mencari app.js atau server.js) dengan *request handler* Next.js.43  
* **Manajemen Sumber Daya:** Metode ini berisiko pada *shared hosting* karena proses Node dapat dimatikan oleh "Out of Memory" (OOM) killer host jika melebihi RAM yang dialokasikan (sering kali serendah 512MB).43

## **6\. Teknikal Lanjutan dalam Next.js**

Membangun fitur kompleks seperti tampilan PDF atau otentikasi sisi klien dalam lingkungan Next.js 14/15 memerlukan pemahaman mendalam tentang batasan *Server Components* dan *Client Components*.

### **6.1. Rendering PDF dan Objek "Window"**

Pustaka seperti react-pdf sangat bergantung pada API spesifik browser (window, document, canvas). Next.js, secara default, mencoba melakukan *pre-render* semua komponen di server, di mana API ini tidak ada. Ini menyebabkan error klasik ReferenceError: window is not defined.50

#### **6.1.1. Strategi use client dan Impor Dinamis**

Untuk mengatasi ini, komponen penampil PDF harus diisolasi secara ketat sebagai *Client Component*.

* **Direktif:** File komponen harus dimulai dengan 'use client'; untuk keluar dari rendering Server Component.50  
* **Impor Dinamis:** Lebih jauh lagi, komponen tersebut harus diimpor ke halaman induk menggunakan next/dynamic dengan opsi ssr: false. Ini memastikan Next.js bahkan tidak mencoba merendernya selama fase pembuatan HTML di server.50

JavaScript

// Contoh Pola Implementasi PDF Viewer  
import dynamic from "next/dynamic";

const PDFViewer \= dynamic(() \=\> import("./PDFViewerComponent"), {  
  ssr: false, // Mematikan SSR sepenuhnya untuk komponen ini  
  loading: () \=\> \<p\>Memuat Dokumen...\</p\>  
});

#### **6.1.2. Konfigurasi Worker**

react-pdf memerlukan file *worker* yang cukup besar (pdf.worker.js) untuk memproses biner PDF. Dalam Next.js (terutama dengan Webpack), worker ini perlu dikonfigurasi dengan benar agar tidak membebani bundle JavaScript utama. Pola yang disarankan adalah memuat worker dari CDN atau menyalinnya ke folder public sebagai aset statis.52

### **6.2. Otentikasi Sisi Klien dengan Firebase**

Dalam arsitektur "Static Export" (misalnya untuk hosting cPanel), kita tidak bisa menggunakan otentikasi berbasis cookie server (seperti NextAuth default atau Supabase SSR). Kita harus menggunakan pola otentikasi sisi klien.

* **Firebase Auth Provider:** Kita membuat *Context Provider* React yang membungkus aplikasi. Provider ini menginisialisasi SDK Firebase di useEffect dan mendengarkan perubahan status otentikasi (onAuthStateChanged).  
* **Persistensi:** Firebase secara otomatis menangani persistensi sesi di *IndexedDB* atau *LocalStorage* browser. Aplikasi React cukup mengecek status konteks ini untuk merender rute yang diproteksi (*protected routes*) atau mengarahkan pengguna ke halaman login.25  
* **Keamanan:** Meskipun otentikasi terjadi di klien, keamanan data tetap terjamin asalkan *Firestore Security Rules* dikonfigurasi dengan benar (misalnya: allow read, write: if request.auth\!= null && request.auth.uid \== userId). Ini memastikan bahwa meskipun seseorang memanipulasi kode frontend, mereka tidak dapat mengakses data pengguna lain di database backend.55

## **7\. Kesimpulan dan Rekomendasi Strategis**

Berdasarkan analisis menyeluruh terhadap ekosistem React/Next.js, berikut adalah rekomendasi strategis bagi pengembang yang ingin memaksimalkan keahlian mereka:

1. **Validasi "Tech Stack":** Keahlian Anda dalam React/Next.js adalah aset yang sangat *versatile*. Anda tidak perlu mempelajari bahasa backend baru (seperti PHP/Laravel atau Python/Django) untuk membangun sistem yang kompleks. Ekosistem JavaScript modern telah menyediakan semua lapisan yang diperlukan.  
2. **Adopsi Mentalitas "BaaS First":** Jangan membangun backend kustom dengan Node/Express kecuali ada kebutuhan spesifik yang memaksa. Untuk LMS atau *E-commerce*, Supabase (untuk kebutuhan SQL/Relasional) atau Firebase (untuk dokumen sederhana/Chat) memberikan peningkatan produktivitas hingga 10x lipat. Risiko keamanan logika sisi klien dapat dimitigasi efektif dengan *Row Level Security* (RLS) dan *Firestore Rules*.  
3. **Efisiensi Biaya dengan Ekspor Statis:** Jika target *deployment* Anda adalah cPanel atau hosting statis gratis, rancang aplikasi sebagai *Static Export* sejak hari pertama. Hindari getServerSideProps dan Server Actions. Gunakan *data fetching* sisi klien (SWR atau TanStack Query) untuk mengisi halaman. Ini membuat aplikasi Anda portabel ke penyedia hosting mana pun tanpa perubahan kode.56  
4. **Manfaatkan WhatsApp untuk "Low-Friction Commerce":** Untuk proyek *e-commerce* skala kecil atau UMKM, hindari kompleksitas integrasi *payment gateway* di awal. Alur "Checkout via WhatsApp" sangat tangguh, ramah pengguna di pasar Indonesia, dan memerlukan nol pemeliharaan backend. Gunakan react-use-cart untuk menangani logika keranjang yang kompleks di sisi klien.  
5. **Waspadai Jebakan "Free Tier":** Jika menggunakan Supabase untuk proyek portofolio yang jarang diakses, Anda **wajib** menyiapkan mekanisme "Keep Alive" (misalnya via GitHub Actions) untuk mencegah database dijeda. Atau, pertimbangkan Firebase yang *always-on* jika skema data Anda memungkinkan model NoSQL.

Dengan memahami batasan infrastruktur (seperti cPanel) dan model harga layanan backend, Anda dapat merekayasa solusi yang tidak hanya canggih secara teknis, tetapi juga berkelanjutan secara operasional dan ekonomis.

#### **Karya yang dikutip**

1. react-use-cart \- NPM, diakses Desember 27, 2025, [https://www.npmjs.com/package/react-use-cart](https://www.npmjs.com/package/react-use-cart)  
2. How to Send WhatsApp Messages in Next.js Using WaSenderAPI (Fast & Easy Guide), diakses Desember 27, 2025, [https://wasenderapi.com/blog/how-to-send-whatsapp-messages-in-nextjs-using-wasenderapi-fast-easy-guide](https://wasenderapi.com/blog/how-to-send-whatsapp-messages-in-nextjs-using-wasenderapi-fast-easy-guide)  
3. Add WhatsApp Chat To Your Website \- React and HTML \- DEV Community, diakses Desember 27, 2025, [https://dev.to/ebereplenty/add-whatsapp-chat-to-your-website-react-and-html-3a5g](https://dev.to/ebereplenty/add-whatsapp-chat-to-your-website-react-and-html-3a5g)  
4. How to Use WhatsApp Shopping Cart Feature Effectively, diakses Desember 27, 2025, [https://www.zoko.io/post/use-whatsapp-shopping-cart-effectively](https://www.zoko.io/post/use-whatsapp-shopping-cart-effectively)  
5. How to Build a Messaging site With React (WhatsApp Clone) \- CometChat, diakses Desember 27, 2025, [https://www.cometchat.com/tutorials/how-to-build-a-messaging-site-with-react-whatsapp-clone](https://www.cometchat.com/tutorials/how-to-build-a-messaging-site-with-react-whatsapp-clone)  
6. Best way to implement WhatsApp communication features in a custom Next.js e-commerce?, diakses Desember 27, 2025, [https://www.reddit.com/r/nextjs/comments/1ez8hrl/best\_way\_to\_implement\_whatsapp\_communication/](https://www.reddit.com/r/nextjs/comments/1ez8hrl/best_way_to_implement_whatsapp_communication/)  
7. NextMerce: Free Next.js eCommerce Boilerplate Template, diakses Desember 27, 2025, [https://nextmerce.com/](https://nextmerce.com/)  
8. 11+ Best Next.js E-commerce Templates for 2026, diakses Desember 27, 2025, [https://nextjstemplates.com/blog/best-nextjs-ecommerce-templates](https://nextjstemplates.com/blog/best-nextjs-ecommerce-templates)  
9. Contentful vs Sanity \- Strapi, diakses Desember 27, 2025, [https://strapi.io/headless-cms/comparison/contentful-vs-sanity](https://strapi.io/headless-cms/comparison/contentful-vs-sanity)  
10. Next.js Commerce \- Vercel, diakses Desember 27, 2025, [https://vercel.com/templates/next.js/nextjs-commerce](https://vercel.com/templates/next.js/nextjs-commerce)  
11. Benefits of having a Shopping Cart (as opposed to "straight to checkout"), diakses Desember 27, 2025, [https://ux.stackexchange.com/questions/131910/benefits-of-having-a-shopping-cart-as-opposed-to-straight-to-checkout](https://ux.stackexchange.com/questions/131910/benefits-of-having-a-shopping-cart-as-opposed-to-straight-to-checkout)  
12. FlyonUI \- Free Tailwind CSS UI Components Library, diakses Desember 27, 2025, [https://flyonui.com/](https://flyonui.com/)  
13. Tailwind CSS Cards \- Flowbite, diakses Desember 27, 2025, [https://flowbite.com/docs/components/card/](https://flowbite.com/docs/components/card/)  
14. adrianhajdin/saas-template: SaaS Starter Template built with Next.js, Supabase & Clerk. Includes seamless auth, manage subscriptions and payments out of the box, and scale faster with a clean, reusable codebase — everything you need to kickstart your SaaS. \- GitHub, diakses Desember 27, 2025, [https://github.com/adrianhajdin/saas-template](https://github.com/adrianhajdin/saas-template)  
15. tribixbite/awesome \- GitHub, diakses Desember 27, 2025, [https://github.com/tribixbite/awesome](https://github.com/tribixbite/awesome)  
16. AnuragRoshan/LibraryManagement: Library Management using MERN is a full-stack web application that allows users to manage books, borrowers, and borrowing transactions in a library setting. \- GitHub, diakses Desember 27, 2025, [https://github.com/AnuragRoshan/LibraryManagement](https://github.com/AnuragRoshan/LibraryManagement)  
17. iampranavdhar/Library-Management-System-MERN: Library Management System built with the MERN (MongoDB, Express, React, and Node.js) stack. It allows librarians and library staff to manage books, borrowers, and borrowing activities efficiently. With a user-friendly interface, this system offers features like book \- GitHub, diakses Desember 27, 2025, [https://github.com/iampranavdhar/Library-Management-System-MERN](https://github.com/iampranavdhar/Library-Management-System-MERN)  
18. MrAalu/LibraryManagementSystem\_MERN-with-Book-Recommendation-Algorithm: Library Management System Full PROJECT (MERN Stack) with Book Recommendation System (Content-Based-Filtering) \- GitHub, diakses Desember 27, 2025, [https://github.com/MrAalu/LibraryManagementSystem\_MERN-with-Book-Recommendation-Algorithm](https://github.com/MrAalu/LibraryManagementSystem_MERN-with-Book-Recommendation-Algorithm)  
19. NextJS-FullStack: Built with Next.js, TypeScript, Postgres, the University Library Management System is a production-grade platform featuring a public-facing app and admin interface. It offers advanced functionalities like seamless book borrowing with reminders and receipts, robust user management, automated workflows, optimized tech stack for real-world scalability \- GitHub, diakses Desember 27, 2025, [https://github.com/arnobt78/University-Library-Management-System--NextJS-FullStack](https://github.com/arnobt78/University-Library-Management-System--NextJS-FullStack)  
20. ChanMeng666/library-management-system: 【Making code with love \- show some love back with a star\! ⭐️】A modern, full-featured library management system built with Next.js 15 and Supabase. Features real-time book tracking, user authentication, borrowing management, and a responsive UI powered by shadcn/ui components. \- GitHub, diakses Desember 27, 2025, [https://github.com/ChanMeng666/library-management-system](https://github.com/ChanMeng666/library-management-system)  
21. The Postgres development platform. Supabase gives you a dedicated Postgres database to build your web, mobile, and AI applications. \- GitHub, diakses Desember 27, 2025, [https://github.com/supabase/supabase](https://github.com/supabase/supabase)  
22. Build a User Management App with Next.js | Supabase Docs, diakses Desember 27, 2025, [https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)  
23. Web app build with Firebase and ReactJS, used for managing books in a library. \- GitHub, diakses Desember 27, 2025, [https://github.com/fdeliu/library-management-system](https://github.com/fdeliu/library-management-system)  
24. TrishonBaidaya7399/library-management-system-client: Admin authority, user-centric profiles, and a turbocharged Borrowed Books cart. Fortified security, seamless authentication (email/password, Google sign-in), and a stylish UI with Dark/Light mode. Take command, elevate experience, and tailor your book \- GitHub, diakses Desember 27, 2025, [https://github.com/TrishonBaidaya7399/library-management-system-client](https://github.com/TrishonBaidaya7399/library-management-system-client)  
25. Firebase Authentication in Nextjs with Server Components \- Stack Overflow, diakses Desember 27, 2025, [https://stackoverflow.com/questions/78011450/firebase-authentication-in-nextjs-with-server-components](https://stackoverflow.com/questions/78011450/firebase-authentication-in-nextjs-with-server-components)  
26. Learn to build a production-grade University Library Management System with industry-standard practices; from rate-limiting, DDoS protection, caching, optimizations, multi-media uploads, complex db queries, and advanced error handling to automated workflows with custom notifications. \- GitHub, diakses Desember 27, 2025, [https://github.com/adrianhajdin/university-library-jsm](https://github.com/adrianhajdin/university-library-jsm)  
27. library-management-system · GitHub Topics, diakses Desember 27, 2025, [https://github.com/topics/library-management-system?l=typescript\&o=desc\&s=stars](https://github.com/topics/library-management-system?l=typescript&o=desc&s=stars)  
28. vercel-labs/book-inventory \- GitHub, diakses Desember 27, 2025, [https://github.com/vercel-labs/book-inventory](https://github.com/vercel-labs/book-inventory)  
29. Supabase vs. Firebase: Which is best? \[2025\] \- Zapier, diakses Desember 27, 2025, [https://zapier.com/blog/supabase-vs-firebase/](https://zapier.com/blog/supabase-vs-firebase/)  
30. Pricing & Fees \- Supabase, diakses Desember 27, 2025, [https://supabase.com/pricing](https://supabase.com/pricing)  
31. How to Prevent Your Supabase Project Database from Being Paused Using GitHub Actions, diakses Desember 27, 2025, [https://dev.to/jps27cse/how-to-prevent-your-supabase-project-database-from-being-paused-using-github-actions-3hel](https://dev.to/jps27cse/how-to-prevent-your-supabase-project-database-from-being-paused-using-github-actions-3hel)  
32. Prevent Supabase project from pausing with GitHub Actions | Natt Nguyen, diakses Desember 27, 2025, [https://natt.sh/blog/2024-03-17-supabase-activity-scheduler](https://natt.sh/blog/2024-03-17-supabase-activity-scheduler)  
33. Prevent Supabase projects from getting paused due to inactivity \- GitHub, diakses Desember 27, 2025, [https://github.com/travisvn/supabase-pause-prevention](https://github.com/travisvn/supabase-pause-prevention)  
34. Row Level Security | Supabase Docs, diakses Desember 27, 2025, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
35. Supabase vs Firebase, diakses Desember 27, 2025, [https://supabase.com/alternatives/supabase-vs-firebase](https://supabase.com/alternatives/supabase-vs-firebase)  
36. Supabase vs Firebase: Evaluation of performance and development of Progressive Web Apps | by Amanual Zewdie | Medium, diakses Desember 27, 2025, [https://medium.com/@babyzewdie/supabase-vs-firebase-evaluation-of-performance-and-development-of-progressive-web-apps-c43766c40ccb](https://medium.com/@babyzewdie/supabase-vs-firebase-evaluation-of-performance-and-development-of-progressive-web-apps-c43766c40ccb)  
37. Scalable Cost \- Firebase vs. Supabase \- Reddit, diakses Desember 27, 2025, [https://www.reddit.com/r/Firebase/comments/12tea3a/scalable\_cost\_firebase\_vs\_supabase/](https://www.reddit.com/r/Firebase/comments/12tea3a/scalable_cost_firebase_vs_supabase/)  
38. Supabase vs. Firebase: a Complete Comparison in 2025 \- Bytebase, diakses Desember 27, 2025, [https://www.bytebase.com/blog/supabase-vs-firebase/](https://www.bytebase.com/blog/supabase-vs-firebase/)  
39. Hosting and deployment | Sanity Docs, diakses Desember 27, 2025, [https://www.sanity.io/docs/studio/deployment](https://www.sanity.io/docs/studio/deployment)  
40. Pricing | Sanity, diakses Desember 27, 2025, [https://www.sanity.io/pricing](https://www.sanity.io/pricing)  
41. Contentful Free Plan Changes: What They Mean for Your Website and How to Respond, diakses Desember 27, 2025, [https://wmkagency.com/blog/contentful-free-plan-changes-what-they-mean-for-your-website-and-how-to](https://wmkagency.com/blog/contentful-free-plan-changes-what-they-mean-for-your-website-and-how-to)  
42. Best Headless CMS Options for Developers in 2026 | Top 5 Compared, diakses Desember 27, 2025, [https://prismic.io/blog/best-headless-cms-for-developers](https://prismic.io/blog/best-headless-cms-for-developers)  
43. How I Deployed Next.js to cPanel on Shared Hosting \- DEV Community, diakses Desember 27, 2025, [https://dev.to/qwadrox/how-i-deployed-nextjs-to-cpanel-on-shared-hosting-4ep2](https://dev.to/qwadrox/how-i-deployed-nextjs-to-cpanel-on-shared-hosting-4ep2)  
44. how to deploy nextJs app in cpanel · vercel next.js · Discussion \#12234 \- GitHub, diakses Desember 27, 2025, [https://github.com/vercel/next.js/discussions/12234](https://github.com/vercel/next.js/discussions/12234)  
45. Guides: Static Exports \- Next.js, diakses Desember 27, 2025, [https://nextjs.org/docs/app/guides/static-exports](https://nextjs.org/docs/app/guides/static-exports)  
46. Deploy Next.js on cPanel Hosting: Ultimate Tutorial with Troubleshooting Tips, diakses Desember 27, 2025, [https://www.nihardaily.com/96-deploy-nextjs-on-cpanel-hosting-ultimate-tutorial-with-troubleshooting-tips](https://www.nihardaily.com/96-deploy-nextjs-on-cpanel-hosting-ultimate-tutorial-with-troubleshooting-tips)  
47. How can I deploy Next js app on cpanel hosting \- Stack Overflow, diakses Desember 27, 2025, [https://stackoverflow.com/questions/56424836/how-can-i-deploy-next-js-app-on-cpanel-hosting](https://stackoverflow.com/questions/56424836/how-can-i-deploy-next-js-app-on-cpanel-hosting)  
48. Functions: generateStaticParams \- Next.js, diakses Desember 27, 2025, [https://nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)  
49. Deploying to cPanel : r/nextjs \- Reddit, diakses Desember 27, 2025, [https://www.reddit.com/r/nextjs/comments/1hw8apk/deploying\_to\_cpanel/](https://www.reddit.com/r/nextjs/comments/1hw8apk/deploying_to_cpanel/)  
50. Next.js PDF viewer with React-PDF and Nutrient SDK, diakses Desember 27, 2025, [https://www.nutrient.io/blog/how-to-build-a-nextjs-pdf-viewer/](https://www.nutrient.io/blog/how-to-build-a-nextjs-pdf-viewer/)  
51. NextJS 14 and react-pdf integration | by Ben Hur \- Medium, diakses Desember 27, 2025, [https://benhur-martins.medium.com/nextjs-14-and-react-pdf-integration-ccd38b1fd515](https://benhur-martins.medium.com/nextjs-14-and-react-pdf-integration-ccd38b1fd515)  
52. How to get pdfjs-dist working with Next.js 14 \- Stack Overflow, diakses Desember 27, 2025, [https://stackoverflow.com/questions/78121846/how-to-get-pdfjs-dist-working-with-next-js-14](https://stackoverflow.com/questions/78121846/how-to-get-pdfjs-dist-working-with-next-js-14)  
53. wojtekmaj/react-pdf: Display PDFs in your React app as easily as if they were images. \- GitHub, diakses Desember 27, 2025, [https://github.com/wojtekmaj/react-pdf](https://github.com/wojtekmaj/react-pdf)  
54. Firebase Auth with Next : r/nextjs \- Reddit, diakses Desember 27, 2025, [https://www.reddit.com/r/nextjs/comments/1eh5i8c/firebase\_auth\_with\_next/](https://www.reddit.com/r/nextjs/comments/1eh5i8c/firebase_auth_with_next/)  
55. Integrate Firebase with a Next.js app \- Google, diakses Desember 27, 2025, [https://firebase.google.com/codelabs/firebase-nextjs](https://firebase.google.com/codelabs/firebase-nextjs)  
56. Next.js Static Site Generation for Scalable Web Apps \- Shiv Technolabs, diakses Desember 27, 2025, [https://shivlab.com/blog/nextjs-static-site-generation-scalable-web-apps/](https://shivlab.com/blog/nextjs-static-site-generation-scalable-web-apps/)