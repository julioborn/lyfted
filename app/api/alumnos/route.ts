import { type NextRequest, NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"

// GET - Obtener todos los alumnos de un profesor
export async function GET(request: NextRequest) {
  try {
    await conectarDB()

    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get("profesorId")

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId es requerido" }, { status: 400 })
    }

    const alumnos = await Alumno.find({ profesorId, activo: true }).populate("planActualId").sort({ createdAt: -1 })

    return NextResponse.json({ alumnos })
  } catch (error) {
    console.error("[v0] Error al obtener alumnos:", error)
    return NextResponse.json({ error: "Error al obtener alumnos" }, { status: 500 })
  }
}

// POST - Crear nuevo alumno (solo nombre y DNI)
export async function POST(request: NextRequest) {
  try {
    await conectarDB()

    const { nombre, dni, profesorId } = await request.json()

    // Verificar que el DNI no exista
    const alumnoExistente = await Alumno.findOne({ dni })
    if (alumnoExistente) {
      return NextResponse.json({ error: "Ya existe un alumno con ese DNI" }, { status: 400 })
    }

    const nuevoAlumno = await Alumno.create({
      nombre,
      dni,
      profesorId,
      registroCompleto: false,
    })

    return NextResponse.json({ alumno: nuevoAlumno }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error al crear alumno:", error)
    return NextResponse.json({ error: "Error al crear alumno" }, { status: 500 })
  }
}
