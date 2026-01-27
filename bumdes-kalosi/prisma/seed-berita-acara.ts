import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding Berita Acara...')

    const slug = 'berita-acara-sosialisasi-website-jan-2026'

    const content = `
<div style="font-family: serif; line-height: 1.6; color: black;">
    <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid black; padding-bottom: 1rem;">
        <h3 style="margin: 0; font-weight: bold; text-transform: uppercase;">PEMERINTAH DESA KALOSI</h3>
        <h2 style="margin: 0; font-weight: bold; text-transform: uppercase;">BADAN USAHA MILIK DESA (BUMDES) “KALOSI”</h2>
        <p style="margin: 0; font-style: italic;">Alamat: Jl. Poros Kalosi, Desa Kalosi, Kec. Alla, Kab. Enrekang</p>
    </div>

    <div style="text-align: center; margin-bottom: 2rem;">
        <h3 style="margin: 0; font-weight: bold; text-decoration: underline;">BERITA ACARA</h3>
        <h4 style="margin: 0; font-weight: bold;">SOSIALISASI DAN PELATIHAN PENGGUNAAN WEBSITE BUMDES KALOSI</h4>
        <p style="margin-top: 5px;">Nomor: 001/BA-SOS/BUMDES/I/2026</p>
    </div>

    <p>Pada hari ini, <strong>Senin</strong>, tanggal <strong>26</strong> bulan <strong>Januari</strong> tahun <strong>2026</strong>, bertempat di Kantor BUMDes Kalosi, telah dilaksanakan kegiatan <strong>Sosialisasi dan Pelatihan Penggunaan Website BUMDes Kalosi</strong> sebagai bagian dari program digitalisasi usaha desa.</p>

    <p>Kegiatan ini dilaksanakan oleh dan antara:</p>

    <ol style="list-style-type: decimal; margin-left: 20px;">
        <li style="margin-bottom: 10px;">
            <strong>PIHAK PERTAMA (Narasumber/Pengembang)</strong><br>
            Nama: Tim Pengembang Website<br>
            Jabatan: Mahasiswa KKN / Tim Teknis<br>
            Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
        </li>
        <li>
            <strong>PIHAK KEDUA (Peserta/User BUMDes)</strong><br>
            Nama: Pengurus BUMDes Kalosi<br>
            Jabatan: Pengelola Unit Usaha<br>
            Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
        </li>
    </ol>

    <hr style="margin: 20px 0;">

    <p><strong>URAIAN KEGIATAN:</strong></p>
    <p>Dalam kegiatan ini, telah dilakukan serangkaian agenda sebagai berikut:</p>

    <ol type="I" style="margin-left: 20px;">
        <li style="margin-bottom: 10px;">
            <strong>PEMAPARAN FITUR WEBSITE</strong><br>
            PIHAK PERTAMA menyampaikan penjelasan mengenai fitur-fitur yang terdapat pada website BUMDes Kalosi, yang meliputi: Halaman Publik (Beranda, Profil, Katalog), Sistem Transaksi Pemesanan, dan Halaman Admin (Dashboard Management).
        </li>
        <li style="margin-bottom: 10px;">
            <strong>PELATIHAN/DEMONSTRASI (HANDS-ON)</strong><br>
            PIHAK KEDUA telah melakukan uji coba langsung di bawah bimbingan PIHAK PERTAMA, meliputi: Login Dashboard, Manajemen Produk, Publikasi Berita, dan Simulasi Pesanan.
        </li>
        <li>
            <strong>HASIL KEGIATAN</strong><br>
            Disepakati bahwa Website telah berfungsi dengan baik dan PIHAK KEDUA memahami cara pengoperasiannya. Akun Admin telah diserahterimakan.
        </li>
    </ol>

    <p>Demikian Berita Acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>

    <br>
    <p>Ditetapkan di: <strong>Kalosi</strong><br>Tanggal: <strong>26 Januari 2026</strong></p>

    <table style="width: 100%; margin-top: 50px;">
        <tr>
            <td style="width: 50%; text-align: center;">
                <strong>PIHAK PERTAMA</strong><br>
                (Pengembang)<br><br><br><br>
                <strong>( Tim Pengembang )</strong>
            </td>
            <td style="width: 50%; text-align: center;">
                <strong>PIHAK KEDUA</strong><br>
                (Penerima/BUMDes)<br><br><br><br>
                <strong>( Direktur BUMDes )</strong>
            </td>
        </tr>
    </table>
</div>
  `

    await prisma.news.upsert({
        where: { slug },
        update: {
            content,
            title: "Berita Acara Sosialisasi Website",
            thumbnail: "https://placehold.co/800x400/1e293b/ffffff?text=Berita+Acara",
            author: "Admin Sistem"
        },
        create: {
            title: "Berita Acara Sosialisasi Website",
            slug,
            content,
            thumbnail: "https://placehold.co/800x400/1e293b/ffffff?text=Berita+Acara",
            author: "Admin Sistem",
            publishedAt: new Date(),
        }
    })

    console.log('Berita Acara inserted successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
