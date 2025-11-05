"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, User, Dumbbell, CheckCircle2 } from "lucide-react"
import { DialogAgregarDia } from "@/components/profesor/dialog-agregar-dia"
import type { PlanEntrenamiento } from "@/types"

export default function DetallePlanPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string

  const [plan, setPlan] = useState<PlanEntrenamiento | null>(null)

  const cargarPlan = () => {
    const planCargado = dataStore.getPlan(planId)
    if (planCargado) {
      setPlan(planCargado)
    }
  }

  useEffect(() => {
    cargarPlan()
  }, [planId])

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando plan...</p>
      </div>
    )
  }

  const alumno = dataStore.getAlumno(plan.alumnoId)
  const progreso = plan.totalDias > 0 ? (plan.diasCompletados / plan.totalDias) * 100 : 0
  const fechaInicio = new Date(plan.fechaInicio)
  const fechaFin = new Date(plan.fechaFin)
  const hoy = new Date()
  const estaActivo = hoy >= fechaInicio && hoy <= fechaFin

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{plan.nombre}</h1>
          <p className="text-muted-foreground">Plan de entrenamiento detallado</p>
        </div>
        <Badge variant={estaActivo ? "default" : "secondary"} className="text-sm">
          {estaActivo ? "Activo" : "Finalizado"}
        </Badge>
      </div>

      {/* Información del plan */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Alumno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{alumno?.nombre}</p>
            <p className="text-sm text-muted-foreground">{alumno?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{fechaInicio.toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">hasta {fechaFin.toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {plan.diasCompletados}/{plan.totalDias} días
            </p>
            <Progress value={progreso} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {plan.descripcion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plan.descripcion}</p>
          </CardContent>
        </Card>
      )}

      {/* Días de entrenamiento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Días de Entrenamiento</CardTitle>
            <DialogAgregarDia planId={planId} onDiaAgregado={cargarPlan} />
          </div>
        </CardHeader>
        <CardContent>
          {plan.dias.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No hay días de entrenamiento configurados</p>
              <p className="text-sm mt-2">Agrega el primer día para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plan.dias.map((dia, index) => {
                const ejerciciosDelDia = dia.bloques.map((bloque) => dataStore.getEjercicio(bloque.ejercicioId))

                return (
                  <Card key={dia.id} className={dia.completado ? "border-accent" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-base">{dia.nombre}</CardTitle>
                            <p className="text-sm text-muted-foreground">{dia.bloques.length} ejercicios</p>
                          </div>
                        </div>
                        {dia.completado && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completado
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dia.bloques.map((bloque, bloqueIndex) => {
                          const ejercicio = ejerciciosDelDia[bloqueIndex]

                          return (
                            <div key={bloqueIndex} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <div className="flex-1">
                                <p className="font-medium">{ejercicio?.nombre || "Ejercicio no encontrado"}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span>{bloque.series} series</span>
                                  <span>•</span>
                                  <span>{bloque.repeticiones} reps</span>
                                  {bloque.descanso && (
                                    <>
                                      <span>•</span>
                                      <span>{bloque.descanso} descanso</span>
                                    </>
                                  )}
                                </div>
                                {bloque.notas && <p className="text-xs text-muted-foreground mt-1">{bloque.notas}</p>}
                              </div>
                              <Badge variant="secondary">{ejercicio?.grupoMuscular}</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
