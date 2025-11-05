"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye } from "lucide-react"
import { DialogNuevoPlan } from "@/components/profesor/dialog-nuevo-plan"
import type { PlanEntrenamiento } from "@/types"
import Link from "next/link"

export default function PlanesPage() {
  const { usuario } = useAuth()
  const [planes, setPlanes] = useState<(PlanEntrenamiento & { alumnoNombre?: string })[]>([])
  const [cargando, setCargando] = useState(true)

  // 🧩 Cargar planes y alumnos
  const cargarPlanes = async () => {
    try {
      const planesCargados = await dataStore.getPlanes()
      const lista = Array.isArray(planesCargados) ? planesCargados : []

      // 🔧 Traer nombres de alumnos asociados
      const planesConAlumno = await Promise.all(
        lista.map(async (plan) => {
          const alumno = await dataStore.getAlumno(plan.alumnoId)
          return { ...plan, alumnoNombre: alumno?.nombre ?? "Sin asignar" }
        })
      )

      setPlanes(planesConAlumno)
    } catch (error) {
      console.error("❌ Error al cargar planes:", error)
      setPlanes([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPlanes()
  }, [])

  if (cargando)
    return <p className="text-center text-muted-foreground">Cargando planes...</p>

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Planes de Entrenamiento</h1>
        <DialogNuevoPlan onPlanCreado={cargarPlanes} />
      </div>

      {planes.length === 0 ? (
        <Card>
          <CardContent className="py-8 md:py-12 text-center text-muted-foreground">
            <p className="text-sm md:text-base">No hay planes creados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {planes.map((plan, i) => {
            const progreso =
              plan.totalDias > 0
                ? Math.round((plan.diasCompletados / plan.totalDias) * 100)
                : 0
            const fechaInicio = new Date(plan.fechaInicio)
            const fechaFin = new Date(plan.fechaFin)
            const hoy = new Date()
            const estaActivo = hoy >= fechaInicio && hoy <= fechaFin

            return (
              <Card key={plan._id?.toString() || plan.id || i} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 md:pt-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-2 flex-1">
                      {plan.nombre}
                    </h3>
                    <Badge
                      variant={estaActivo ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {estaActivo ? "Activo" : "Finalizado"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="truncate">{plan.alumnoNombre}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-semibold">{progreso}%</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {fechaInicio.toLocaleDateString()} -{" "}
                      {fechaFin.toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-transparent"
                    size="sm"
                    variant="outline"
                  >
                    <Link href={`/profesor/planes/${plan._id}`}>
                      <Eye className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      Ver Plan
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
