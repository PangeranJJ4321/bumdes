
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";
import { OrderStatus } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user
    const where: any = {}

    if (user.role === 'STAFF' && user.unitId) {
      where.itemsDetail = {
        some: {
          product: {
            businessUnitId: user.unitId
          }
        }
      }
    }

    return ctx.prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        itemsDetail: { include: { product: true } }
      }
    });
  }),

  create: protectedProcedure
    .input(z.object({
      customerName: z.string(),
      customerPhone: z.string().optional(),
      customerAddress: z.string().optional().default("-"),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })),
      deliveryMethod: z.string().optional().default("PICKUP"),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch products to get real prices and info
      const productIds = input.items.map(i => i.productId);
      const products = await ctx.prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { businessUnit: true }
      });

      // Map for easy access
      const productMap = new Map(products.map(p => [p.id, p]));

      // 2. Validate and Build Item Snapshots & Calculate Total
      let totalPrice = 0;
      const itemSnapshots: any[] = [];
      const orderItemsData: any[] = [];

      for (const item of input.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const user = ctx.session.user
        if (user.role === 'STAFF' && user.unitId) {
          if (product.businessUnitId !== user.unitId) {
            throw new Error(`Anda tidak dapat manambahkan produk ${product.name} (Unit: ${product.businessUnit?.name}) karena anda bertugas di Unit lain.`)
          }
        }

        const price = product.promoPrice && product.isPromo ? product.promoPrice : product.price;
        const lineTotal = price * item.quantity;
        totalPrice += lineTotal;

        // Snapshot for JSON column (matches frontend expectation: title, price, quantity)
        itemSnapshots.push({
          id: product.id,
          title: product.name,
          price: price,
          quantity: item.quantity,
          image: product.imageUrl,
          unit: product.businessUnit?.name
        });

        // Data for relational table
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: price
        });
      }

      // 3. Create Order
      return ctx.prisma.order.create({
        data: {
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          totalPrice,
          status: "PENDING", // Default
          deliveryMethod: input.deliveryMethod,
          items: itemSnapshots,
          itemsDetail: {
            create: orderItemsData
          }
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      customerName: z.string(),
      customerPhone: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch products for recalculation
      const productIds = input.items.map(i => i.productId);
      const products = await ctx.prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { businessUnit: true }
      });
      const productMap = new Map(products.map(p => [p.id, p]));

      // 2. Build info
      let totalPrice = 0;
      const itemSnapshots: any[] = [];
      const orderItemsData: any[] = [];

      for (const item of input.items) {
        const product = productMap.get(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const user = ctx.session.user
        if (user.role === 'STAFF' && user.unitId) {
          if (product.businessUnitId !== user.unitId) {
            throw new Error(`Anda tidak dapat manambahkan produk ${product.name} (Unit: ${product.businessUnit?.name}) karena anda bertugas di Unit lain.`)
          }
        }

        const price = product.promoPrice && product.isPromo ? product.promoPrice : product.price;
        totalPrice += price * item.quantity;

        itemSnapshots.push({
          id: product.id,
          title: product.name,
          price: price,
          quantity: item.quantity,
          image: product.imageUrl,
          unit: product.businessUnit?.name
        });

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: price
        });
      }

      // 3. Transactional update
      return ctx.prisma.$transaction(async (tx) => {
        // Delete old items
        await tx.orderItem.deleteMany({
          where: { orderId: input.id }
        });

        // Update Order
        const order = await tx.order.update({
          where: { id: input.id },
          data: {
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            totalPrice,
            items: itemSnapshots,
            itemsDetail: {
              create: orderItemsData
            }
          }
        });

        return order;
      });
    }),

  // getById is complex because items are stored as JSON, but mapped to OrderItem relation too
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: { itemsDetail: { include: { product: true } } }
      })
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.nativeEnum(OrderStatus),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user
      if (user.role === 'STAFF' && user.unitId) {
        const order = await ctx.prisma.order.findUnique({
          where: { id: input.id },
          include: { itemsDetail: { include: { product: true } } }
        })

        if (!order) throw new Error("Order not found")

        const hasOtherUnitItems = order.itemsDetail.some(item => item.product.businessUnitId !== user.unitId)
        if (hasOtherUnitItems) {
          throw new Error("Anda tidak dapat menghapus pesanan ini karena berisi item dari unit lain.")
        }
      }

      return ctx.prisma.order.delete({
        where: { id: input.id },
      });
    }),
});
