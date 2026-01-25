
import { PrismaClient, ProductCategory } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding menu...')

    const csvPath = path.join(process.cwd(), 'menu_bumdes.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')

    // Skip header
    const dataLines = lines.slice(1).filter(line => line.trim() !== '')

    for (const [index, line] of dataLines.entries()) {
        try {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            // Simple split CSV
            const parts = trimmedLine.split(',')
            // Ensure we have at least 3 parts (Category, Name, Price)
            if (parts.length < 3) {
                console.warn(`Skipping invalid line ${index + 2}: ${trimmedLine}`)
                continue
            }

            const categoryRaw = parts[0]
            const name = parts[1]
            const priceRaw = parts[2]
            // Description might be the rest joined back if it contained commas
            const description = parts.slice(3).join(',')

            if (!name) continue;

            const price = parseInt(priceRaw)
            if (isNaN(price)) {
                console.warn(`Invalid price for ${name}: ${priceRaw}`)
                continue
            }

            // Map CSV Category to Prisma Enum
            // All these are KULINER based on the images provided (Food & Drink menu)
            const category = ProductCategory.KULINER

            console.log(`Processing: ${name}`)

            // Check if exists
            const existing = await prisma.product.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    }
                }
            })

            if (existing) {
                console.log(`  - Found existing, updating...`)
                await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        price,
                        description,
                        category,
                        // valid stock logic: if it was 0 maybe update, but let's keep it simple
                    }
                })
            } else {
                console.log(`  - Creating new...`)
                await prisma.product.create({
                    data: {
                        name,
                        price,
                        description,
                        category,
                        stock: 100, // Default stock
                        isOnlineOrder: true,
                        imageUrl: "https://placehold.co/800x600/f97316/ffffff?text=Menu+BUMDes"
                    }
                })
            }
        } catch (err) {
            console.error(`Error processing line ${index + 2}:`, err)
        }
    }

    console.log('Seeding menu finished.')
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
