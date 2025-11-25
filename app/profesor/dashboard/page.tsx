"use client"

import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, DollarSign, Dumbbell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Alumno, PlanEntrenamiento, Pago } from "@/types"

export default function DashboardProfesorPage() {
  const { data: session, status } = useSession()
  const usuario = session?.user

  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [planes, setPlanes] = useState<PlanEntrenamiento[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (status === "loading" || !usuario) return

    const fetchData = async () => {
      try {
        const [alumnosData, pagosData, planesData] = await Promise.all([
          dataStore.getAlumnos(usuario.id),
          dataStore.getPagos(),
          dataStore.getPlanes(),
        ])

        setAlumnos(Array.isArray(alumnosData) ? alumnosData : [])
        setPagos(Array.isArray(pagosData) ? pagosData : [])
        setPlanes(Array.isArray(planesData) ? planesData : [])
      } catch (error) {
        console.error("❌ Error al cargar datos del dashboard:", error)
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [usuario, status])

  if (status === "loading" || cargando) {
    return <p className="p-6 text-center text-gray-600">Cargando...</p>
  }

  // 🔢 Cálculos
  const planesARenovar = planes.filter((plan) => {
    if (!plan?.fechaFin) return false
    const diasRestantes = Math.ceil(
      (new Date(plan.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return diasRestantes <= 7 && diasRestantes >= 0
  }).length

  const pagosPendientes = pagos.filter((p) => p.estado === "pendiente").length

  const bubbleBase =
    "absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md sm:hidden"

  const menuItems = [
    {
      titulo: "Alumnos",
      descripcion: `${alumnos.length} alumnos`,
      icono: Users,
      href: "/profesor/alumnos",
      notificacion: alumnos.length,
    },
    {
      titulo: "Planificaciones",
      descripcion: `${planesARenovar} planes`,
      icono: Clock,
      href: "/profesor/planes",
      notificacion: planesARenovar,
    },
    {
      titulo: "Ejercicios",
      descripcion: "Biblioteca",
      icono: Dumbbell,
      href: "/profesor/ejercicios",
      notificacion: 0,
    },
    {
      titulo: "Pagos",
      descripcion: `${pagosPendientes} pendientes`,
      icono: DollarSign,
      href: "/profesor/pagos",
      notificacion: pagosPendientes,
    },
  ]

  return (
    <div className="space-y-6 p-6 w-[90%] flex flex-col justify-center mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-[#1E3A5F]">Inicio</h1>
        <p className="text-sm text-gray-600">
          Bienvenido, <span className="font-semibold">{usuario?.nombre || "Profesor"}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {menuItems.map((item) => {
          const Icon = item.icono

          return (
            <Link key={item.titulo} href={item.href} className="h-full">
              <Card
                className="
      relative
      bg-[#E8F1FF]
      border border-[#1E3A5F]/15
      shadow-md hover:shadow-lg
      rounded-2xl
      cursor-pointer
      transition-all
      hover:scale-[1.03]
    "
              >
                {/* 🔴 GLOBITO MOBILE */}
                {item.notificacion > 0 && (
                  <span className="
        absolute
        top-1
        right-1
        bg-red-600
        text-white
        text-xs
        font-semibold
        rounded-full
        px-2 py-1
        shadow-md
        sm:hidden
      ">
                    {item.notificacion}
                  </span>
                )}

                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-2 md:gap-3">
                  <div className="p-3 md:p-4 bg-white rounded-full shadow-sm border border-[#1E3A5F]/10">
                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-[#1E3A5F]" />
                  </div>

                  <h3 className="font-semibold text-sm md:text-lg text-[#1E3A5F]">
                    {item.titulo}
                  </h3>

                  <p className="hidden sm:block text-xs md:text-sm text-gray-600">
                    {item.descripcion}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
