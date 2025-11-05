import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Ejercicio from "@/lib/models/Ejercicio"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get("profesorId")

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId requerido" }, { status: 400 })
    }

    const ejercicios = await Ejercicio.find({ profesorId }).sort({ createdAt: -1 })
    return NextResponse.json(ejercicios)
  } catch (error) {
    console.error("Error al obtener ejercicios:", error)
    return NextResponse.json({ error: "Error al obtener ejercicios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    const ejercicio = await Ejercicio.create(body)
    return NextResponse.json(ejercicio, { status: 201 })
  } catch (error) {
    console.error("Error al crear ejercicio:", error)
    return NextResponse.json({ error: "Error al crear ejercicio" }, { status: 500 })
  }
}
