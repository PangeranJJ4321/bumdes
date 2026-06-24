import csv

expanded_rincians = {
    "1": "Mengikuti pembekalan materi tematik mengenai program inovasi daerah khusus di Kabupaten Sidrap. Pembekalan ini membahas pemetaan potensi daerah, masalah-masalah pembangunan lokal, serta arahan dari para fasilitator KKN untuk memastikan program kerja mahasiswa tepat sasaran dan berdampak nyata bagi masyarakat setempat.",
    "2": "Menghadiri upacara pelepasan dan pembekalan umum mahasiswa KKN Gelombang 115 secara serentak di Universitas Hasanuddin. Acara ini dihadiri oleh jajaran pimpinan universitas dan pengelola UPT KKN untuk memberikan pengarahan terkait kode etik, keselamatan, serta misi pengabdian masyarakat.",
    "3": "Melaksanakan perjalanan pemberangkatan dari titik kumpul di kampus Universitas Hasanuddin menuju lokasi posko KKN di Desa Kalosi, Kecamatan Dua Pitue, Kabupaten Sidrap. Perjalanan ini dilakukan bersama seluruh rekan posko menggunakan transportasi bus yang disediakan universitas dan tiba dengan selamat di desa tujuan.",
    "4": "Melaksanakan rapat koordinasi awal bersama Kepala Desa, Sekretaris Desa, dan seluruh jajaran pemerintah Desa Kalosi. Pertemuan ini bertujuan untuk memperkenalkan diri selaku mahasiswa KKN, mendiskusikan kondisi umum desa, potensi wilayah, serta menyepakati lokasi posko utama.",
    "5": "Melakukan pemasangan spanduk identitas KKN Universitas Hasanuddin Gelombang 115 di area luar posko. Kegiatan ini berfungsi sebagai tanda keberadaan mahasiswa KKN di Desa Kalosi sekaligus memudahkan warga desa yang ingin berkoordinasi atau mengunjungi posko.",
    "6": "Melakukan observasi lapangan langsung ke lokasi ketahanan pangan Desa Kalosi. Observasi ini berfokus pada analisis ketersediaan sumber daya pangan desa, metode pengelolaan lahan pertanian, serta peluang integrasi teknologi digital untuk meningkatkan hasil produksi.",
    "7": "Mengadakan rapat evaluasi internal bersama teman posko untuk mendiskusikan kemajuan perancangan program kerja individu. Rapat ini bertujuan untuk menyinkronkan jadwal pelaksanaan agar masing-masing program kerja tidak saling tumpang tindih.",
    "8": "Melakukan diskusi intensif bersama Sekretaris Desa Kalosi mengenai draf program kerja utama kelompok (seperti Bank Sampah) dan program kerja individu (pengembangan website BUMDes). Rapat ini menghasilkan masukan penting terkait kebutuhan promosi produk BUMDes.",
    "9": "Melanjutkan diskusi mendalam bersama Sekretaris Desa Kalosi untuk merincikan sasaran, jadwal, dan pembagian peran dalam seminar program kerja yang akan dilaksanakan di kantor desa.",
    "10": "Mempersiapkan materi presentasi dan kelengkapan dokumen pendukung untuk Seminar Program Kerja. Selain itu, kami menyebarkan undangan fisik kepada perangkat desa, tokoh adat, tokoh agama, dan perwakilan masyarakat Desa Kalosi.",
    "11": "Melaksanakan Seminar Program Kerja KKN Gelombang 115 Desa Kalosi di Aula Kantor Desa. Dalam seminar ini, penulis memaparkan rencana pembuatan website BUMDes Kalosi di hadapan pemerintah desa dan tokoh masyarakat untuk mendapatkan kritik, saran, serta persetujuan resmi.",
    "12": "Memulai tahap awal pembuatan website BUMDes dengan melakukan inisialisasi proyek Next.js, membuat repositori Git untuk pelacakan kode, serta mengonfigurasi struktur folder dasar agar pengembangan sistem berjalan rapi.",
    "13": "Melakukan perancangan antarmuka (UI/UX) dan pengodean halaman depan website BUMDes Kalosi. Fokus pengerjaan adalah membuat layout landing page yang responsif menggunakan HTML, CSS, dan Tailwind CSS agar tampil menarik saat diakses dari HP.",
    "14": "Melakukan kunjungan observasi ke lima Sekolah Dasar (SD) di sekitar desa. Kunjungan ini bertujuan untuk mengamati kondisi perpustakaan sekolah, mencatat jumlah buku, serta mendata kebutuhan media pembelajaran interaktif bagi siswa.",
    "15": "Melakukan penyesuaian navigasi menu dan mempercantik visual katalog produk pada website BUMDes. Pembenahan ini didasarkan pada hasil uji coba internal agar pengguna dapat mencari produk kuliner dan wisata dengan lebih mudah.",
    "16": "Mendampingi dan membantu rekan posko (Theo) dalam mempersiapkan materi pelajaran serta media pembelajaran visual untuk pelaksanaan program kerja mengajar bahasa Inggris.",
    "17": "Membantu dan mendampingi pelaksanaan program edukasi pengajaran bahasa Inggris dasar di SDN 5 Tanrutedong bersama rekan posko untuk meningkatkan pemahaman bahasa asing siswa.",
    "18": "Berpartisipasi aktif bergotong-royong bersama warga dalam membuat bedengan tanah di kebun percontohan desa. Bedengan ini dipersiapkan sebagai media tanam bibit cabai dalam program ketahanan pangan.",
    "19": "Mengimplementasikan fitur ulasan produk (reviews) dan tombol checkout sesuai masukan terbaru dari Sekretaris Desa Kalosi guna memudahkan pembeli memberikan ulasan langsung pada menu BUMDes.",
    "20": "Melanjutkan gotong-royong pembuatan bedengan cabai bersama dengan kepala dusun dan warga setempat untuk mempercepat kesiapan lahan perkebunan desa.",
    "21": "Mengembangkan modul login administrator menggunakan NextAuth pada website BUMDes Kalosi. Sistem keamanan ini dibuat untuk melindungi dashboard dari akses tidak sah demi menjaga kerahasiaan data pesanan.",
    "22": "Menghubungkan aplikasi web dengan database PostgreSQL menggunakan Prisma ORM. Tahap ini juga mencakup pembuatan tabel database untuk menyimpan konfigurasi sistem secara dinamis.",
    "23": "Membantu pengajaran literasi bahasa Inggris dasar bagi siswa-siswi di Madrasah Ibtidaiyah DDI Kalosi untuk mendukung program edukasi posko KKN.",
    "24": "Mengimplementasikan fungsi pengunggahan gambar produk oleh admin serta sistem pencatatan transaksi pembelian secara real-time ke dalam database sebelum diteruskan ke WhatsApp.",
    "25": "Merapikan tampilan detail produk pada katalog website BUMDes Kalosi, memastikan deskripsi, harga normal, harga promo, dan tombol tambah ke keranjang belanja tersusun presisi.",
    "26": "Melakukan perbaikan bug pada fitur keranjang belanja digital. Eror diatasi sehingga total jumlah barang dan perhitungan harga belanjaan terakumulasi secara akurat ketika ditambahkan berulang kali.",
    "27": "Mengembangkan sistem validasi formulir checkout menggunakan Zod dan React Hook Form. Sistem memastikan nama, alamat dusun, dan nomor HP pembeli terisi dengan benar sebelum diarahkan ke WhatsApp.",
    "28": "Menulis kode logika untuk menampilkan halaman profil pengguna di dashboard admin, sehingga pengelola BUMDes dapat memperbarui informasi pribadi dan kata sandi mereka.",
    "29": "Mendampingi program mengajar bahasa Inggris dasar di SDN 5 Tanrutedong untuk minggu kedua, berfokus pada pengayaan kosakata harian siswa.",
    "30": "Merapikan tata letak dashboard administrator/staf, memperbaiki responsivitas sidebar menu, serta memperjelas tombol navigasi utama untuk kemudahan operasional.",
    "31": "Membuat halaman rekap pesanan masuk dan laporan penjualan sederhana untuk admin agar pengelola BUMDes dapat memantau laporan keuangan secara mingguan atau bulanan.",
    "32": "Mengoptimalkan pembagian hak akses dashboard multi-role. Sistem dikonfigurasi agar membedakan fitur yang dapat diakses oleh peran Super Admin (kepala BUMDes) dan Staff biasa.",
    "33": "Mendampingi pelaksanaan pengajaran program belajar bahasa Inggris di SDN 12 Tanrutedong untuk minggu kedua.",
    "34": "Membantu gotong-royong program kerja kelompok berupa demo pembuatan nugget sehat bersama ibu-ibu PKK Desa Kalosi untuk meningkatkan inovasi pangan lokal.",
    "35": "Menyusun kerangka komponen dan pembagian tabel database untuk unit usaha perikanan dan tiket wisata malam Monalisa.",
    "36": "Menulis logika filter data produk agar katalog website dapat menyaring produk berdasarkan unit perikanan atau wahana wisata secara dinamis.",
    "37": "Menguji fungsi pemanggilan data database (query PostgreSQL) untuk memastikan data unit perikanan dan wisata malam terpanggil dengan cepat.",
    "38": "Merapikan visual komponen kartu produk khusus kuliner, tiket wahana, dan hasil perikanan agar terlihat serasi di halaman katalog.",
    "39": "Mengintegrasikan tombol transaksi pada unit usaha perikanan dan wahana wisata malam agar tersambung langsung dengan keranjang belanja digital.",
    "40": "Menyelesaikan seluruh rangkaian logika pemrosesan data unit khusus perikanan dan pariwisata hingga siap digunakan di server lokal.",
    "41": "Membuat halaman galeri foto dinamis di website BUMDes Kalosi. Halaman ini berfungsi untuk memamerkan foto kegiatan usaha BUMDes guna meningkatkan daya tarik bagi calon wisatawan luar.",
    "42": "Menyesuaikan tema warna global website (biru-putih) serta merapikan tipografi agar website terlihat profesional dan sesuai dengan identitas BUMDes Kalosi.",
    "43": "Mengembangkan fitur komentar pada artikel berita di website BUMDes agar pengunjung dapat memberikan tanggapan atau saran terkait program desa.",
    "44": "Membuat fitur lupa kata sandi (forgot password) yang aman bagi administrator website BUMDes dengan integrasi pengiriman tautan pemulihan sandi.",
    "45": "Mengembangkan logika pembagian order masuk pada dashboard, memungkinkan admin utama menugaskan penanganan pesanan WhatsApp ke staf yang sedang bertugas.",
    "46": "Kembali membantu pelaksanaan program belajar bahasa Inggris minggu kedua di MDDI Kalosi bersama rekan posko KKN.",
    "47": "Membantu warga dalam membentangkan dan memasang lembaran mulsa plastik pada bedengan kebun cabai percontohan desa guna menjaga kelembapan tanah.",
    "48": "Melanjutkan pemasangan mulsa plastik untuk baris bedengan berikutnya guna memastikan seluruh area kebun terlindungi dari pertumbuhan gulma.",
    "49": "Membantu menanam bibit cabai rawit ke dalam lubang mulsa bedengan perkebunan desa dalam program pengabdian ketahanan pangan posko.",
    "50": "Mendampingi rekan posko KKN dalam program mengajar bahasa Inggris minggu ketiga di SDN 6 Tanrutedong.",
    "51": "Memperbaiki desain footer di bagian bawah website BUMDes Kalosi, menyematkan kontak resmi WhatsApp BUMDes, peta lokasi desa, dan hak cipta website.",
    "52": "Membantu pengajaran bahasa Inggris dasar minggu ketiga di SDN 5 Tanrutedong bersama rekan posko.",
    "53": "Mengintegrasikan website dengan API notifikasi WhatsApp untuk mempermudah alur komunikasi pesanan antara pembeli dan admin BUMDes.",
    "54": "Mendampingi program mengajar bahasa Inggris dasar minggu ketiga di SDN 12 Tanrutedong.",
    "55": "Memasukkan 15+ data produk asli milik BUMDes Kalosi (seperti Nasi Goreng, Sarebba, ikan segar, tiket Istana Balon) lengkap dengan deskripsi dan harga riil ke database server.",
    "56": "Menginput data kredensial akun admin dan staf BUMDes ke database PostgreSQL, serta melakukan enkripsi password demi keamanan akun.",
    "57": "Membantu pengelola menyetel profil WhatsApp Business resmi BUMDes Sumber Kalosi agar terlihat profesional dan siap menerima pesanan dari website.",
    "58": "Membantu gotong-royong pendirian fisik dan sosialisasi awal program Bank Sampah kepada masyarakat Desa Kalosi dalam program kerja kelompok.",
    "59": "Mendampingi rekan posko mengajar bahasa Inggris minggu ketiga di SDN 9 Tanrutedong.",
    "60": "Membantu menyiram kebun cabai percontohan secara rutin guna memastikan bibit tanaman tumbuh dengan baik di musim kemarau.",
    "61": "Melakukan uji coba pemesanan produk secara langsung dari website BUMDes untuk memastikan format chat pemesanan terkirim secara otomatis ke WhatsApp pengelola.",
    "62": "Membantu program bimbingan belajar bahasa Inggris dasar minggu ketiga di MDDI Kalosi.",
    "63": "Kembali membantu bergotong-royong menyiram perkebunan cabai desa agar pasokan air tanaman terpenuhi.",
    "64": "Membantu program ketahanan pangan kelompok dengan melakukan penyiraman berkala pada kebun cabai percontohan.",
    "65": "Melangsungkan rapat koordinasi bersama aparat pemerintah desa Kalosi guna menyampaikan progres teknis website BUMDes yang siap diuji secara online.",
    "66": "Menambahkan fitur persetujuan pengiriman pesan WhatsApp pada halaman checkout agar transaksi mematuhi ketentuan privasi pengguna.",
    "67": "Melakukan pengujian kualitas (Quality Assurance) website BUMDes, memeriksa jika terdapat tautan yang rusak, tombol yang tidak merespons, atau kesalahan visual di browser HP.",
    "68": "Membantu penyiraman tanaman cabai di kebun ketahanan pangan desa bersama rekan posko KKN.",
    "69": "Memperbaiki tampilan sidebar berita dinamis serta menata tata letak grid foto galeri agar tampil responsif dan rapi saat dibuka warga.",
    "70": "Mengembangkan modul pembaruan konten berita di halaman kontrol admin, sehingga pengelola BUMDes dapat mengedit teks berita secara langsung.",
    "71": "Melakukan pembersihan gulma (rumput liar) di sekitar tanaman cabai serta merapikan pagar bambu kebun.",
    "72": "Rapat evaluasi akhir bersama Kepala Desa Kalosi mengenai fitur website BUMDes. Menerima masukan seperti perubahan tema warna biru-putih dan fitur kelola stok.",
    "73": "Mengambil foto asli menu kuliner di kantin BUMDes Kalosi untuk menggantikan gambar placeholder sementara di website katalog.",
    "74": "Menyewa dan mengonfigurasi Virtual Private Server (VPS) Ubuntu, menginstal Node.js, Docker, dan Nginx sebagai persiapan mempublikasikan website BUMDes ke internet.",
    "75": "Rapat koordinasi teknis bersama aparat Desa Kalosi untuk mendiskusikan tanggal penyerahan resmi website BUMDes.",
    "76": "Melakukan deployment (unggah file kode program) website BUMDes tahap pertama ke server VPS agar dapat diakses melalui alamat IP publik.",
    "77": "Mengunggah foto-foto asli produk kuliner dan wahana wisata ke dalam server produksi untuk menggantikan gambar sampel di katalog website.",
    "78": "Membantu menyiram tanaman cabai dan memperbaiki pagar pelindung kebun ketahanan pangan agar aman dari gangguan hewan ternak.",
    "79": "Membuat desain dan pesan ramah pada Halaman 404 (Halaman Tidak Ditemukan) untuk mengarahkan pengguna kembali ke halaman utama jika terjadi kesalahan tautan.",
    "80": "Mengembangkan fitur hapus ulasan pada dashboard admin agar pengelola BUMDes dapat menyaring komentar yang bersifat spam atau tidak pantas.",
    "81": "Mengoptimalkan tampilan slider halaman utama (Hero Section) dan menyederhanakan menu navigasi agar website lebih ramah pengguna.",
    "82": "Menyederhanakan alur belanja di mana proses checkout secara langsung mengalihkan pembeli ke nomor WhatsApp operator BUMDes tanpa perantara yang rumit.",
    "83": "Melakukan refactoring kode program keranjang belanja, merapikan fungsi database, serta memastikan aplikasi web berjalan stabil di server produksi.",
    "84": "Melakukan pemenuhan pembaruan kode program (update deployment) tahap kedua di server VPS untuk menyinkronkan data database PostgreSQL terbaru.",
    "85": "Mengonfigurasi web server Nginx dan menyambungkan nama domain desa resmi ke alamat IP server VPS.",
    "86": "Memasang sertifikat SSL (HTTPS) dari Let's Encrypt pada server Nginx untuk menjamin keamanan enkripsi data pengguna di website BUMDes.",
    "87": "Memasang konfigurasi Open Graph Metadata pada website agar pratinjau tautan website menampilkan foto logo BUMDes dan deskripsi yang menarik saat dibagikan.",
    "88": "Memeriksa dan melengkapi semua data produk serta ulasan di database VPS sehingga website BUMDes siap dikunjungi pembeli umum.",
    "89": "Menyusun draf formulir hilirisasi program kerja KKN sebagai laporan tertulis penyerahan teknologi tepat guna kepada masyarakat desa.",
    "90": "Mengedit tangkapan layar penggunaan website dan menyusunnya ke dalam dokumen cetak Buku Panduan Penggunaan Website (User Manual) setebal 15 halaman.",
    "91": "Menyerahkan secara resmi website BUMDes Sumber Kalosi serta berkas Buku Panduan Penggunaan Website kepada Pemerintah Desa Kalosi.",
    "92": "Menyusun artikel berita rilis publikasi mengenai selesainya pembuatan website BUMDes untuk dipasang di media massa atau papan informasi desa.",
    "93": "Mempresentasikan hasil seluruh pelaksanaan program kerja KKN Gelombang 115 di hadapan Dosen Pembimbing KKN dan perangkat pemerintah desa."
}

def main():
    rows = []
    with open('data_logbook.csv', mode='r', encoding='utf-8') as f:
        reader = list(csv.reader(f))
        header = reader[0]
        
        for row in reader[1:]:
            if not row:
                continue
            no_val = row[0].strip()
            # If we have an expanded version, use it
            if no_val in expanded_rincians:
                # Format: No, Judul, Tanggal, Rincian, Dokumentasi
                judul = row[1].strip()
                tanggal = row[2].strip()
                rincian = expanded_rincians[no_val]
                # In row, documentation is at index 3 or 4 depending on row length originally
                # Let's get the last element as documentation
                dokumentasi = row[-1].strip()
                rows.append([no_val, judul, tanggal, rincian, dokumentasi])
            else:
                rows.append(row)
                
    with open('data_logbook.csv', mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['No', 'Judul', 'Tanggal', 'Rincian', 'Dokumentasi'])
        writer.writerows(rows)
    print("CSV successfully expanded with longer descriptions.")

if __name__ == '__main__':
    main()
