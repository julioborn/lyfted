import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Ejercicio from "@/lib/models/Ejercicio"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const ejercicio = await Ejercicio.findById(params.id)

    if (!ejercicio) {
      return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(ejercicio)
  } catch (error) {
    console.error("Error al obtener ejercicio:", error)
    return NextResponse.json({ error: "Error al obtener ejercicio" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()

    const ejercicio = await Ejercicio.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!ejercicio) {
      return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(ejercicio)
  } catch (error) {
    console.error("Error al actualizar ejercicio:", error)
    return NextResponse.json({ error: "Error al actualizar ejercicio" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const ejercicio = await Ejercicio.findByIdAndDelete(params.id)

    if (!ejercicio) {
      return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Ejercicio eliminado" })
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error)
    return NextResponse.json({ error: "Error al eliminar ejercicio" }, { status: 500 })
  }
}
