import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const url = req.nextUrl
    const path = url.pathname

    const isPublic =
        path === "/" ||
        path.startsWith("/login") ||
        path.startsWith("/alumno/registro") ||
        path.startsWith("/alumno/bienvenida")

    // 1️⃣ Usuario NO logueado → permite solo rutas públicas
    if (!token) {
        if (!isPublic) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
        return NextResponse.next()
    }

    // 2️⃣ Usuario logueado → NO permitir rutas públicas
    if (isPublic) {
        if (token.tipo === "alumno") {
            return NextResponse.redirect(new URL("/alumno/dashboard", req.url))
        }
        if (token.tipo === "profesor") {
            return NextResponse.redirect(new URL("/profesor/dashboard", req.url))
        }
    }

    // 3️⃣ Protección por roles
    if (path.startsWith("/alumno") && token.tipo !== "alumno") {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (path.startsWith("/profesor") && token.tipo !== "profesor") {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/alumno/:path*",
        "/profesor/:path*",
    ],
}
