import { z } from 'zod'
import { ReviewStatus } from '@prisma/client'
import { createTRPCRouter, publicProcedure } from '../../trpc'

const reviewStatusEnum = z.nativeEnum(ReviewStatus)

export const reviewRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.review.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getByProductId: publicProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.review.findMany({
        where: {
          productId: input.productId,
          status: ReviewStatus.APPROVED, // Only show approved reviews
        },
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  getPending: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.review.findMany({
      where: { status: ReviewStatus.PENDING },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  create: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().optional(),
        authorName: z.string().default('Anonymous'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.review.create({
        data: {
          ...input,
          status: ReviewStatus.PENDING, // Default to pending, admin must approve
        },
        include: {
          product: true,
        },
      })
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: reviewStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.review.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          product: true,
        },
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.review.delete({
        where: { id: input.id },
      })
    }),
})

