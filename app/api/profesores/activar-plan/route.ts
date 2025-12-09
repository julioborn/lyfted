import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Profesor from "@/lib/models/Profesor";

export async function POST(req: Request) {
    await connectDB();

    const { profesorId, plan, payment_id } = await req.json();

    const cambios = {
        planSuscripcion: plan,
        metodoPago: "mercadopago",
        activo: true,
        limiteAlumnos: plan === "avanzado" ? 50 : 10,
        pagoId: payment_id,
    };

    await Profesor.findByIdAndUpdate(profesorId, cambios);

    return NextResponse.json({ ok: true });
}
