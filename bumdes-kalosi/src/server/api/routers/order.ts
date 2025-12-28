import { z } from 'zod'
import { OrderStatus } from '@prisma/client'
import { createTRPCRouter, publicProcedure } from '../../trpc'

const orderStatusEnum = z.nativeEnum(OrderStatus)

export const orderRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.order.findMany({
      include: {
        itemsDetail: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: {
          itemsDetail: {
            include: {
              product: true,
            },
          },
        },
      })
    }),

  getByStatus: publicProcedure
    .input(z.object({ status: orderStatusEnum }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: { status: input.status },
        include: {
          itemsDetail: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(1),
        customerAddress: z.string().min(1),
        customerPhone: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive(),
            price: z.number().int().positive(),
          })
        ),
        totalPrice: z.number().int().positive(),
        notes: z.string().optional(),
        whatsappUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { items, ...orderData } = input

      // Create order with items snapshot as JSON
      const order = await ctx.prisma.order.create({
        data: {
          ...orderData,
          items: items as unknown as object, // Store as JSON snapshot
          itemsDetail: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          itemsDetail: {
            include: {
              product: true,
            },
          },
        },
      })

      return order
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: orderStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.delete({
        where: { id: input.id },
      })
    }),
})

