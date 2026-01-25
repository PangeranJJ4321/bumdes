import { PrismaClient, UserRole, ProductCategory } from '@prisma/client'
import bcrypt from "bcryptjs"
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
})


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
    },
    {
        title: "Festival Kopi Kalosi 2026",
        slug: "festival-kopi-kalosi-2026",
        content: "<p>Desa Kalosi akan menggelar Festival Kopi tahunan yang menghadirkan barista terbaik...</p>",
        thumbnail: "https://placehold.co/800x400/78350f/ffffff?text=Festival+Kopi",
        author: "Admin",
        publishedAt: new Date(Date.now() - 5000000), // Recent
    },
    {
        title: "Lomba Fotografi: Pesona Desa Kalosi",
        slug: "lomba-fotografi-pesona-desa-kalosi",
        content: "<p>Ikuti lomba fotografi dengan tema keindahan alam dan budaya Desa Kalosi...</p>",
        thumbnail: "https://placehold.co/800x400/0f172a/ffffff?text=Lomba+Foto",
        author: "Admin",
        publishedAt: new Date(Date.now() - 1000000), // Very recent
    }
]

async function seedMenuFromCSV(staffId: string | undefined) {
    console.log('Seeding Menu from CSV...')
    const csvPath = path.join(process.cwd(), 'menu_bumdes.csv')

    if (!fs.existsSync(csvPath)) {
        console.warn('menu_bumdes.csv not found, skipping menu seeding.')
        return
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')
    // Skip header
    const dataLines = lines.slice(1).filter(line => line.trim() !== '')

    for (const [index, line] of dataLines.entries()) {
        try {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            const parts = trimmedLine.split(',')
            if (parts.length < 3) continue

            const categoryRaw = parts[0]
            const name = parts[1]
            const priceRaw = parts[2]
            const description = parts.slice(3).join(',')

            const price = parseInt(priceRaw)
            if (isNaN(price)) continue

            // All imported items are KULINER
            const category = ProductCategory.KULINER

            const existing = await prisma.product.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    }
                }
            })

            if (existing) {
                console.log(`Upserting menu item (update): ${name}`)
                await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        price,
                        description,
                        category,
                        createdById: staffId // Assign to Kuliner staff
                    }
                })
            } else {
                console.log(`Upserting menu item (create): ${name}`)
                await prisma.product.create({
                    data: {
                        name,
                        price,
                        description,
                        category,
                        stock: 100,
                        isOnlineOrder: true,
                        imageUrl: "https://placehold.co/800x600/f97316/ffffff?text=Menu+BUMDes",
                        createdById: staffId // Assign to Kuliner staff
                    }
                })
            }
        } catch (err) {
            console.error(`Error processing CSV line ${index}:`, err)
        }
    }
}

async function main() {
    console.log('Start seeding ...')

    // 1. Seed Users FIRST so we have IDs for products
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
        },
        {
            username: "staff_kuliner",
            email: "staff.kuliner@bumdes.com",
            name: "Staff Kuliner",
            role: UserRole.STAFF,
        }
    ]

    const userMap = new Map<string, string>() // email -> id

    for (const user of MOCK_USERS) {
        const u = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: true,
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
        userMap.set(user.email, u.id)
        console.log(`Upserted user: ${u.username} (${u.role})`)
    }

    // 2. Seed Products with Staff Assignment
    console.log('Seeding Products...')

    // Helper to get staff ID by category
    const getStaffIdForCategory = (cat: ProductCategory) => {
        switch (cat) {
            case ProductCategory.WISATA: return userMap.get("staff.wisata@bumdes.com")
            case ProductCategory.MART: return userMap.get("staff.mart@bumdes.com")
            case ProductCategory.KULINER: return userMap.get("staff.kuliner@bumdes.com")
            default: return userMap.get("admin@bumdes.com") // Fallback
        }
    }

    for (const product of MOCK_PRODUCTS) {
        const staffId = getStaffIdForCategory(product.category)

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
                createdById: staffId
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
                createdById: staffId
            },
        })
        console.log(`Upserted product: ${p.name} (Assigned to: ${staffId})`)
    }

    // 3. Seed News
    // console.log('Seeding News...')
    // for (const news of MOCK_NEWS) {
    //     // Upsert by slug
    //     const n = await prisma.news.upsert({
    //         where: { slug: news.slug },
    //         update: {
    //             title: news.title,
    //             content: news.content,
    //             thumbnail: news.thumbnail,
    //             author: news.author,
    //             publishedAt: news.publishedAt,
    //         },
    //         create: {
    //             title: news.title,
    //             slug: news.slug,
    //             content: news.content,
    //             thumbnail: news.thumbnail,
    //             author: news.author,
    //             publishedAt: news.publishedAt,
    //         },
    //     })
    //     console.log(`Upserted news: ${n.title}`)
    // }

    // 4. Seed CSV Menu (Kuliner)
    const kulinerStaffId = userMap.get("staff.kuliner@bumdes.com")
    if (kulinerStaffId) {
        await seedMenuFromCSV(kulinerStaffId)
    } else {
        console.warn('Staff Kuliner not found via map, trying DB lookup or skipping...')
        const dbUser = await prisma.user.findUnique({ where: { email: "staff.kuliner@bumdes.com" } })
        await seedMenuFromCSV(dbUser?.id)
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