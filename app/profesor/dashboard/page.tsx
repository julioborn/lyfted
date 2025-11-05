"use client"

import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, PlusCircle, DollarSign, UserPlus, Dumbbell } from "lucide-react"
import Link from "next/link"

export default function DashboardProfesorPage() {
  const { usuario } = useAuth()
  const alumnos = dataStore.getAlumnos(usuario?.id)
  const pagos = dataStore.getPagos()
  const planes = dataStore.getPlanes()

  const planesARenovar = planes.filter((plan) => {
    const diasRestantes = Math.ceil((new Date(plan.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return diasRestantes <= 7 && diasRestantes >= 0
  }).length

  const pagosPendientes = pagos.filter((p) => p.estado === "pendiente").length

  const menuItems = [
    {
      titulo: "Mis Alumnos",
      descripcion: `${alumnos.length} alumnos`,
      icono: Users,
      href: "/profesor/alumnos",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      titulo: "Planes a Renovar",
      descripcion: `${planesARenovar} planes`,
      icono: Clock,
      href: "/profesor/planes",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
    {
      titulo: "Crear Plan",
      descripcion: "Nuevo plan",
      icono: PlusCircle,
      href: "/profesor/planes",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      titulo: "Ejercicios",
      descripcion: "Biblioteca",
      icono: Dumbbell,
      href: "/profesor/ejercicios",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      titulo: "Pagos",
      descripcion: `${pagosPendientes} pendientes`,
      icono: DollarSign,
      href: "/profesor/pagos",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      titulo: "Nuevo Alumno",
      descripcion: "Agregar",
      icono: UserPlus,
      href: "/profesor/alumnos",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Panel de Control</h1>
        <p className="text-sm md:text-base text-muted-foreground">Bienvenido, {usuario?.nombre}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => {
          const Icon = item.icono
          return (
            <Link key={item.titulo} href={item.href}>
              <Card className={`${item.bgColor} border-none transition-all hover:scale-105 cursor-pointer h-full`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className={`${item.color} p-3 md:p-4 rounded-full bg-white/50`}>
                      <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base md:text-lg">{item.titulo}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{item.descripcion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
