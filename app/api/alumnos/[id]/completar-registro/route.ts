import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const body = await request.json()
        const {
            password,
            email,
            telefono,
            fechaNacimiento,
            genero,
            objetivoPrincipal,
            lesiones,
        } = body

        await conectarDB()

        const alumno = await Alumno.findById(id)
        if (!alumno) {
            return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
        }

        // Encriptar contraseña si se envió
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            alumno.password = hashedPassword
        }

        alumno.email = email
        alumno.telefono = telefono
        alumno.fechaNacimiento = fechaNacimiento
        alumno.genero = genero
        alumno.objetivoPrincipal = objetivoPrincipal
        alumno.lesiones = lesiones
        alumno.registroCompleto = true

        await alumno.save()

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("❌ Error al actualizar alumno:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
