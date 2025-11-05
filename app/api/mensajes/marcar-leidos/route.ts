import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Mensaje from "@/lib/models/Mensaje"

export async function PUT(request: Request) {
  try {
    await connectDB()
    const { profesorId, alumnoId, tipo } = await request.json()

    await Mensaje.updateMany(
      {
        profesorId,
        alumnoId,
        emisor: tipo === "profesor" ? "alumno" : "profesor",
        leido: false,
      },
      { leido: true },
    )

    return NextResponse.json({ message: "Mensajes marcados como leídos" })
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error)
    return NextResponse.json({ error: "Error al marcar mensajes" }, { status: 500 })
  }
}
