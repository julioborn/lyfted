import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import conectarDB from "@/lib/mongodb"
import Profesor from "@/lib/models/Profesor"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params
    const data = await req.json()

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await conectarDB()
    const profesor = await Profesor.findByIdAndUpdate(
        id,
        {
            nombre: data.nombre,
            dni: data.dni,
            telefono: data.telefono,
            email: data.email,
            nombreGimnasio: data.nombreGimnasio,
            ciudad: data.ciudad,
            provincia: data.provincia,
            password: hashedPassword,
            registroCompleto: true,
            planSuscripcion: "basico", // por ahora fijo
            metodoPago: "ninguno", // aún sin pago
            fechaAlta: new Date().toISOString(),
        },
        { new: true }
    )

    return NextResponse.json({ profesor })
}
