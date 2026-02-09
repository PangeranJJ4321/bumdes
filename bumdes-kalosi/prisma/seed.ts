import { PrismaClient, UserRole } from '@prisma/client'
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

// Map of Product Name from CSV -> Filename Stem (without extension)
const MANUAL_MAPPING: Record<string, string> = {
    "jus buah naga": "jus bua naga",
    "mie goreng sate taichan": "mie goreng sate taichen",
    "nasi sate taichan crispy": "nasi sate taichen kripsi",
    "pisang epe topping": "pisang epe toping",
    "sanggara peppe": "sanggara pappe",
    "vanila latte": "vanila late",
    "strawberry": "strawbery",
    "teh manis": "es tea manis",
    "es teh manis": "es tea manis",
    "cappucino": "kapuchino",
    "mocaccino": "mocachino",
    "mie goreng ayam geprek": "miew goreng ayam geprek",
    "burger crispy": "burger krispy",
}

function findImageForProduct(productName: string): string | null {
    const normalize = (s: string) => s.toLowerCase().trim()
    const nameLower = normalize(productName)

    let targetStem = nameLower
    if (MANUAL_MAPPING[nameLower]) {
        targetStem = MANUAL_MAPPING[nameLower]
    }

    const searchDir = path.join(process.cwd(), 'storage-seed')

    if (!fs.existsSync(searchDir)) {
        return null
    }

    const files = fs.readdirSync(searchDir)

    for (const file of files) {
        const fileStem = path.parse(file).name.toLowerCase()
        if (fileStem === targetStem) {
            return file
        }
    }

    return null
}

async function seedMenuFromCSV(staffId: string | undefined, kulinerUnitId: string) {
    console.log('Seeding Menu from CSV...')
    const csvPath = path.join(process.cwd(), 'menu_bumdes.csv')

    if (!fs.existsSync(csvPath)) {
        console.warn('menu_bumdes.csv not found, skipping menu seeding.')
        return
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')
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

            const imageFilename = findImageForProduct(name)
            const imageUrl = imageFilename
                ? `/uploads/${imageFilename}`
                : "https://placehold.co/800x600/f97316/ffffff?text=Menu+BUMDes"

            const existing = await prisma.product.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    }
                }
            })

            const productData = {
                price,
                description,
                businessUnitId: kulinerUnitId,
                imageUrl: imageUrl,
                createdById: staffId ?? null
            }

            if (existing) {
                console.log(`Upserting menu item (update): ${name} -> ${imageUrl}`)
                await prisma.product.update({
                    where: { id: existing.id },
                    data: productData
                })
            } else {
                console.log(`Upserting menu item (create): ${name} -> ${imageUrl}`)
                await prisma.product.create({
                    data: {
                        name,
                        stock: 100,
                        isOnlineOrder: true,
                        ...productData
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

    // 0. Seed Business Units
    console.log('Seeding Business Units...')
    const UNITS = ['KULINER', 'WISATA', 'MART', 'KETAPANG', 'AGEN']
    const unitMap = new Map<string, string>() // Name -> ID

    for (const unitName of UNITS) {
        const unit = await prisma.businessUnit.upsert({
            where: { name: unitName },
            update: {},
            create: {
                name: unitName,
                description: `Unit bisnis ${unitName}`
            }
        })
        unitMap.set(unitName, unit.id)
        console.log(`Upserted unit: ${unitName}`)
    }

    // 1. Seed Users
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
            unitKey: 'WISATA'
        },
        {
            username: "staff_mart",
            email: "staff.mart@bumdes.com",
            name: "Staff Mart",
            role: UserRole.STAFF,
            unitKey: 'MART'
        },
        {
            username: "staff_kuliner",
            email: "staff.kuliner@bumdes.com",
            name: "Staff Kuliner",
            role: UserRole.STAFF,
            unitKey: 'KULINER'
        }
    ]

    const userMap = new Map<string, string>() // email -> id

    for (const user of MOCK_USERS) {
        // Explicitly handle the custom property 'unitKey' to avoid type errors
        const unitSearchKey = (user as any).unitKey;
        const unitId = unitSearchKey ? unitMap.get(unitSearchKey) : null;

        const u = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: true,
                unitId: unitId
            },
            create: {
                name: user.name,
                username: user.username,
                email: user.email,
                password: passwordHash,
                role: user.role,
                isActive: true,
                unitId: unitId
            },
        })
        userMap.set(user.email, u.id)
        console.log(`Upserted user: ${u.username} (${u.role})`)
    }

    // 2. Seed Products via CSV
    const kulinerStaffId = userMap.get("staff.kuliner@bumdes.com")
    const kulinerUnitId = unitMap.get("KULINER")

    if (kulinerUnitId) {
        await seedMenuFromCSV(kulinerStaffId, kulinerUnitId)
    } else {
        console.error('KULINER unit not found!')
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