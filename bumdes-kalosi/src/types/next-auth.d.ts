import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        role?: string
        unitId?: string | null
        unit?: string | null
        id?: string
    }

    interface Session {
        user: {
            role?: string
            unitId?: string | null
            unit?: string | null
            id?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        unitId?: string | null
        unit?: string | null
        id?: string
    }
}
