import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            tipo: "profesor" | "alumno"
            nombre?: string
            apellido?: string         // 👈 agregado
            email?: string | null
            image?: string | null
            dni?: string | null
            registroCompleto: boolean
        }
    }

    interface User {
        id: string
        tipo: "profesor" | "alumno"
        nombre?: string
        apellido?: string            // 👈 agregado
        email?: string | null
        image?: string | null
        dni?: string | null
        registroCompleto: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        tipo: "profesor" | "alumno"
        nombre?: string
        apellido?: string            // 👈 agregado
        email?: string | null
        image?: string | null
        dni?: string | null
        registroCompleto: boolean
    }
}
