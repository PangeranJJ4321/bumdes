
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";
import { OrderStatus } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.order.findMany({
      orderBy: { created_at: "desc" },
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
      return ctx.prisma.order.delete({
        where: { id: input.id },
      });
    }),
});
