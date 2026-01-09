import { createTRPCRouter } from '../../trpc'
import { productRouter } from './product'
import { orderRouter } from './order'
import { reviewRouter } from './review'
import { newsRouter } from './news'

export const appRouter = createTRPCRouter({
    product: productRouter,
    order: orderRouter,
    review: reviewRouter,
    news: newsRouter,
})

export type AppRouter = typeof appRouter
