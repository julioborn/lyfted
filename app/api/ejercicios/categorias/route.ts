
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import CategoriaEjercicio from "@/lib/models/CategoriaEjercicio"

export async function GET() {
    await connectDB()
    const categorias = await CategoriaEjercicio.find()
    return NextResponse.json(categorias)
}
