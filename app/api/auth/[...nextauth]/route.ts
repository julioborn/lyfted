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

                if (tipo === "profesor") {
                    // 🔍 Buscar profesor por DNI (no por email)
                    const profesor = await Profesor.findOne({ dni: identificador })
                    if (!profesor) return null

                    const ok = await bcrypt.compare(password, profesor.password)
                    if (!ok) return null

                    return {
                        id: profesor._id.toString(),
                        nombre: profesor.nombre,
                        tipo: "profesor",
                        dni: profesor.dni,
                        registroCompleto: true,
                        email: profesor.email ?? null,
                        image: profesor.avatar ?? null,
                    }
                }

                // alumno
                const alumno = await Alumno.findOne({ dni: identificador })
                if (!alumno) return null
                if (!alumno.password) return null // aún no creó contraseña
                const ok = await bcrypt.compare(password, alumno.password)
                if (!ok) return null

                return {
                    id: alumno._id.toString(),
                    nombre: alumno.nombre,
                    tipo: "alumno",
                    dni: alumno.dni, // 👈 agregado
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

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.tipo = user.tipo
                token.nombre = user.nombre
                token.dni = user.dni ?? null         // 👈 asegurate de tener esta línea
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
                    dni: token.dni ?? null,            // 👈 y esta línea también
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
