import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Entrenamiento from "@/lib/models/Entrenamiento"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const alumnoId = searchParams.get("alumnoId")

    if (!alumnoId) {
      return NextResponse.json({ error: "alumnoId requerido" }, { status: 400 })
    }

    const entrenamientos = await Entrenamiento.find({ alumnoId }).sort({ fecha: -1 })
    return NextResponse.json(entrenamientos)
  } catch (error) {
    console.error("Error al obtener entrenamientos:", error)
    return NextResponse.json({ error: "Error al obtener entrenamientos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    const entrenamiento = await Entrenamiento.create(body)
    return NextResponse.json(entrenamiento, { status: 201 })
  } catch (error) {
    console.error("Error al crear entrenamiento:", error)
    return NextResponse.json({ error: "Error al crear entrenamiento" }, { status: 500 })
  }
}
