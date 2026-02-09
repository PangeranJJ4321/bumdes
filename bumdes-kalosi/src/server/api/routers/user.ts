import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure, protectedProcedure } from "../../trpc";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const userRoleEnum = z.nativeEnum(UserRole);

export const userRouter = createTRPCRouter({
    // --- Admin Only Procedures ---

    getAll: adminProcedure.query(async ({ ctx }) => {
        return ctx.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                unitId: true,
                image: true,
                createdAt: true,
                unit: { select: { name: true } }
            },
        });
    }),

    getById: adminProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.user.findUnique({
                where: { id: input.id },
            });
        }),

    create: adminProcedure
        .input(
            z.object({
                name: z.string().min(1),
                username: z.string().min(3),
                email: z.string().email(),
                password: z.string().min(6),
                role: userRoleEnum,
                isActive: z.boolean().default(true),
                phone: z.string().optional(),
                unitId: z.string().optional(),
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
                    phone: input.phone,
                    isActive: input.isActive,
                    unitId: input.unitId,
                },
            });
        }),

    update: adminProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                username: z.string().optional(),
                email: z.string().email().optional(),
                role: userRoleEnum.optional(),
                isActive: z.boolean().optional(),
                phone: z.string().optional(),
                password: z.string().min(6).optional(),
                unitId: z.string().optional().nullable(),
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

    toggleStatus: adminProcedure
        .input(z.object({ id: z.string(), isActive: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.update({
                where: { id: input.id },
                data: { isActive: input.isActive },
            });
        }),

    delete: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.delete({
                where: { id: input.id },
            });
        }),

    // --- Profile Management (Self-Service) ---

    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            console.log("getProfile called. User ID:", ctx.session.user.id);
            const user = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    phone: true,
                    role: true,
                    image: true,
                    createdAt: true,
                }
            })
            console.log("getProfile result:", user);
            return user;
        }),

    updateProfile: protectedProcedure
        .input(z.object({
            name: z.string().min(1).optional(),
            username: z.string().min(3).optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            image: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: input,
            })
        }),

    changePassword: protectedProcedure
        .input(z.object({
            oldPassword: z.string().min(1),
            newPassword: z.string().min(6),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id }
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
                where: { id: ctx.session.user.id },
                data: { password: hashedPassword }
            })
        }),
});
