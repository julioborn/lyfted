import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Pago from "@/lib/models/Pago"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const profesorId = searchParams.get("profesorId")
    const alumnoId = searchParams.get("alumnoId")

    const query: any = {}
    if (profesorId) query.profesorId = profesorId
    if (alumnoId) query.alumnoId = alumnoId

    const pagos = await Pago.find(query).sort({ fechaVencimiento: -1 })
    return NextResponse.json(pagos)
  } catch (error) {
    console.error("Error al obtener pagos:", error)
    return NextResponse.json({ error: "Error al obtener pagos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    const pago = await Pago.create(body)
    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    console.error("Error al crear pago:", error)
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 })
  }
}
