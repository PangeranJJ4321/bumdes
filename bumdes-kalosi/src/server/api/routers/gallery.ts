
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const galleryRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(50),
                cursor: z.string().optional(),
                skip: z.number().optional(),
                category: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 50;
            const skip = input?.skip;
            const category = input?.category;

            const where = category ? { category } : {};

            const [items, total] = await Promise.all([
                ctx.prisma.gallery.findMany({
                    where,
                    take: limit,
                    skip: skip,
                    orderBy: { createdAt: 'desc' },
                }),
                ctx.prisma.gallery.count({ where }),
            ])

            return {
                items,
                total,
                hasNextPage: skip ? (skip + limit < total) : false
            }
        }),

    create: protectedProcedure
        .input(z.object({
            title: z.string().min(1),
            description: z.string().optional(),
            imageUrl: z.string().url(),
            category: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.gallery.create({
                data: input,
            })
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            title: z.string().min(1).optional(),
            description: z.string().optional(),
            imageUrl: z.string().url().optional(),
            category: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.prisma.gallery.update({
                where: { id },
                data,
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.gallery.delete({
                where: { id: input.id },
            })
        }),
})
