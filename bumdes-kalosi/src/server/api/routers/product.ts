import { z } from 'zod'
import { ProductCategory, ReviewStatus } from '@prisma/client'
import { createTRPCRouter, publicProcedure } from '../../trpc'

// Enum untuk Zod validation
const productCategoryEnum = z.nativeEnum(ProductCategory)
const reviewStatusEnum = z.nativeEnum(ReviewStatus)

export const productRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        })
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
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

    create: publicProcedure
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
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.product.create({
                data: input,
            })
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                name: z.string().min(1).optional(),
                price: z.number().int().positive().optional(),
                promoPrice: z.number().int().positive().optional(),
                isPromo: z.boolean().optional(),
                description: z.string().optional(),
                category: productCategoryEnum.optional(),
                imageUrl: z.string().url().optional(),
                stock: z.number().int().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input
            return ctx.prisma.product.update({
                where: { id },
                data,
            })
        }),

    delete: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.product.delete({
                where: { id: input.id },
            })
        }),
})
