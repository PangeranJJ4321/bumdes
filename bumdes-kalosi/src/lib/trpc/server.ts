import { cache } from 'react'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@/server/api/routers/_app'

const getBaseUrl = () => {
    if (typeof window !== 'undefined') return '' // Browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export const api = cache(() =>
    createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
                transformer: superjson,
            }),
        ],
    })
)
