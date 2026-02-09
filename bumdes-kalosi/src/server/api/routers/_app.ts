import { createTRPCRouter } from '../../trpc'
import { productRouter } from './product'
import { orderRouter } from './order'
import { reviewRouter } from './review'
import { newsRouter } from './news'
import { dashboardRouter } from './dashboard'
import { userRouter } from './user'
import { settingsRouter } from './settings'
import { galleryRouter } from './gallery'
import { businessUnitRouter } from './business-unit'

export const appRouter = createTRPCRouter({
    product: productRouter,
    order: orderRouter,
    review: reviewRouter,
    news: newsRouter,
    dashboard: dashboardRouter,
    user: userRouter,
    settings: settingsRouter,
    gallery: galleryRouter,
    businessUnit: businessUnitRouter,
})

export type AppRouter = typeof appRouter
