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
                token.unitId = user.unitId
                token.unit = user.unit
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.unitId = token.unitId as string | null
                session.user.unit = token.unit as string | null
            }
            return session
        },
    },
} satisfies NextAuthConfig
