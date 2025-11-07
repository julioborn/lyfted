export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        // Protege solo rutas privadas
        "/profesor/:path*",
        "/alumno/:path((?!registro|bienvenida).*)",
        // 👆 esto significa: protege todo /alumno/* excepto /alumno/registro y /alumno/bienvenida
    ],
}
