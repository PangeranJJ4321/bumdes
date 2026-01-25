import { z } from 'zod'
import { ProductCategory, ReviewStatus } from '@prisma/client'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

// Enum untuk Zod validation
const productCategoryEnum = z.nativeEnum(ProductCategory)
const reviewStatusEnum = z.nativeEnum(ReviewStatus)

export const productRouter = createTRPCRouter({
    getInfinite: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).default(12),
                cursor: z.string().nullish(), // itemId (not index)
                category: z.string().optional(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { limit, cursor, category, search } = input
            const where: any = {}

            // Category Filter
            if (category && category !== "ALL") {
                where.category = category as ProductCategory
            }

            // Search Filter
            if (search) {
                where.name = {
                    contains: search,
                    mode: 'insensitive' // Requires Prisma Preview Feature "fullTextSearch" or generic simple filtering
                }
            }

            const items = await ctx.prisma.product.findMany({
                take: limit + 1, // Get 1 extra to know if there's next page
                cursor: cursor ? { id: cursor } : undefined,
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                }
            })

            let nextCursor: typeof cursor | undefined = undefined
            if (items.length > limit) {
                const nextItem = items.pop() // Remove extra item
                nextCursor = nextItem?.id
            }

            return {
                items,
                nextCursor,
            }
        }),

    getCategories: publicProcedure.query(async ({ ctx }) => {
        const groups = await ctx.prisma.product.groupBy({
            by: ['category'],
            _count: {
                id: true
            }
        })

        return groups.map(g => ({
            category: g.category,
            count: g._count.id
        }))
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        })
    }),

    getDashboardProducts: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user
        const where: any = {}

        if (user.role === 'STAFF') {
            // Filter by ownership if createdById exists, or fallback to unit if legacy
            if (user.unit) {
                where.OR = [
                    { createdById: user.id },
                    { category: user.unit, createdById: null } // Fallback for old products
                ]
            } else {
                where.createdById = user.id
            }
        }

        return ctx.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        })
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.product.findUnique({
                where: { id: input.id },
                include: {
                    reviews: {
                        where: { status: ReviewStatus.APPROVED },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            })
        }),

    getByCategory: publicProcedure
        .input(z.object({ category: productCategoryEnum }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.product.findMany({
                where: { category: input.category },
                orderBy: { createdAt: 'desc' },
            })
        }),

    getServices: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany({
            where: {
                category: {
                    in: [ProductCategory.WISATA]
                }
            },
            orderBy: { createdAt: 'desc' },
        })
    }),

    getProductsGroup: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany({
            where: {
                category: {
                    in: [
                        ProductCategory.MART,
                        ProductCategory.KULINER,
                        ProductCategory.AGEN,
                        ProductCategory.KETAPANG
                    ]
                }
            },
            orderBy: { createdAt: 'desc' },
        })
    }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                price: z.number().int().positive(),
                promoPrice: z.number().int().positive().optional(),
                isPromo: z.boolean().default(false),
                description: z.string().optional(),
                category: productCategoryEnum,
                imageUrl: z.string().url().optional(),
                stock: z.number().int().optional(),
                isOnlineOrder: z.boolean().default(true),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user

            if (user.role === 'STAFF' && user.unit) {
                if (input.category !== user.unit) {
                    throw new Error("Anda tidak memiliki izin untuk membuat produk di kategori ini.")
                }
            }

            return ctx.prisma.product.create({
                data: {
                    ...input,
                    createdById: user.id, // Assign owner
                },
            })
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                price: z.number().int().positive().optional(),
                promoPrice: z.number().int().positive().optional(),
                isPromo: z.boolean().optional(),
                description: z.string().optional(),
                category: productCategoryEnum.optional(),
                imageUrl: z.string().url().optional(),
                stock: z.number().int().optional(),
                isOnlineOrder: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input
            const user = ctx.session.user

            // Check permission
            if (user.role === 'STAFF') {
                const product = await ctx.prisma.product.findUnique({ where: { id } })

                if (!product) {
                    throw new Error("Produk tidak ditemukan.")
                }

                // Check ownership or unit fallback
                const isOwner = product.createdById === user.id
                const isUnitMatch = user.unit && product.category === user.unit && product.createdById === null

                if (!isOwner && !isUnitMatch) {
                    throw new Error("Anda tidak memiliki izin untuk mengedit produk ini.")
                }

                if (data.category && user.unit && data.category !== user.unit) {
                    throw new Error("Anda tidak bisa mengubah kategori produk ke luar unit anda.")
                }
            }

            return ctx.prisma.product.update({
                where: { id },
                data,
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user
            if (user.role === 'STAFF') {
                const product = await ctx.prisma.product.findUnique({ where: { id: input.id } })

                if (!product) return // Already deleted/not found

                const isOwner = product.createdById === user.id
                const isUnitMatch = user.unit && product.category === user.unit && product.createdById === null

                if (!isOwner && !isUnitMatch) {
                    throw new Error("Anda tidak memiliki izin untuk menghapus produk ini.")
                }
            }
            return ctx.prisma.product.delete({
                where: { id: input.id },
            })
        }),
})
