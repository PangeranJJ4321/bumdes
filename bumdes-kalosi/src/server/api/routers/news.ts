
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const newsRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(6),
                cursor: z.string().optional(), // For infinite query support if needed later, using ID/Date
                skip: z.number().optional(), // For simple pagination
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { limit, skip, search } = input

            const where = search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' as const } },
                        { content: { contains: search, mode: 'insensitive' as const } },
                    ]
                }
                : {}

            const [items, total] = await Promise.all([
                ctx.prisma.news.findMany({
                    where,
                    take: limit,
                    skip: skip,
                    orderBy: { publishedAt: 'desc' },
                }),
                ctx.prisma.news.count({ where }),
            ])

            return {
                items,
                total,
                hasNextPage: skip ? (skip + limit < total) : false // Simplified check
            }
        }),

    getRecent: publicProcedure
        .input(z.number().min(1).default(5))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.news.findMany({
                take: input,
                orderBy: { publishedAt: 'desc' },
            })
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.news.findUnique({
                where: { slug: input.slug },
            })
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.news.findUnique({
                where: { id: input.id },
            })
        }),

    // Admin Management Procedures
    create: protectedProcedure
        .input(z.object({
            title: z.string().min(1),
            content: z.string().min(1),
            thumbnail: z.string().optional(),
            author: z.string().default("Admin"),
        }))
        .mutation(async ({ ctx, input }) => {
            // Auto generate slug from title
            const slug = input.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

            return ctx.prisma.news.create({
                data: {
                    ...input,
                    slug,
                }
            })
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            title: z.string().min(1).optional(),
            content: z.string().min(1).optional(),
            thumbnail: z.string().optional(),
            author: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // If title is updated, should we update slug?
            // Usually simpler not to, to preserve SEO links, or make it optional.
            // For now, we won't auto-update slug on edit unless explicitly requested,
            // but we'll stick to simple content updates.

            return ctx.prisma.news.update({
                where: { id },
                data,
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.news.delete({
                where: { id: input.id },
            })
        }),
})
