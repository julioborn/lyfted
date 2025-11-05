import { type NextRequest, NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"

// GET - Obtener un alumno por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await conectarDB()

    const alumno = await Alumno.findById(params.id).populate("planActualId")

    if (!alumno) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ alumno })
  } catch (error) {
    console.error("[v0] Error al obtener alumno:", error)
    return NextResponse.json({ error: "Error al obtener alumno" }, { status: 500 })
  }
}

// PUT - Actualizar alumno
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await conectarDB()

    const datos = await request.json()

    const alumno = await Alumno.findByIdAndUpdate(params.id, { $set: datos }, { new: true, runValidators: true })

    if (!alumno) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ alumno })
  } catch (error) {
    console.error("[v0] Error al actualizar alumno:", error)
    return NextResponse.json({ error: "Error al actualizar alumno" }, { status: 500 })
  }
}

// DELETE - Eliminar alumno (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await conectarDB()

    const alumno = await Alumno.findByIdAndUpdate(params.id, { $set: { activo: false } }, { new: true })

    if (!alumno) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ mensaje: "Alumno eliminado correctamente" })
  } catch (error) {
    console.error("[v0] Error al eliminar alumno:", error)
    return NextResponse.json({ error: "Error al eliminar alumno" }, { status: 500 })
  }
}
