
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { OrderStatus } from "@prisma/client";

export const dashboardRouter = createTRPCRouter({
    getStats: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user
        const isStaff = user.role === 'STAFF'

        let orderWhere: any = {}
        let productWhere: any = {}

        if (isStaff) {
            // Filter orders containing products owned by this staff (or their unit)
            const productFilter = {
                OR: [
                    { createdById: user.id },
                    user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                ]
            }

            orderWhere.itemsDetail = {
                some: {
                    product: productFilter
                }
            }

            // Filter Products by unit
            productWhere = productFilter;
        }

        let totalRevenue = 0;

        if (isStaff) {
            // Calculate revenue from Completed Orders filtering only valid items
            const orders = await ctx.prisma.order.findMany({
                where: {
                    status: OrderStatus.COMPLETED,
                    ...orderWhere
                },
                select: {
                    itemsDetail: {
                        where: {
                            product: {
                                OR: [
                                    { createdById: user.id },
                                    user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                                ]
                            }
                        },
                        select: {
                            price: true,
                            quantity: true
                        }
                    }
                }
            })

            // Sum up the filtered items from the matched orders
            orders.forEach(order => {
                const orderRevenue = order.itemsDetail.reduce((acc, item) => acc + (item.price * item.quantity), 0)
                totalRevenue += orderRevenue
            })
        } else {
            // Calculate total revenue from all Completed Orders
            const aggregate = await ctx.prisma.order.aggregate({
                _sum: {
                    totalPrice: true
                },
                where: {
                    status: OrderStatus.COMPLETED
                }
            })
            totalRevenue = aggregate._sum.totalPrice || 0
        }

        const [
            pendingOrders,
            totalProducts,
            totalNews,
            completedOrders,
            totalUsers
        ] = await Promise.all([
            ctx.prisma.order.count({
                where: {
                    status: OrderStatus.PENDING,
                    ...orderWhere
                },
            }),
            ctx.prisma.product.count({
                where: productWhere
            }),
            isStaff ? 0 : ctx.prisma.news.count(),
            ctx.prisma.order.count({
                where: {
                    status: OrderStatus.COMPLETED,
                    ...orderWhere
                },
            }),
            isStaff ? 0 : ctx.prisma.user.count(),
        ]);

        return {
            pendingOrders,
            totalProducts,
            totalNews,
            completedOrders,
            totalUsers,
            totalRevenue,
        };
    }),

    getRecentActivity: protectedProcedure
        .input(z.object({
            unitId: z.string().optional(),
        }).optional())
        .query(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const isStaff = user.role === 'STAFF';

            let orderWhere: any = {};
            let reviewWhere: any = {};

            if (isStaff) {
                const productFilter = {
                    OR: [
                        { createdById: user.id },
                        user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                    ]
                }

                orderWhere.itemsDetail = {
                    some: {
                        product: productFilter
                    }
                };

                reviewWhere.product = productFilter;
            } else if (input?.unitId && input.unitId !== "ALL") {
                // Admin Unit Filter
                orderWhere.itemsDetail = {
                    some: {
                        product: { businessUnitId: input.unitId }
                    }
                };
                reviewWhere.product = {
                    businessUnitId: input.unitId
                };
            }

            const [recentOrders, recentReviews] = await Promise.all([
                ctx.prisma.order.findMany({
                    where: orderWhere,
                    take: 5,
                    orderBy: { created_at: "desc" },
                    include: {
                        itemsDetail: {
                            include: { product: { include: { businessUnit: true } } }
                        }
                    }
                }),
                ctx.prisma.review.findMany({
                    where: reviewWhere,
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: {
                        product: { include: { businessUnit: true } },
                    },
                }),
            ]);

            return {
                recentOrders,
                recentReviews,
            };
        }),

    getChartData: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user
        const isStaff = user.role === 'STAFF'

        // Fetch last 90 days of completed orders
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        let orderWhere: any = {
            status: OrderStatus.COMPLETED,
            created_at: {
                gte: ninetyDaysAgo
            }
        }

        if (isStaff) {
            const productFilter = {
                OR: [
                    { createdById: user.id },
                    user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                ]
            }
            orderWhere.itemsDetail = {
                some: { product: productFilter }
            }
        }

        const orders = await ctx.prisma.order.findMany({
            where: orderWhere,
            select: {
                created_at: true,
                totalPrice: true,
                itemsDetail: isStaff ? {
                    where: {
                        product: {
                            OR: [
                                { createdById: user.id },
                                user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                            ]
                        }
                    },
                    select: {
                        price: true,
                        quantity: true
                    }
                } : undefined
            },
            orderBy: { created_at: 'asc' }
        })

        // Group by date
        const dailyRevenue: Record<string, number> = {}

        orders.forEach(order => {
            const date = order.created_at.toISOString().split('T')[0]
            let revenue = 0

            if (isStaff && order.itemsDetail) {
                // For staff, rely on the checked items only
                revenue = order.itemsDetail.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            } else {
                revenue = order.totalPrice
            }

            dailyRevenue[date] = (dailyRevenue[date] || 0) + revenue
        })

        // Fill in missing days
        const chartData = []
        for (let d = new Date(ninetyDaysAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0]
            chartData.push({
                date: dateStr,
                revenue: dailyRevenue[dateStr] || 0
            })
        }

        return chartData
    }),

    getReport: protectedProcedure
        .input(z.object({
            startDate: z.date(),
            endDate: z.date(),
            unitId: z.string().optional(), // Admin optional filter
        }))
        .query(async ({ ctx, input }) => {
            const user = ctx.session.user
            const isStaff = user.role === 'STAFF'

            // Base Filters
            let orderWhere: any = {
                status: OrderStatus.COMPLETED,
                created_at: {
                    gte: input.startDate,
                    lte: input.endDate,
                }
            }

            // Role-based filtering logic
            if (isStaff) {
                // Staff only sees their own products/unit
                const productFilter = {
                    OR: [
                        { createdById: user.id },
                        user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                    ]
                }
                orderWhere.itemsDetail = {
                    some: { product: productFilter }
                }
            } else if (input.unitId && input.unitId !== "ALL") {
                // Admin specific unit filter
                orderWhere.itemsDetail = {
                    some: { product: { businessUnitId: input.unitId } }
                }
            }

            // Fetch Data
            const orders = await ctx.prisma.order.findMany({
                where: orderWhere,
                orderBy: { created_at: 'desc' },
                include: {
                    itemsDetail: {
                        where: isStaff ? {
                            product: {
                                OR: [
                                    { createdById: user.id },
                                    user.unitId ? { businessUnitId: user.unitId } : { createdById: user.id }
                                ]
                            }
                        } : (input.unitId && input.unitId !== "ALL" ? { product: { businessUnitId: input.unitId } } : undefined),
                        include: {
                            product: { include: { businessUnit: true } }
                        }
                    }
                }
            })

            // Process Data for Report
            const reportData = orders.flatMap(order => {
                // If itemsDetail is empty (filtered out) but order exists, skip
                if (order.itemsDetail.length === 0) return []

                return order.itemsDetail.map(item => ({
                    date: order.created_at,
                    orderId: order.id,
                    productName: item.product.name,
                    unit: item.product.businessUnit?.name || "N/A",
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity,
                    customer: order.customerName,
                    status: order.status
                }))
            })

            // Summary Stats
            const totalRevenue = reportData.reduce((acc, item) => acc + item.total, 0)
            const totalTransactions = new Set(reportData.map(r => r.orderId)).size

            return {
                transactions: reportData,
                summary: {
                    totalRevenue,
                    totalTransactions,
                    count: reportData.length
                }
            }
        })
});
