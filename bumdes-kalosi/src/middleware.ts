import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isAuthRoute = req.nextUrl.pathname.startsWith("/admin/login")

    // Protect all /admin routes
    if (isAdminRoute && !isAuthRoute) {
        if (isLoggedIn) return
        return Response.redirect(new URL("/admin/login", req.nextUrl))
    }

    // Redirect to dashboard if logged in and trying to access login page
    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}