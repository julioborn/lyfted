import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Plan from "@/lib/models/Plan"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const plan = await Plan.findById(params.id)

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error al obtener plan:", error)
    return NextResponse.json({ error: "Error al obtener plan" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()

    const plan = await Plan.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error al actualizar plan:", error)
    return NextResponse.json({ error: "Error al actualizar plan" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const plan = await Plan.findByIdAndDelete(params.id)

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Plan eliminado" })
  } catch (error) {
    console.error("Error al eliminar plan:", error)
    return NextResponse.json({ error: "Error al eliminar plan" }, { status: 500 })
  }
}
