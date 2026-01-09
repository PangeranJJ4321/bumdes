import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc";

export const settingsRouter = createTRPCRouter({
    get: publicProcedure.query(async ({ ctx }) => {
        // Try to find the settings, or create default if not exists
        let settings = await ctx.prisma.siteSettings.findUnique({
            where: { key: "general" },
        });

        if (!settings) {
            settings = await ctx.prisma.siteSettings.create({
                data: {
                    key: "general",
                    contactName: "BUMDes Kalosi",
                    contactEmail: "admin@bumdeskalosi.com",
                    contactPhone: "6281234567890",
                    address: "Jl. Poros Kalosi No. 1",
                    operatingHours: "Senin - Jumat: 08:00 - 16:00",
                },
            });
        }

        return settings;
    }),

    update: adminProcedure
        .input(
            z.object({
                contactName: z.string().optional(),
                contactEmail: z.string().email().optional().or(z.literal("")),
                contactPhone: z.string().optional(),
                address: z.string().optional(),
                operatingHours: z.string().optional(),
                facebookUrl: z.string().url().optional().or(z.literal("")),
                instagramUrl: z.string().url().optional().or(z.literal("")),
                youtubeUrl: z.string().url().optional().or(z.literal("")),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Ensure "general" settings exist first
            const exists = await ctx.prisma.siteSettings.findUnique({
                where: { key: "general" },
            });

            if (!exists) {
                return ctx.prisma.siteSettings.create({
                    data: {
                        key: "general",
                        ...input,
                    },
                });
            }

            return ctx.prisma.siteSettings.update({
                where: { key: "general" },
                data: input,
            });
        }),
});
