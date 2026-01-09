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
      orderBy: { created_at: 'desc' },
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
        orderBy: { created_at: 'desc' },
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

      // 1. Fetch Products to get Names for WhatsApp Message
      const productIds = items.map((i) => i.productId)
      const products = await ctx.prisma.product.findMany({
        where: { id: { in: productIds } }
      })

      const productMap = new Map(products.map(p => [p.id, p]))

      // 2. Construct WhatsApp Message
      let message = `Halo Admin BUMDes Kalosi 👋%0ASaya ingin memesan:%0A%0A`

      items.forEach((item, index) => {
        const product = productMap.get(item.productId)
        const productName = product ? product.name : 'Unknown Product'
        message += `${index + 1}. ${productName} (x${item.quantity}) - Rp ${item.price.toLocaleString('id-ID')}%0A`
      })

      message += `%0ATotal: Rp ${input.totalPrice.toLocaleString('id-ID')}%0A`
      message += `%0AAtas Nama: ${input.customerName}%0A`
      message += `Alamat: ${input.customerAddress}%0A`
      if (input.notes) message += `Catatan: ${input.notes}%0A`

      const adminPhoneNumber = process.env.ADMIN_PHONE || '6285210082729' // Fallback number
      const generatedWhatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${message}`

      // 3. Create Order
      const order = await ctx.prisma.order.create({
        data: {
          ...orderData,
          whatsappUrl: generatedWhatsappUrl,
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

