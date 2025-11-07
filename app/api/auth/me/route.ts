import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import conectarDB from "@/lib/mongodb"
import Alumno from "@/lib/models/Alumno"
import Profesor from "@/lib/models/Profesor"

export const runtime = "nodejs"

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_temporal"

export async function GET(req: Request) {
    try {
        await conectarDB()

        const cookie = req.headers.get("cookie")
        const token = cookie?.split("; ").find(c => c.startsWith("token="))?.split("=")[1]

        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const decoded: any = jwt.verify(token, JWT_SECRET)
        let usuario

        if (decoded.rol === "alumno") usuario = await Alumno.findById(decoded.id).lean()
        if (decoded.rol === "profesor") usuario = await Profesor.findById(decoded.id).lean()

        if (!usuario) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

        return NextResponse.json({ usuario }, { status: 200 })
    } catch (error) {
        console.error("❌ Error en /api/auth/me:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
