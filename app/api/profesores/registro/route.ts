import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import Profesor from "@/lib/models/Profesor";

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const body = await req.json();

        const {
            nombre,
            apellido,
            dni,
            telefono,
            password,
            nombreGimnasio,
            email,
            ciudad,
            provincia,
            avatar,
            plan,
        } = body;

        // 🔎 Verificar si ya existe (reintentos de pago, refresh, etc.)
        let existente = await Profesor.findOne({ dni });

        if (existente) {
            return NextResponse.json({
                ok: true,
                profesorId: existente._id,
                existente: true
            });
        }

        // 🔐 Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🧾 Crear el nuevo profesor
        const nuevoProfesor = await Profesor.create({
            nombre,
            apellido,
            dni,
            telefono,
            password: hashedPassword,
            nombreGimnasio,
            email,
            ciudad,
            provincia,
            logo: avatar || null,
            registroCompleto: true,
            activo: false,        // Se activa recién cuando MercadoPago lo aprueba
            planSuscripcion: plan,
            metodoPago: "mercadopago",
        });

        return NextResponse.json({
            ok: true,
            profesorId: nuevoProfesor._id,
            creado: true,
        });

    } catch (error) {
        console.error("❌ Error al crear profesor:", error);
        return NextResponse.json(
            { error: "Error al registrar el profesor" },
            { status: 500 }
        );
    }
}
