import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectDB();

        const datos = await req.json();
        const { nombre, apellido, email, telefono, dni, plan, ciudad, provincia, nombreGimnasio } = datos;

        const monto = plan === "avanzado" ? 4999 : 2999;
        const descripcion = `Membresía ${plan}`;

        // Guarda TODO para recuperarlo luego cuando MercadoPago vuelva
        const external_reference = JSON.stringify({
            nombre,
            apellido,
            email,
            telefono,
            dni,
            plan,
            ciudad,
            provincia,
            nombreGimnasio,
        });

        const body = {
            items: [
                {
                    title: descripcion,
                    quantity: 1,
                    unit_price: monto,
                },
            ],
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_URL}/pago/success`,
                failure: `${process.env.NEXT_PUBLIC_URL}/pago/error`,
            },
            auto_return: "approved",
            external_reference,
        };

        const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return NextResponse.json({ init_point: data.init_point });
    } catch (err) {
        console.error("❌ ERROR EN CREAR-PREFERENCIA:", err);
        return NextResponse.json({ error: "Error al crear pago" }, { status: 500 });
    }
}
