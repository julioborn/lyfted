import { NextResponse } from "next/server"
import connectMongoDB from "@/lib/mongodb"
import CategoriaEjercicio from "@/lib/models/CategoriaEjercicio"

export async function GET() {
    try {
        await connectMongoDB()
        const categorias = await CategoriaEjercicio.find().sort({ cp: 1 })
        return NextResponse.json(categorias)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
    }
}
