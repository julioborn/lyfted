import { type NextRequest, NextResponse } from "next/server"
import conectarDB from "@/lib/mongodb"
import Profesor from "@/lib/models/Profesor"
import Alumno from "@/lib/models/Alumno"

export async function POST(request: NextRequest) {
  try {
    await conectarDB()

    const { identificador, password, tipo } = await request.json()

    console.log("[v0] Login attempt:", { identificador, tipo })

    if (tipo === "profesor") {
      // Login con email para profesores
      const profesor = await Profesor.findOne({ email: identificador })

      if (!profesor) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      // Verificar contraseña (en producción usar bcrypt)
      if (profesor.password !== password) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      return NextResponse.json({
        usuario: {
          id: profesor._id.toString(),
          nombre: profesor.nombre,
          email: profesor.email,
          dni: profesor.dni,
          tipo: "profesor",
          nombreGimnasio: profesor.nombreGimnasio,
          avatar: profesor.avatar,
        },
      })
    } else {
      // Login con DNI para alumnos
      const alumno = await Alumno.findOne({ dni: identificador })

      if (!alumno) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      if (!alumno.password) {
        return NextResponse.json({ error: "Alumno no ha completado el registro" }, { status: 401 })
      }

      // Verificar contraseña (en producción usar bcrypt)
      if (alumno.password !== password) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      return NextResponse.json({
        usuario: {
          id: alumno._id.toString(),
          nombre: alumno.nombre,
          email: alumno.email,
          dni: alumno.dni,
          tipo: "alumno",
          profesorId: alumno.profesorId.toString(),
          planActualId: alumno.planActualId?.toString(),
          registroCompleto: alumno.registroCompleto,
          avatar: alumno.avatar,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Error en login:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
