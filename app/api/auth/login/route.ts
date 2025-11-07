import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import Profesor from "@/lib/models/Profesor"

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_temporal"

export async function POST(req: Request) {
  try {
    await conectarDB()
    const { identificador, password, tipo } = await req.json()

    if (!identificador || !password || !tipo) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    let usuario
    if (tipo === "profesor") {
      usuario = await Profesor.findOne({ email: identificador })
    } else {
      usuario = await Alumno.findOne({ dni: identificador })
    }

    if (!usuario)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })

    const ok = await bcrypt.compare(password, usuario.password)
    if (!ok)
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })

    const token = jwt.sign(
      { rol: tipo, id: usuario._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const redirectTo =
      tipo === "profesor"
        ? "/profesor/dashboard"
        : usuario.registroCompleto
          ? "/alumno/dashboard"
          : "/alumno/registro"

    return NextResponse.json({
      usuario: { nombre: usuario.nombre, tipo },
      token,
      redirectTo,
    })
  } catch (error) {
    console.error("❌ Error en login:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
