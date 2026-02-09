import { z } from 'zod'
import { ReviewStatus } from '@prisma/client'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

const reviewStatusEnum = z.nativeEnum(ReviewStatus)

export const productRouter = createTRPCRouter({
    getInfinite: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).default(12),
                cursor: z.string().nullish(), // itemId (not index)
                businessUnitId: z.string().optional(),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { limit, cursor, businessUnitId, search } = input
            const where: any = {}

            // Unit Filter
            if (businessUnitId && businessUnitId !== "ALL") {
                where.businessUnitId = businessUnitId
            }

            // Search Filter
            if (search) {
                where.name = {
                    contains: search,
                    mode: 'insensitive'
                }
            }

            const items = await ctx.prisma.product.findMany({
                take: limit + 1, // Get 1 extra to know if there's next page
                cursor: cursor ? { id: cursor } : undefined,
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    businessUnit: true,
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

    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                businessUnit: true,
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
            // Filter by ownership if createdById exists, or fallback to unit
            if (user.unitId) {
                where.OR = [
                    { createdById: user.id },
                    { businessUnitId: user.unitId }
                ]
            } else {
                where.createdById = user.id
            }
        }

        return ctx.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                businessUnit: true,
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
                    businessUnit: true,
                    reviews: {
                        where: { status: ReviewStatus.APPROVED },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            })
        }),

    // Legacy support or new implementation matching businessUnit name?
    // For now we use getInfinite with businessUnitId from frontend

    getServices: publicProcedure.query(async ({ ctx }) => {
        // Assuming 'Wisata' is a business unit name. 
        // We should ideally look up the ID first or join.
        // For efficiency, let's find the unit first.
        const wisataUnit = await ctx.prisma.businessUnit.findFirst({
            where: { name: { contains: 'Wisata', mode: 'insensitive' } }
        });

        if (!wisataUnit) return [];

        return ctx.prisma.product.findMany({
            where: {
                businessUnitId: wisataUnit.id
            },
            orderBy: { createdAt: 'desc' },
            include: { businessUnit: true }
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
                businessUnitId: z.string().min(1),
                imageUrl: z.string().url().optional(),
                stock: z.number().int().optional(),
                isOnlineOrder: z.boolean().default(true),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user

            if (user.role === 'STAFF' && user.unitId) {
                if (input.businessUnitId !== user.unitId) {
                    throw new Error("Anda tidak memiliki izin untuk membuat produk di unit ini.")
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
                businessUnitId: z.string().optional(),
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

                // Check ownership or unit match
                const isOwner = product.createdById === user.id
                const isUnitMatch = user.unitId && product.businessUnitId === user.unitId

                if (!isOwner && !isUnitMatch) {
                    throw new Error("Anda tidak memiliki izin untuk mengedit produk ini.")
                }

                if (data.businessUnitId && user.unitId && data.businessUnitId !== user.unitId) {
                    throw new Error("Anda tidak bisa mengubah unit produk ke luar unit anda.")
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
                const isUnitMatch = user.unitId && product.businessUnitId === user.unitId

                if (!isOwner && !isUnitMatch) {
                    throw new Error("Anda tidak memiliki izin untuk menghapus produk ini.")
                }
            }
            return ctx.prisma.product.delete({
                where: { id: input.id },
            })
        }),
})
