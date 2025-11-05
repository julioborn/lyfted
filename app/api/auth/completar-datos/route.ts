import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"

export async function PUT(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const { alumnoId, ...datos } = body

    const alumno = await Alumno.findByIdAndUpdate(
      alumnoId,
      { ...datos, datosCompletos: true },
      { new: true, runValidators: true },
    )

    if (!alumno) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
    }

    return NextResponse.json(alumno)
  } catch (error) {
    console.error("Error al completar datos:", error)
    return NextResponse.json({ error: "Error al completar datos" }, { status: 500 })
  }
}
