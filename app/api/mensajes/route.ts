import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Mensaje from "@/lib/models/Mensaje"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get("profesorId")
    const alumnoId = searchParams.get("alumnoId")

    if (!profesorId || !alumnoId) {
      return NextResponse.json({ error: "profesorId y alumnoId requeridos" }, { status: 400 })
    }

    const mensajes = await Mensaje.find({
      profesorId,
      alumnoId,
    }).sort({ fecha: 1 })

    return NextResponse.json(mensajes)
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    const mensaje = await Mensaje.create(body)
    return NextResponse.json(mensaje, { status: 201 })
  } catch (error) {
    console.error("Error al crear mensaje:", error)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
