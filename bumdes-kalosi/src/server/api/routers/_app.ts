import { createTRPCRouter } from '../../trpc'
import { productRouter } from './product'
import { orderRouter } from './order'
import { reviewRouter } from './review'
import { newsRouter } from './news'
import { dashboardRouter } from './dashboard'
import { userRouter } from './user'

export const appRouter = createTRPCRouter({
    product: productRouter,
    order: orderRouter,
    review: reviewRouter,
    news: newsRouter,
    dashboard: dashboardRouter,
    user: userRouter,
})

export type AppRouter = typeof appRouter
