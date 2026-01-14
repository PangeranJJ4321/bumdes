import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Empty for middleware
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.unit = user.unit
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.unit = token.unit as string | null
            }
            return session
        },
    },
} satisfies NextAuthConfig
