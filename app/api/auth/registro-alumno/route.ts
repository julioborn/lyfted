import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    await connectDB()
    const { dni, password } = await request.json()

    // Verificar que el alumno existe (dado de alta por el profesor)
    const alumno = await Alumno.findOne({ dni, registrado: false })

    if (!alumno) {
      return NextResponse.json({ error: "DNI no encontrado. Contacta a tu profesor." }, { status: 404 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar alumno con contraseña y marcarlo como registrado
    alumno.password = hashedPassword
    alumno.registrado = true
    await alumno.save()

    return NextResponse.json({
      message: "Registro exitoso",
      alumno: {
        id: alumno._id,
        nombre: alumno.nombre,
        dni: alumno.dni,
        profesorId: alumno.profesorId,
      },
    })
  } catch (error) {
    console.error("Error en registro de alumno:", error)
    return NextResponse.json({ error: "Error en el registro" }, { status: 500 })
  }
}
