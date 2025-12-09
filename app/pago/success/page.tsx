"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PagoSuccessPage() {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const payment_id = params.get("payment_id");
        if (!payment_id) return;

        const procesarPago = async () => {
            // 1) Obtener datos desde MercadoPago
            const mpRes = await fetch(
                `https://api.mercadopago.com/v1/payments/${payment_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN}`,
                    },
                }
            );

            const mpData = await mpRes.json();

            // 2) Recuperar external_reference con toda la info
            const datos = JSON.parse(mpData.external_reference);

            // 3) Crear profesor definitivo
            const crear = await fetch("/api/profesores/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            const creado = await crear.json();
            const profesorId = creado.profesorId;

            // 4) Activar plan
            await fetch("/api/profesores/activar-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profesorId,
                    plan: datos.plan,
                    payment_id,
                }),
            });

            // 5) Redirigir a login automático
            router.push("/login?pagook=true");
        };

        procesarPago();
    }, []);

    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-semibold">Procesando pago...</h2>
        </div>
    );
}
