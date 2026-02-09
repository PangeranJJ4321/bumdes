import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const parse = z
                    .object({
                        username: z.string().min(1),
                        password: z.string().min(1)
                    })
                    .safeParse(credentials)

                if (!parse.success) return null
                const { username, password } = parse.data

                const user = await prisma.user.findUnique({
                    where: { username },
                    include: { unit: true }
                })
                if (!user || !user.password) return null

                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    return {
                        ...user,
                        unit: user.unit?.name ?? null,
                    }
                }

                return null
            }
        })
    ],
})