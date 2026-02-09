import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'
import { TRPCError } from "@trpc/server";

export const businessUnitRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.businessUnit.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { products: true, users: true },
                },
            },
        });
    }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, "Nama unit harus diisi"),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Check if unit already exists
            const existing = await ctx.prisma.businessUnit.findUnique({
                where: { name: input.name },
            });

            if (existing) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Unit bisnis dengan nama tersebut sudah ada.",
                });
            }

            return ctx.prisma.businessUnit.create({
                data: {
                    name: input.name,
                    description: input.description,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.businessUnit.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    description: input.description,
                }
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Check if unit has related products or users before deleting?
            // For now, let's allow deletion but maybe Prisma will throw error if relations exist 
            // (we didn't set onDelete: Cascade for products/users, so it might fail safely)

            try {
                return await ctx.prisma.businessUnit.delete({
                    where: { id: input.id },
                });
            } catch (error) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Tidak bisa menghapus unit ini karena masih memiliki produk atau staff terkait."
                });
            }
        }),
});
