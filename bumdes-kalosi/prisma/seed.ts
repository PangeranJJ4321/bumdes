
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import dotenv from "dotenv"

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
        category: "KULINER",
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
        category: "KULINER",
        imageUrl: "https://placehold.co/800x600/c2410c/ffffff?text=Sarebba",
        isPromo: false,
        stock: 100
    },
    {
        id: "3",
        name: "Tiket Istana Balon",
        description: "Tiket masuk wahana bermain anak Istana Balon sepuasnya.",
        price: 10000,
        category: "WISATA",
        imageUrl: "https://placehold.co/800x600/4f46e5/ffffff?text=Istana+Balon",
        isPromo: false,
        stock: 999
    },
    {
        id: "4",
        name: "Sewa Mobil Listrik",
        description: "Keliling area wisata dengan mobil listrik ramah lingkungan. Durasi 15 menit.",
        price: 15000,
        category: "WISATA",
        imageUrl: "https://placehold.co/800x600/3730a3/ffffff?text=Mobil+Listrik",
        isPromo: false,
        stock: 5
    },
    {
        id: "5",
        name: "Minyak Goreng 2L",
        description: "Minyak goreng kemasan premium 2 liter.",
        price: 35000,
        category: "MART",
        imageUrl: "https://placehold.co/800x600/10b981/ffffff?text=Minyak+Goreng",
        isPromo: false,
        stock: 20
    },
    {
        id: "6",
        name: "Gas LPG 3kg",
        description: "Tabung gas melon 3kg untuk kebutuhan rumah tangga.",
        price: 22000,
        category: "AGEN",
        imageUrl: "https://placehold.co/800x600/059669/ffffff?text=Gas+LPG",
        isPromo: false,
        stock: 10
    },
    {
        id: "7",
        name: "Ikan Mas Segar (1kg)",
        description: "Ikan mas segar langsung dari kolam ketapang warga.",
        price: 40000,
        category: "KETAPANG", /* Mapped from 'Perikanan' to 'KETAPANG' enum */
        imageUrl: "https://placehold.co/800x600/0ea5e9/ffffff?text=Ikan+Mas",
        isPromo: false,
        stock: 15
    }
]

async function main() {
    console.log('Start seeding ...')

    const categoryMap: Record<string, any> = {
        "Kuliner": "KULINER",
        "Wisata": "WISATA",
        "Mart": "MART",
        "Agen": "AGEN",
        "Perikanan": "KETAPANG"
    };

    for (const product of MOCK_PRODUCTS) {
        const dbCategory = categoryMap[product.category] || "KULINER";

        const p = await prisma.product.upsert({
            where: { id: product.id },
            update: {
                stock: product.stock,
                category: dbCategory,
            },
            create: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: dbCategory,
                imageUrl: product.imageUrl,
                isPromo: product.isPromo,
                promoPrice: product.promoPrice,
                stock: product.stock,
            },
        })
        console.log(`Upserted product with id: ${p.id}`)
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
