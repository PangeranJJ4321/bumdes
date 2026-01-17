import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Define public admin routes that don't require authentication
    const publicAdminRoutes = [
        "/admin/login",
        "/admin/forgot-password",
        "/admin/reset-password"
    ]

    const isPublicAdminRoute = publicAdminRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
    )

    // Protect all /admin routes
    if (isAdminRoute && !isPublicAdminRoute) {
        if (isLoggedIn) return
        return Response.redirect(new URL("/admin/login", req.nextUrl))
    }

    // Redirect to dashboard if logged in and trying to access public auth pages (login, forgot password, etc)
    if (isPublicAdminRoute && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}