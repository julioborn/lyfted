"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Target, Weight, Ruler, Calendar, IdCard, Phone, User, CalendarDays } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import type { Alumno, Pago, PlanEntrenamiento } from "@/types"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden" // 👈 Agregá este import arriba

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface DialogDetalleAlumnoProps {
  alumno: Alumno
  abierto: boolean
  onCerrar: () => void
}

export function DialogDetalleAlumno({ alumno, abierto, onCerrar }: DialogDetalleAlumnoProps) {
  const [planActual, setPlanActual] = useState<PlanEntrenamiento | null>(null)
  const [pagosAlumno, setPagosAlumno] = useState<Pago[]>([])
  const [cargando, setCargando] = useState(true)

  // 🧩 Cargar plan y pagos al abrir el diálogo
  useEffect(() => {
    if (!abierto || !alumno) return

    const fetchData = async () => {
      try {
        const pagos = await dataStore.getPagos(alumno._id?.toString() ?? alumno.id)
        setPagosAlumno(Array.isArray(pagos) ? pagos : [])

        const plan = alumno.planActualId ? await dataStore.getPlan(alumno.planActualId) : null
        setPlanActual(plan ?? null)
      } catch (error) {
        console.error("❌ Error al cargar detalle del alumno:", error)
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [abierto, alumno])

  const pagosPendientes = pagosAlumno.filter((p) => p.estado === "pendiente")
  const pagosPagados = pagosAlumno.filter((p) => p.estado === "pagado")
  const totalPagado = pagosPagados.reduce((sum, p) => sum + p.monto, 0)

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription>Alumno - Información General</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal + Datos personales JUNTOS */}
          <div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
                <AvatarFallback className="text-2xl">
                  {alumno.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-2xl font-bold">{alumno.nombre}</h3>
              </div>
            </div>

            {/* Acordeón pegado al nombre */}
            <Accordion type="single" collapsible className="w-full mt-2">
              <AccordionItem value="datos-personales">
                <AccordionTrigger className="text-md font-semibold">
                  <h4 className="font-semibold mb-2">Datos Personales</h4>
                </AccordionTrigger>

                <AccordionContent
                  className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200 rounded-xl p-4 mt-2"
                >
                  <div className="flex flex-col gap-2 text-sm">

                    {alumno.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">Email:</span>
                        {alumno.email}
                      </p>
                    )}

                    {alumno.dni && (
                      <p className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">DNI:</span>
                        {alumno.dni}
                      </p>
                    )}

                    {alumno.telefono && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">Teléfono:</span>
                        {alumno.telefono}
                      </p>
                    )}

                    {alumno.genero && (
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">Género:</span>
                        {alumno.genero.charAt(0).toUpperCase() + alumno.genero.slice(1)}
                      </p>
                    )}

                    {alumno.fechaNacimiento && (
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">Fecha de nacimiento:</span>
                        {new Date(alumno.fechaNacimiento).toLocaleDateString()}
                      </p>
                    )}

                  </div>
                </AccordionContent>

              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <Separator />

        {/* Objetivo */}
        {alumno.objetivo && (
          <div>
            <h4 className="font-semibold mb-2">Objetivo</h4>
            <Card className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{alumno.objetivo}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plan Actual */}
        <div>
          <h4 className="font-semibold mb-2">Plan de Entrenamiento</h4>
          {planActual ? (
            <Card className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200">
              <CardContent className="pt-4 pb-3 ">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{planActual.nombre}</p>
                    <Badge variant="default">
                      {planActual.diasCompletados}/{planActual.totalDias} días
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(planActual.fechaInicio).toLocaleDateString()}
                    </span>
                    <span>→</span>
                    <span>{new Date(planActual.fechaFin).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                {/* <p className="text-sm mb-3">Sin plan asignado</p> */}

                <button
                  onClick={() => {
                    // 👉 Abrís tu modal o lógica para crear plan
                    console.log("Crear Plan")
                  }}
                  className="bg-[#1E3A5F] 
        text-white font-semibold 
        px-4 py-2 
        rounded-lg 
        transition 
        shadow-[0_2px_6px_rgba(0,0,0,0.2)]
      "
                >
                  Crear Plan
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagos */}
        <div>
          <h4 className="font-semibold mb-2">Estado de Pagos</h4>
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-500">{pagosPendientes.length}</p>
              </CardContent>
            </Card>
            <Card className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Realizados</p>
                <p className="text-2xl font-bold text-green-600">{pagosPagados.length}</p>
              </CardContent>
            </Card>
            <Card className="shadow-[0_0_12px_rgba(0,0,0,0.15)] border border-gray-200">
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xs text-muted-foreground">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{totalPagado}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}
