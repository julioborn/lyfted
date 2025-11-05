import { NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import * as bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        await conectarDB()
        const { dni, password } = await req.json()

        const alumno = await Alumno.findOne({ dni })
        if (!alumno) {
            return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
        }

        if (alumno.password) {
            return NextResponse.json({ error: "El alumno ya tiene contraseña" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        alumno.password = hashedPassword
        alumno.registroCompleto = true
        await alumno.save()

        return NextResponse.json({
            message: "Registro completado correctamente",
            alumno: { id: alumno._id, nombre: alumno.nombre },
        })
    } catch (error) {
        console.error("❌ Error en completar registro:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
