"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"
import Link from "next/link"
import { DialogNuevoPlan } from "@/components/profesor/dialog-nuevo-plan"

export default function PlanificacionesPage() {
  const { data: session } = useSession()
  const usuario = session?.user

  const [planes, setPlanes] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  const cargarPlanes = async () => {
    try {
      const planesBD = await dataStore.getPlanes()
      const lista = Array.isArray(planesBD) ? planesBD : []

      const planesConAlumno = await Promise.all(
        lista.map(async (p) => {
          const alumno = await dataStore.getAlumno(p.alumnoId)
          return { ...p, alumnoNombre: alumno?.nombre ?? "Sin asignar" }
        })
      )

      setPlanes(planesConAlumno)
    } catch (e) {
      console.error("❌ Error al cargar planes:", e)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPlanes()
  }, [])

  const hoy = new Date()
  const activos = planes.filter(p => hoy >= new Date(p.fechaInicio) && hoy <= new Date(p.fechaFin))
  const porVencer = planes.filter(p => {
    const fin = new Date(p.fechaFin)
    const diff = Math.ceil((fin.getTime() - hoy.getTime()) / 86400000)
    return diff <= 7 && diff >= 0
  })
  const pendientes = planes.filter(p => new Date(p.fechaInicio) > hoy)

  return (
    <div
      className="
    space-y-6
    p-6
    w-full
    sm:w-[95%]
    lg:w-[90%]
    flex flex-col
    justify-start
    mx-auto
  "
    >
      <h1 className="text-3xl font-semibold text-[#1E3A5F] text-center lg:text-left">
        Planificaciones
      </h1>

      {/* BOTONES SUPERIORES */}
      <div className="grid grid-cols-2 gap-4">

        {/* CREAR PLAN */}
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-2xl h-32 flex items-center justify-center hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
          <DialogNuevoPlan onPlanCreado={cargarPlanes}>
            <button className="flex flex-col items-center text-[#1E3A5F]">
              <Plus className="h-8 w-8 mb-1" />
              <span className="font-semibold text-lg">Crear Plan</span>
            </button>
          </DialogNuevoPlan>
        </Card>

        {/* CREAR PLANTILLA */}
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-2xl h-32 flex items-center justify-center hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
          <button className="flex flex-col items-center text-[#1E3A5F]">
            <Plus className="h-8 w-8 mb-1" />
            <span className="font-semibold text-lg">Crear Plantilla</span>
          </button>
        </Card>
      </div>

      {/* 3 FILTROS */}
      <div className="grid grid-cols-3 gap-3">

        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Activos</span>
          <Badge className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs px-2 py-1">
            {activos.length}
          </Badge>
        </Card>

        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Por vencer</span>
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full text-xs px-2 py-1">
            {porVencer.length}
          </Badge>
        </Card>

        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Pendientes</span>
          <Badge className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-1">
            {pendientes.length}
          </Badge>
        </Card>

      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-12">
        {planes.map((plan) => {
          const fechaInicio = new Date(plan.fechaInicio)
          const fechaFin = new Date(plan.fechaFin)
          const progreso = plan.totalDias > 0
            ? Math.round((plan.diasCompletados / plan.totalDias) * 100)
            : 0

          return (
            <Card
              key={plan._id}
              className="bg-[#E8F1FF] border border-[#1E3A5F]/15 shadow-md rounded-2xl hover:shadow-lg hover:scale-[1.03] transition-all"
            >
              <CardContent className="p-4 flex flex-col gap-2">

                <h3 className="font-semibold text-[#1E3A5F] text-sm md:text-lg">
                  {plan.nombre}
                </h3>

                <p className="text-xs text-gray-600">{plan.alumnoNombre}</p>

                <p className="text-xs text-gray-600">
                  {fechaInicio.toLocaleDateString()} – {fechaFin.toLocaleDateString()}
                </p>

                <p className="text-xs text-gray-600">Progreso: {progreso}%</p>

                <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                  <Link href={`/profesor/planes/${plan._id}`}>
                    <Eye className="mr-2 h-3 w-3" /> Ver plan
                  </Link>
                </Button>

              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}
