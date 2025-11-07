import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import Profesor from "@/lib/models/Profesor"

export const authOptions: NextAuthOptions = {
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

                let usuario =
                    tipo === "profesor"
                        ? await Profesor.findOne({ email: identificador })
                        : await Alumno.findOne({ dni: identificador })

                if (!usuario) return null

                const valid = await bcrypt.compare(password, usuario.password)
                if (!valid) return null

                // ✅ Devolvemos todos los campos necesarios
                const userData = {
                    id: usuario._id.toString(),
                    nombre: usuario.nombre,
                    tipo,
                    dni: usuario.dni, // 👈 ya no usamos “?? null”
                    registroCompleto: usuario.registroCompleto ?? false,
                }

                console.log("✅ Usuario autorizado:", userData) // 👀 debug

                return userData
            },
        }),
    ],

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.tipo = user.tipo
                token.nombre = user.nombre
                token.dni = user.dni // 👈 agregamos DNI al token
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
                    dni: token.dni, // 👈 y lo pasamos a la sesión
                    registroCompleto: token.registroCompleto,
                    email: session.user?.email || null,
                    image: session.user?.image || null,
                }
            }
            return session
        },
    },
}
