import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Pago from "@/lib/models/Pago"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()

    const pago = await Pago.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    return NextResponse.json(pago)
  } catch (error) {
    console.error("Error al actualizar pago:", error)
    return NextResponse.json({ error: "Error al actualizar pago" }, { status: 500 })
  }
}
