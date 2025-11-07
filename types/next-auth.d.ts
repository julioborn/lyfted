import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            tipo: "profesor" | "alumno"
            nombre?: string
            email?: string | null
            image?: string | null
            dni?: string | null         // 👈 agregado
            registroCompleto: boolean
        }
    }

    interface User {
        id: string
        tipo: "profesor" | "alumno"
        nombre?: string
        email?: string | null
        image?: string | null
        dni?: string | null           // 👈 agregado
        registroCompleto: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        tipo: "profesor" | "alumno"
        nombre?: string
        email?: string | null
        image?: string | null
        dni?: string | null           // 👈 agregado
        registroCompleto: boolean
    }
}
