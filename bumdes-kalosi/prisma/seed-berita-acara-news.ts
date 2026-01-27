import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Updating Berita Acara to Standard News Format...')

    const slug = 'sosialisasi-pelatihan-website-bumdes-kalosi-2026'

    // Clean news format without heavy styling
    const content = `
    <p><strong>KALOSI</strong> – Badan Usaha Milik Desa (BUMDes) "Kalosi" kini resmi memiliki platform digital baru. Pada hari Senin, 26 Januari 2026, telah dilaksanakan kegiatan sosialisasi sekaligus pelatihan penggunaan website yang bertempat di Kantor BUMDes Kalosi.</p>
    
    <p>Kegiatan ini dihadiri langsung oleh segenap pengurus BUMDes, mulai dari Direktur, Sekretaris, Bendahara, hingga staf unit usaha. Acara yang dipandu oleh Tim Pengembang (Mahasiswa KKN) ini bertujuan untuk memastikan seluruh pengelola paham cara mengoperasikan sistem baru tersebut.</p>

    <h3>Tujuan Digitalisasi</h3>
    <p>Peluncuran website ini merupakan langkah strategis untuk memperluas jangkauan pasar produk-produk unggulan Desa Kalosi. Dengan adanya fitur katalog online, masyarakat kini dapat dengan mudah melihat produk yang tersedia, mulai dari kuliner, hasil tani, hingga paket wisata.</p>

    <h3>Materi Pelatihan</h3>
    <p>Dalam sesi pelatihan, para pengurus diperkenalkan dengan berbagai fitur utama website, antara lain:</p>
    <ul>
        <li>Cara mengupload dan mengupdate data produk.</li>
        <li>Manajemen pesanan yang masuk dari pelanggan.</li>
        <li>Pembuatan artikel berita untuk publikasi kegiatan desa.</li>
        <li>Pengaturan profil dan informasi layanan BUMDes.</li>
    </ul>

    <p>Antusiasme peserta terlihat saat sesi uji coba langsung (hands-on). Para staf unit usaha mencoba melakukan simulasi transaksi dan pengelolaan stok barang melalui Dashboard Admin yang telah disediakan.</p>

    <h3>Harapan Kedepan</h3>
    <p>Direktur BUMDes Kalosi menyambut baik inisiatif ini. "Kami berharap website ini tidak hanya jadi pajangan, tapi benar-benar bisa meningkatkan omzet dan mempermudah warga," ujarnya.</p>

    <p>Kegiatan ditutup dengan sesi foto bersama dan serah terima akun admin secara simbolis, menandai dimulainya era baru digitalisasi BUMDes Kalosi.</p>
  `

    // Upsert with the new slug and content
    await prisma.news.upsert({
        where: { slug },
        update: {
            title: "Sosialisasi dan Pelatihan Website BUMDes Kalosi Berjalan Lancar",
            content,
            thumbnail: "https://placehold.co/800x400/1e293b/ffffff?text=Sosialisasi+BUMDes",
            author: "Admin",
            publishedAt: new Date(),
        },
        create: {
            title: "Sosialisasi dan Pelatihan Website BUMDes Kalosi Berjalan Lancar",
            slug,
            content,
            thumbnail: "https://placehold.co/800x400/1e293b/ffffff?text=Sosialisasi+BUMDes",
            author: "Admin",
            publishedAt: new Date(),
        }
    })

    // Optionally delete the old formal one if the slug was different, but keeping it is fine or user can delete manually.
    // I will just add this new one as the primary requested "News" version.

    console.log('Standard News format inserted successfully!')
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
