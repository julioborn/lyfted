import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import Profesor from "@/lib/models/Profesor"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identificador: { label: "Identificador", type: "text" },
                password: { label: "Contraseña", type: "password" },
                tipo: { label: "Tipo", type: "text" },
            },
            async authorize(credentials) {
                await conectarDB()

                const { identificador, password, tipo } = credentials as {
                    identificador: string
                    password: string
                    tipo: "alumno" | "profesor"
                }

                if (!identificador || !password || !tipo) return null

                // PROFESOR
                if (tipo === "profesor") {
                    const profesor = await Profesor.findOne({ dni: identificador })
                    if (!profesor) return null

                    const ok = await bcrypt.compare(password, profesor.password)
                    if (!ok) return null

                    return {
                        id: profesor._id.toString(),
                        nombre: profesor.nombre,
                        apellido: profesor.apellido ?? "",
                        tipo: "profesor",
                        dni: profesor.dni,
                        email: profesor.email ?? null,
                        registroCompleto: true,
                        image: profesor.avatar ?? null,
                    }
                }

                // ALUMNO
                const alumno = await Alumno.findOne({ dni: identificador })
                if (!alumno || !alumno.password) return null

                const ok = await bcrypt.compare(password, alumno.password)
                if (!ok) return null

                return {
                    id: alumno._id.toString(),
                    nombre: alumno.nombre,
                    apellido: alumno.apellido ?? "",
                    tipo: "alumno",
                    dni: alumno.dni,
                    registroCompleto: Boolean(alumno.registroCompleto),
                    email: alumno.email ?? null,
                    image: alumno.image ?? null,
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 365 * 24 * 60 * 60, // 1 año
    },

    jwt: {
        maxAge: 365 * 24 * 60 * 60,
    },

    cookies: {
        sessionToken: {
            name:
                process.env.NODE_ENV === "production"
                    ? "__Secure-next-auth.session-token"
                    : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 365 * 24 * 60 * 60,
            },
        },
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.tipo = user.tipo
                token.nombre = user.nombre
                token.dni = user.dni ?? null
                token.registroCompleto = user.registroCompleto
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    tipo: token.tipo,
                    nombre: token.nombre,
                    dni: token.dni ?? null,
                    registroCompleto: token.registroCompleto,
                    email: session.user?.email || null,
                    image: session.user?.image || null,
                }
            }
            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET || "clave_ultra_segura",
})

export { handler as GET, handler as POST }
