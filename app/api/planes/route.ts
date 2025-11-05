import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Plan from "@/lib/models/Plan"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get("profesorId")
    const alumnoId = searchParams.get("alumnoId")

    const query: any = {}
    if (profesorId) query.profesorId = profesorId
    if (alumnoId) query.alumnoId = alumnoId

    const planes = await Plan.find(query).sort({ createdAt: -1 })
    return NextResponse.json(planes)
  } catch (error) {
    console.error("Error al obtener planes:", error)
    return NextResponse.json({ error: "Error al obtener planes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    const plan = await Plan.create(body)
    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error("Error al crear plan:", error)
    return NextResponse.json({ error: "Error al crear plan" }, { status: 500 })
  }
}
