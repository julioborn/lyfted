import { type NextRequest, NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import Plan from "@/lib/models/Plan"

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

// POST - Crear nuevo alumno
export async function POST(request: NextRequest) {
  try {
    await conectarDB()

    const data = await request.json()

    const {
      nombre,
      apellido,
      dni,
      profesorId,
      nivel,
    } = data

    // Validación rápida
    if (!nombre || !apellido || !dni || !profesorId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    // Verificar que el DNI no exista
    const alumnoExistente = await Alumno.findOne({ dni })
    if (alumnoExistente) {
      return NextResponse.json(
        { error: "Ya existe un alumno con ese DNI" },
        { status: 400 }
      )
    }

    const nuevoAlumno = await Alumno.create({
      nombre,
      apellido,
      dni,
      profesorId,
      nivel: nivel || "principiante",
      telefono: "",
      email: "",
      fechaNacimiento: null,
      genero: null,
      ciudad: "",
      provincia: "",
      pais: "",
      objetivoPrincipal: null,
      lesiones: "",
      peso: null,
      altura: null,
      estadoPlan: "sin_plan",
      planActualId: null,
      registroCompleto: false,
      avatar: "/placeholder.svg",
      activo: true,
    })

    return NextResponse.json({ alumno: nuevoAlumno }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error al crear alumno:", error)
    return NextResponse.json({ error: "Error al crear alumno" }, { status: 500 })
  }
}
