"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Target, Weight, Ruler, Calendar } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import type { Alumno } from "@/types"

interface DialogDetalleAlumnoProps {
  alumno: Alumno
  abierto: boolean
  onCerrar: () => void
}

export function DialogDetalleAlumno({ alumno, abierto, onCerrar }: DialogDetalleAlumnoProps) {
  const planActual = alumno.planActualId ? dataStore.getPlan(alumno.planActualId) : null
  const pagosAlumno = dataStore.getPagos(alumno.id)
  const pagosPendientes = pagosAlumno.filter((p) => p.estado === "pendiente")
  const pagosPagados = pagosAlumno.filter((p) => p.estado === "pagado")
  const totalPagado = pagosPagados.reduce((sum, p) => sum + p.monto, 0)

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Alumno</DialogTitle>
          <DialogDescription>Información completa del alumno</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
              <AvatarFallback className="text-2xl">{alumno.nombre.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{alumno.nombre}</h3>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {alumno.email}
              </p>
            </div>
          </div>

          <Separator />

          {/* Datos Físicos */}
          <div>
            <h4 className="font-semibold mb-3">Datos Físicos</h4>
            <div className="grid grid-cols-2 gap-3">
              {alumno.peso && (
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="font-semibold">{alumno.peso} kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {alumno.altura && (
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Altura</p>
                        <p className="font-semibold">{alumno.altura} cm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Objetivo */}
          {alumno.objetivo && (
            <div>
              <h4 className="font-semibold mb-2">Objetivo</h4>
              <Card>
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
              <Card>
                <CardContent className="pt-4 pb-3">
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
                  <p className="text-sm">Sin plan asignado</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagos */}
          <div>
            <h4 className="font-semibold mb-2">Estado de Pagos</h4>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{pagosPendientes.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground">Pagados</p>
                  <p className="text-2xl font-bold text-green-600">{pagosPagados.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">${totalPagado}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
