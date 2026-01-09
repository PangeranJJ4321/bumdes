
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const userRoleEnum = z.nativeEnum(UserRole);

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                image: true,
                createdAt: true,
            },
        });
    }),

    create: publicProcedure
        .input(
            z.object({
                name: z.string().min(1),
                username: z.string().min(3),
                email: z.string().email(),
                password: z.string().min(6),
                role: userRoleEnum,
                isActive: z.boolean().default(true),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);

            return ctx.prisma.user.create({
                data: {
                    name: input.name,
                    username: input.username,
                    email: input.email,
                    password: hashedPassword,
                    role: input.role,
                    isActive: input.isActive,
                },
            });
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                username: z.string().optional(),
                email: z.string().email().optional(),
                role: userRoleEnum.optional(),
                isActive: z.boolean().optional(),
                password: z.string().min(6).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, password, ...rest } = input;

            const data: any = { ...rest };

            if (password) {
                data.password = await bcrypt.hash(password, 10);
            }

            return ctx.prisma.user.update({
                where: { id },
                data,
            });
        }),

    toggleStatus: publicProcedure
        .input(z.object({ id: z.string(), isActive: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.update({
                where: { id: input.id },
                data: { isActive: input.isActive },
            });
        }),
});
