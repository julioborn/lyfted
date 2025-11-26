"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dumbbell,
  Calendar,
  MessageCircle,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import type { Alumno, PlanEntrenamiento, Pago } from "@/types"
import LoaderGlobal from "@/components/LoaderGlobal"

export default function DashboardAlumnoPage() {
  const { data: session, status } = useSession()
  const usuario = session?.user as Alumno

  const [planActual, setPlanActual] = useState<PlanEntrenamiento | null>(null)
  const [diaActualIndex, setDiaActualIndex] = useState<number | null>(null)
  const [pagosPendientes, setPagosPendientes] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (status === "loading" || !usuario) return

    const cargar = async () => {
      try {
        if (usuario.planActualId) {
          const plan = await dataStore.getPlan(usuario.planActualId)
          setPlanActual(plan ?? null)

          if (plan) {
            const primerDia = plan.dias.findIndex((d) => !d.completado)
            setDiaActualIndex(primerDia !== -1 ? primerDia : null)
          }
        }

        const allPagos = await dataStore.getPagos()
        const pagosAlumno = allPagos.filter((p: Pago) => p.alumnoId === usuario.id)
        setPagosPendientes(pagosAlumno.filter((p) => p.estado === "pendiente").length)
      } catch (e) {
        console.error("❌ Error en Dashboard Alumno:", e)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [usuario, status])

  if (cargando) {
    return <LoaderGlobal />
  }

  const cardBase =
    "h-full bg-[#E8F1FF] border border-[#1E3A5F]/15 shadow-md hover:shadow-lg rounded-2xl cursor-pointer transition-all hover:scale-[1.03]"

  const iconBase =
    "p-4 bg-white rounded-full shadow-sm border border-[#1E3A5F]/10"

  return (
    <div className="space-y-6 p-6 w-[90%] flex flex-col justify-center mx-auto">
      {/* TÍTULO */}
      <div>
        <h1 className="text-3xl font-semibold text-[#1E3A5F] mb-0 leading-none">
          Inicio
        </h1>
        <p className="text-sm text-gray-600 -mt-px leading-none">
          Bienvenido, <span className="font-semibold">{usuario?.nombre}</span>
        </p>
      </div>

      {/* GRID 2x2 */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 mt-2">
        {/* MI PLAN */}
        <Link href="#" className="h-full block">
          <Card className={cardBase}>
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">

              <div className={iconBase}>
                <Dumbbell className="h-7 w-7 text-[#1E3A5F]" />
              </div>

              <h3 className="font-semibold text-md text-[#1E3A5F]">Mi Plan</h3>

              <p className="text-sm text-gray-600 hidden sm:block">
                {planActual
                  ? `${planActual.diasCompletados}/${planActual.totalDias} días`
                  : "Sin plan asignado"}
              </p>

            </CardContent>
          </Card>
        </Link>

        {/* PRÓXIMO ENTRENAMIENTO */}
        <Link href="#" className="h-full block">
          <Card className={cardBase}>
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">

              <div className={iconBase}>
                <Calendar className="h-7 w-7 text-[#1E3A5F]" />
              </div>

              <h3 className="font-semibold text-md text-[#1E3A5F]">
                Entrenamiento
              </h3>

              <p className="text-sm text-gray-600 hidden sm:block">
                {planActual && diaActualIndex !== null
                  ? planActual.dias[diaActualIndex]?.nombre
                  : "Registrar"}
              </p>

            </CardContent>
          </Card>
        </Link>

        {/* ENTRENADOR */}
        <Link href="/alumno/contacto" className="h-full block">
          <Card className={cardBase}>
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">

              <div className={iconBase}>
                <MessageCircle className="h-7 w-7 text-[#1E3A5F]" />
              </div>

              <h3 className="font-semibold text-md text-[#1E3A5F]">
                Entrenador
              </h3>

              <p className="text-sm text-gray-600 hidden sm:block">
                Mensajes / WhatsApp
              </p>

            </CardContent>
          </Card>
        </Link>

        {/* SUSCRIPCIÓN */}
        <Link href="/alumno/pagos" className="h-full block">
          <Card className={cardBase}>
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">

              <div className={iconBase}>
                <DollarSign className="h-7 w-7 text-[#1E3A5F]" />
              </div>

              <h3 className="font-semibold text-md text-[#1E3A5F]">Suscripción</h3>

              <p className="text-sm text-gray-600 hidden sm:block">
                {pagosPendientes} pagos pendientes
              </p>

            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  )
}
