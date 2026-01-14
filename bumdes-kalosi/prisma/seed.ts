
import { PrismaClient, UserRole, ProductCategory } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const MOCK_PRODUCTS = [
    {
        id: "1",
        name: "Nasi Goreng Spesial Kalosi",
        description: "Nasi goreng dengan bumbu rahasia khas desa, disajikan dengan telur mata sapi dan kerupuk.",
        price: 15000,
        category: ProductCategory.KULINER,
        imageUrl: "https://placehold.co/800x600/f97316/ffffff?text=Nasi+Goreng",
        isPromo: true,
        promoPrice: 12000,
        stock: 50
    },
    {
        id: "2",
        name: "Sarebba Hangat",
        description: "Minuman tradisional jahe merah dengan gula aren asli.",
        price: 8000,
        category: ProductCategory.KULINER,
        imageUrl: "https://placehold.co/800x600/c2410c/ffffff?text=Sarebba",
        isPromo: false,
        stock: 100
    },
    {
        id: "3",
        name: "Tiket Istana Balon",
        description: "Tiket masuk wahana bermain anak Istana Balon sepuasnya.",
        price: 10000,
        category: ProductCategory.WISATA,
        imageUrl: "https://placehold.co/800x600/4f46e5/ffffff?text=Istana+Balon",
        isPromo: false,
        stock: 999
    },
    {
        id: "4",
        name: "Sewa Mobil Listrik",
        description: "Keliling area wisata dengan mobil listrik ramah lingkungan. Durasi 15 menit.",
        price: 15000,
        category: ProductCategory.WISATA,
        imageUrl: "https://placehold.co/800x600/3730a3/ffffff?text=Mobil+Listrik",
        isPromo: false,
        stock: 5
    },
    {
        id: "5",
        name: "Minyak Goreng 2L",
        description: "Minyak goreng kemasan premium 2 liter.",
        price: 35000,
        category: ProductCategory.MART,
        imageUrl: "https://placehold.co/800x600/10b981/ffffff?text=Minyak+Goreng",
        isPromo: false,
        stock: 20
    },
    {
        id: "6",
        name: "Gas LPG 3kg",
        description: "Tabung gas melon 3kg untuk kebutuhan rumah tangga.",
        price: 22000,
        category: ProductCategory.AGEN,
        imageUrl: "https://placehold.co/800x600/059669/ffffff?text=Gas+LPG",
        isPromo: false,
        stock: 10
    },
    {
        id: "7",
        name: "Ikan Mas Segar (1kg)",
        description: "Ikan mas segar langsung dari kolam ketapang warga.",
        price: 40000,
        category: ProductCategory.KETAPANG,
        imageUrl: "https://placehold.co/800x600/0ea5e9/ffffff?text=Ikan+Mas",
        isPromo: false,
        stock: 15
    },
    {
        id: "8",
        name: "Keripik Pisang Original",
        description: "Cemilan keripik pisang renyah khas desa, tanpa pengawet.",
        price: 12000,
        category: ProductCategory.KULINER,
        imageUrl: "https://placehold.co/800x600/fbbf24/ffffff?text=Keripik+Pisang",
        isPromo: false,
        stock: 30
    },
    {
        id: "9",
        name: "Paket Edukasi Tani",
        description: "Paket belajar bertani untuk anak sekolah, termasuk bibit dan pendampingan.",
        price: 50000,
        category: ProductCategory.WISATA,
        imageUrl: "https://placehold.co/800x600/65a30d/ffffff?text=Wisata+Edukasi",
        isPromo: true,
        promoPrice: 45000,
        stock: 50
    },
    {
        id: "10",
        name: "Beras Premium 5kg",
        description: "Beras putih pulen kualitas premium hasil panen lokal.",
        price: 75000,
        category: ProductCategory.MART,
        imageUrl: "https://placehold.co/800x600/e2e8f0/000000?text=Beras+5kg",
        isPromo: false,
        stock: 40
    }
]

const MOCK_NEWS = [
    {
        title: "BUMDes Kalosi Resmikan Unit Usaha Baru",
        slug: "bumdes-kalosi-resmikan-unit-usaha-baru",
        content: "<p>BUMDes Kalosi terus berinovasi dengan meluncurkan unit usaha baru di sektor pariwisata...</p>",
        thumbnail: "https://placehold.co/800x400/2563eb/ffffff?text=Peresmian+BUMDes",
        author: "Admin",
        publishedAt: new Date(),
    },
    {
        title: "Peningkatan Layanan Wisata Desa",
        slug: "peningkatan-layanan-wisata-desa",
        content: "<p>Wisata desa kini dilengkapi dengan fasilitas baru berupa mobil listrik dan area bermain anak...</p>",
        thumbnail: "https://placehold.co/800x400/16a34a/ffffff?text=Wisata+Desa",
        author: "Admin",
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
        title: "Program Ketapang: Panen Raya Ikan Mas",
        slug: "program-ketapang-panen-raya-ikan-mas",
        content: "<p>Masyarakat desa menyambut gembira panen raya ikan mas dari program ketahanan pangan...</p>",
        thumbnail: "https://placehold.co/800x400/0891b2/ffffff?text=Panen+Raya",
        author: "Staff",
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
        title: "Jadwal Operasional Selama Hari Raya",
        slug: "jadwal-operasional-selama-hari-raya",
        content: "<p>Berikut adalah jadwal operasional unit usaha BUMDes selama libur Hari Raya...</p>",
        thumbnail: "https://placehold.co/800x400/db2777/ffffff?text=Info+Operasional",
        author: "Admin",
        publishedAt: new Date(Date.now() - 259200000), // 3 days ago
    },
    {
        title: "Pelatihan Digital Marketing untuk UMKM",
        slug: "pelatihan-digital-marketing-umkm",
        content: "<p>BUMDes bekerjasama dengan mahasiswa KKN mengadakan pelatihan pemasaran digital...</p>",
        thumbnail: "https://placehold.co/800x400/9333ea/ffffff?text=Pelatihan+UMKM",
        author: "Admin",
        publishedAt: new Date(Date.now() - 345600000), // 4 days ago
    }
]

async function main() {
    console.log('Start seeding ...')

    // 1. Seed Products
    console.log('Seeding Products...')
    for (const product of MOCK_PRODUCTS) {
        const p = await prisma.product.upsert({
            where: { id: product.id },
            update: {
                stock: product.stock,
                category: product.category,
                price: product.price,
                promoPrice: product.promoPrice,
                isPromo: product.isPromo,
                imageUrl: product.imageUrl,
                name: product.name,
                description: product.description,
            },
            create: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                imageUrl: product.imageUrl,
                isPromo: product.isPromo,
                promoPrice: product.promoPrice,
                stock: product.stock,
            },
        })
        console.log(`Upserted product: ${p.name}`)
    }

    // 2. Seed News
    console.log('Seeding News...')
    for (const news of MOCK_NEWS) {
        // Upsert by slug
        const n = await prisma.news.upsert({
            where: { slug: news.slug },
            update: {
                title: news.title,
                content: news.content,
                thumbnail: news.thumbnail,
                author: news.author,
                publishedAt: news.publishedAt,
            },
            create: {
                title: news.title,
                slug: news.slug,
                content: news.content,
                thumbnail: news.thumbnail,
                author: news.author,
                publishedAt: news.publishedAt,
            },
        })
        console.log(`Upserted news: ${n.title}`)
    }

    // 3. Seed Users
    console.log('Seeding Users...')
    const passwordHash = await bcrypt.hash('password123', 10)

    const MOCK_USERS = [
        {
            username: "admin",
            email: "admin@bumdes.com",
            name: "Super Admin",
            role: UserRole.SUPER_ADMIN,
        },
        {
            username: "staff_wisata",
            email: "staff.wisata@bumdes.com",
            name: "Staff Wisata",
            role: UserRole.STAFF,
        },
        {
            username: "staff_mart",
            email: "staff.mart@bumdes.com",
            name: "Staff Mart",
            role: UserRole.STAFF,
        }
    ]

    for (const user of MOCK_USERS) {
        const u = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: true,
                // Do not update password if user exists to avoid overwriting changed passwords
            },
            create: {
                name: user.name,
                username: user.username,
                email: user.email,
                password: passwordHash,
                role: user.role,
                isActive: true,
            },
        })
        console.log(`Upserted user: ${u.username} (${u.role})`)
    }

    console.log('Seeding finished.')
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
