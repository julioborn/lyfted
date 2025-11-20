import { NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"

export async function GET(req: Request) {
    try {
        await conectarDB()
        const { searchParams } = new URL(req.url)
        const dni = searchParams.get("dni")

        if (!dni) return NextResponse.json({ error: "dni requerido" }, { status: 400 })

        // 👇 Tipamos manualmente el resultado para evitar errores de TypeScript
        const alumno = (await Alumno.findOne({ dni }).lean()) as any
        if (!alumno) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })

        return NextResponse.json({
            alumno: {
                _id: alumno._id.toString(),
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                dni: alumno.dni,
                registroCompleto: alumno.registroCompleto,
            },
        })
    } catch (e) {
        console.error("❌ Error interno:", e)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
