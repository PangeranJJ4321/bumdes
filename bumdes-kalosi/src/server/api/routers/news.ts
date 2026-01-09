
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../../trpc'

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

    // Admin Management Procedures
    create: publicProcedure // TODO: Protected procedure for admin
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
})
