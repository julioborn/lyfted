import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectMongoDB from "@/lib/mongodb"
import Profesor from "@/lib/models/Profesor"

export async function POST(req: Request) {
    try {
        await connectMongoDB()
        const body = await req.json()

        const {
            nombre,
            dni,
            telefono,
            password,
            nombreGimnasio,
            email,
            ciudad,
            provincia,
            logo,
        } = body

        // 🔎 Verificar si ya existe un profesor con ese DNI o email
        const existente = await Profesor.findOne({ $or: [{ dni }, { email }] })
        if (existente) {
            return NextResponse.json(
                { error: "Ya existe un entrenador con ese DNI o email" },
                { status: 400 }
            )
        }

        // 🔐 Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // 🧾 Crear el nuevo profesor
        const nuevoProfesor = await Profesor.create({
            nombre,
            dni,
            telefono,
            password: hashedPassword,
            nombreGimnasio,
            email,
            ciudad,
            provincia,
            logo,
            registroCompleto: true,
            activo: true,
            planSuscripcion: "unico",
            metodoPago: "ninguno",
        })

        return NextResponse.json({ ok: true, profesor: nuevoProfesor })
    } catch (error) {
        console.error("❌ Error al crear profesor:", error)
        return NextResponse.json(
            { error: "Error al registrar el entrenador" },
            { status: 500 }
        )
    }
}
