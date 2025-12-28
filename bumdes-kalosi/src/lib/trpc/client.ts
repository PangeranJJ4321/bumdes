import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@/server/api/routers/_app'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: '/api/trpc',
        }),
    ],
})
