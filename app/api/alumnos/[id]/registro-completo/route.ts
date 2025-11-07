import { NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import bcrypt from "bcryptjs"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await conectarDB()
        const { id } = params
        const body = await req.json()

        const {
            email,
            password,            // plano, lo hasheamos acá
            fechaNacimiento,
            genero,
            telefono,
            objetivoPrincipal,    // usar valores del enum del modelo: "fuerza" | "masa_muscular" | "rendimiento" | "salud"
            aclaracionObjetivo,
            lesiones,
        } = body

        const hash = password ? await bcrypt.hash(password, 10) : undefined

        const alumno = await Alumno.findByIdAndUpdate(
            id,
            {
                ...(email && { email }),
                ...(hash && { password: hash }),
                ...(fechaNacimiento && { fechaNacimiento }),
                ...(genero && { genero }),
                ...(telefono && { telefono }),
                ...(objetivoPrincipal && { objetivoPrincipal }),
                ...(aclaracionObjetivo && { aclaracionObjetivo }),
                ...(lesiones && { lesiones }),
                registroCompleto: true,
            },
            { new: true }
        ).lean()

        if (!alumno) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("❌ Error al completar registro:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
