import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const usuario = req.cookies.get("usuario") || null
    const url = req.nextUrl.pathname

    // Si no hay usuario y está intentando entrar al dashboard
    if (!usuario && (url.startsWith("/alumno") || url.startsWith("/profesor"))) {
        return NextResponse.redirect(new URL("/login/alumno", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/alumno/:path*", "/profesor/:path*"],
}
