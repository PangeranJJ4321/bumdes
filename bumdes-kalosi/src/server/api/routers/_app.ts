import { createTRPCRouter } from '../../trpc'
import { productRouter } from './product'
import { orderRouter } from './order'
import { reviewRouter } from './review'

export const appRouter = createTRPCRouter({
    product: productRouter,
    order: orderRouter,
    review: reviewRouter,
})

export type AppRouter = typeof appRouter
