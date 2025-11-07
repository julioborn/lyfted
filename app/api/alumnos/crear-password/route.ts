import { NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    await conectarDB()
    const { dni, password } = await req.json()

    if (!dni || !password)
        return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

    const alumno = await Alumno.findOne({ dni })
    if (!alumno)
        return NextResponse.json({ error: "No estás registrado, consultá con tu profesor." }, { status: 404 })

    if (alumno.password)
        return NextResponse.json({ error: "Ya tenés una cuenta registrada." }, { status: 400 })

    const hash = await bcrypt.hash(password, 10)
    alumno.password = hash
    await alumno.save()

    return NextResponse.json({ ok: true, mensaje: "Cuenta creada correctamente" })
}
