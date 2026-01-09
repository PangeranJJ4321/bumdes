
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { OrderStatus } from "@prisma/client";

export const dashboardRouter = createTRPCRouter({
    getStats: publicProcedure.query(async ({ ctx }) => {
        const [
            pendingOrders,
            totalProducts,
            totalNews,
            completedOrders,
            totalUsers
        ] = await Promise.all([
            ctx.prisma.order.count({
                where: { status: OrderStatus.PENDING },
            }),
            ctx.prisma.product.count(),
            ctx.prisma.news.count(),
            ctx.prisma.order.count({
                where: { status: OrderStatus.COMPLETED },
            }),
            ctx.prisma.user.count(),
        ]);

        return {
            pendingOrders,
            totalProducts,
            totalNews,
            completedOrders,
            totalUsers,
        };
    }),

    getRecentActivity: publicProcedure.query(async ({ ctx }) => {
        const [recentOrders, recentReviews] = await Promise.all([
            ctx.prisma.order.findMany({
                take: 5,
                orderBy: { created_at: "desc" },
                include: {
                    itemsDetail: {
                        include: { product: true }
                    }
                }
            }),
            // Assuming Review model exists and has relation to Product/User
            ctx.prisma.review.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    product: true,
                },
            }),
        ]);

        return {
            recentOrders,
            recentReviews,
        };
    }),
});
