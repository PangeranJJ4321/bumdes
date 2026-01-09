
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

    // --- Profile Management (Self-Service) ---

    getProfile: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            // In a real app with Protected Procedures, we would use ctx.session.user.id
            return ctx.prisma.user.findUnique({
                where: { id: input.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    phone: true,
                    role: true,
                    image: true,
                }
            })
        }),

    updateProfile: publicProcedure
        .input(z.object({
            id: z.string().uuid(), // Ideally obtained from session
            name: z.string().min(1).optional(),
            username: z.string().min(3).optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input
            return ctx.prisma.user.update({
                where: { id },
                data,
            })
        }),

    changePassword: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
            oldPassword: z.string().min(1),
            newPassword: z.string().min(6),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { id: input.id }
            })

            if (!user || !user.password) {
                throw new Error("User not found or no password set.")
            }

            const isValid = await bcrypt.compare(input.oldPassword, user.password)

            if (!isValid) {
                throw new Error("Password lama salah.")
            }

            const hashedPassword = await bcrypt.hash(input.newPassword, 10)

            return ctx.prisma.user.update({
                where: { id: input.id },
                data: { password: hashedPassword }
            })
        }),
});
