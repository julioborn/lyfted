import Profesor from "@/lib/models/Profesor"
import conectarDB from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const dni = searchParams.get("dni")

    if (!dni) return NextResponse.json({ error: "DNI requerido" }, { status: 400 })

    await conectarDB()
    const profesor = await Profesor.findOne({ dni })

    if (!profesor) return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 })

    return NextResponse.json({ profesor })
}
