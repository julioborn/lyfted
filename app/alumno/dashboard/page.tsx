"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle2, Play, DollarSign, MessageCircle, Dumbbell } from "lucide-react"
import { CronometroEntrenamiento } from "@/components/alumno/cronometro-entrenamiento"
import { VideoEjercicioPreview } from "@/components/video-ejercicio-preview"
import type { PlanEntrenamiento, Alumno } from "@/types"
import Link from "next/link"

export default function DashboardAlumnoPage() {
  const { data: session, status } = useSession()
const usuario = session?.user
  const alumno = usuario as Alumno
  const [planActual, setPlanActual] = useState<PlanEntrenamiento | null>(null)
  const [enSesion, setEnSesion] = useState(false)
  const [diaActualIndex, setDiaActualIndex] = useState<number | null>(null)
  const [mostrarPlan, setMostrarPlan] = useState(false)

  const cargarPlan = async () => {
    if (alumno.planActualId) {
      const plan = await dataStore.getPlan(alumno.planActualId)
      if (plan) {
        setPlanActual(plan)
        const primerDiaNoCompletado = plan.dias.findIndex((d) => !d.completado)
        if (primerDiaNoCompletado !== -1) {
          setDiaActualIndex(primerDiaNoCompletado)
        }
      }
    }
  }

  useEffect(() => {
    cargarPlan()
  }, [alumno])

  const handleIniciarSesion = () => {
    setEnSesion(true)
    setMostrarPlan(true)
  }

  const handleFinalizarSesion = async (duracion: number) => {
    if (planActual && diaActualIndex !== null) {
      const dia = planActual.dias[diaActualIndex]
      dia.completado = true
      dia.fechaCompletado = new Date().toISOString()
      dia.duracion = duracion

      planActual.diasCompletados += 1

      if (planActual?.id) {
        await dataStore.actualizarPlan(planActual.id, {
          dias: planActual.dias,
          diasCompletados: planActual.diasCompletados,
        })
      }

      setEnSesion(false)
      cargarPlan()
    }
  }

  const progreso =
    planActual && planActual.totalDias > 0 ? (planActual.diasCompletados / planActual.totalDias) * 100 : 0

  const pagosData = dataStore.getPagos()
  const pagos = Array.isArray(pagosData) ? pagosData.filter((p) => p.alumnoId === alumno.id) : []
  const pagosPendientes = pagos.filter((p) => p.estado === "pendiente").length

  const menuItems = [
    {
      titulo: "Mi Plan",
      descripcion: planActual ? `${planActual.diasCompletados}/${planActual.totalDias} días` : "Sin plan",
      icono: Dumbbell,
      onClick: () => setMostrarPlan(true),
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      disabled: !planActual,
    },
    {
      titulo: "Mis Pagos",
      descripcion: `${pagosPendientes} pendientes`,
      icono: DollarSign,
      href: "/alumno/pagos",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    // {
    //   titulo: "Mensajes",
    //   descripcion: "Contactar",
    //   icono: MessageCircle,
    //   href: "/alumno/mensajes",
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50 hover:bg-purple-100",
    // },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Hola, {usuario?.nombre}</h1>
        <p className="text-sm md:text-base text-muted-foreground">Bienvenido a tu espacio de entrenamiento</p>
      </div>

      {!mostrarPlan && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icono

            if (item.href) {
              // 🔹 Caso Link
              return (
                <Link key={item.titulo} href={item.href} className="block">
                  <Card
                    className={`${item.bgColor} border-none transition-all hover:scale-105 cursor-pointer h-full`}
                  >
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
            } else {
              // 🔹 Caso botón
              return (
                <button
                  key={item.titulo}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className="block w-full text-left"
                >
                  <Card
                    className={`${item.bgColor} border-none transition-all hover:scale-105 cursor-pointer h-full ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
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
                </button>
              )
            }
          })}
        </div>
      )}

      {mostrarPlan && planActual && (
        <>
          <Button variant="outline" onClick={() => setMostrarPlan(false)} className="mb-4" size="sm">
            Volver al menú
          </Button>

          {/* Estadísticas */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  Progreso Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {planActual.diasCompletados}/{planActual.totalDias}
                </div>
                <Progress value={progreso} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{planActual.diasCompletados}</div>
                <p className="text-xs text-muted-foreground mt-1">entrenamientos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  Restantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {planActual.totalDias - planActual.diasCompletados}
                </div>
                <p className="text-xs text-muted-foreground mt-1">entrenamientos</p>
              </CardContent>
            </Card>
          </div>

          {/* Cronómetro */}
          <CronometroEntrenamiento
            enSesion={enSesion}
            onIniciar={handleIniciarSesion}
            onFinalizar={handleFinalizarSesion}
          />

          {/* Plan actual */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg">{planActual.nombre}</CardTitle>
                <Badge variant="default">Activo</Badge>
              </div>
              {planActual.descripcion && (
                <p className="text-xs md:text-sm text-muted-foreground mt-2">{planActual.descripcion}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planActual.dias.map((dia, index) => (
                  <DiaCard key={dia.id} dia={dia} index={index} diaActualIndex={diaActualIndex} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!planActual && !mostrarPlan && (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <Dumbbell className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-base text-muted-foreground">No tienes un plan de entrenamiento asignado</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Contacta a tu profesor para que te asigne un plan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/** 🔹 Subcomponente para renderizar los días del plan */
async function DiaCard({ dia, index, diaActualIndex }: any) {
  const esProximo = index === diaActualIndex
  const ejerciciosDelDia = await Promise.all(
    dia.bloques.map((bloque: any) => dataStore.getEjercicio(bloque.ejercicioId))
  )

  return (
    <Card
      className={`${dia.completado ? "border-accent bg-accent/5" : ""} ${esProximo && !dia.completado ? "border-primary bg-primary/5" : ""
        }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div
              className={`rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center font-semibold text-sm shrink-0 ${dia.completado
                  ? "bg-accent text-accent-foreground"
                  : esProximo
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {dia.completado ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> : index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm md:text-base truncate">{dia.nombre}</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground">{dia.bloques.length} ejercicios</p>
            </div>
          </div>
          {esProximo && !dia.completado && (
            <Badge variant="default" className="gap-1 text-xs shrink-0">
              <Play className="h-3 w-3" />
              <span className="hidden sm:inline">Próximo</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {dia.bloques.map((bloque: any, bloqueIndex: number) => {
            const ejercicio = ejerciciosDelDia[bloqueIndex]
            return (
              <div
                key={bloqueIndex}
                className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm md:text-base truncate">
                      {ejercicio?.nombre || "Ejercicio no encontrado"}
                    </p>
                    {ejercicio?.videoUrl && (
                      <VideoEjercicioPreview
                        ejercicio={ejercicio}
                        trigger={
                          <Button variant="ghost" size="sm" className="h-6 px-2 shrink-0">
                            <Play className="h-3 w-3" />
                          </Button>
                        }
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 text-xs md:text-sm text-muted-foreground">
                    <span>{bloque.series} series</span>
                    <span>•</span>
                    <span>{bloque.repeticiones} reps</span>
                    {bloque.descanso && (
                      <>
                        <span>•</span>
                        <span>{bloque.descanso}</span>
                      </>
                    )}
                  </div>
                  {bloque.notas && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{bloque.notas}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {dia.completado && dia.fechaCompletado && (
          <div className="mt-3 pt-3 border-t text-xs md:text-sm text-muted-foreground">
            Completado el {new Date(dia.fechaCompletado).toLocaleDateString()}
            {dia.duracion && ` • Duración: ${dia.duracion} minutos`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
