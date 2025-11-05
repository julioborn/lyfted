"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { DialogNuevoPago } from "@/components/profesor/dialog-nuevo-pago"
import type { Pago } from "@/types"

export default function PagosPage() {
  const { usuario } = useAuth()
  const [pagos, setPagos] = useState<Pago[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "pagado" | "vencido">("todos")

  const cargarPagos = () => {
    const pagosCargados = dataStore.getPagos()
    setPagos(pagosCargados)
  }

  useEffect(() => {
    cargarPagos()
  }, [])

  const pagosFiltrados = pagos.filter((pago) => {
    const alumno = dataStore.getAlumno(pago.alumnoId)
    const coincideBusqueda =
      alumno?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      pago.concepto.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === "todos" || pago.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  const cambiarEstadoPago = (pagoId: string, nuevoEstado: "pendiente" | "pagado" | "vencido") => {
    const pago = pagos.find((p) => p.id === pagoId)
    if (pago) {
      pago.estado = nuevoEstado
      cargarPagos()
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pagado":
        return (
          <Badge variant="default" className="text-xs">
            Pagado
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="secondary" className="text-xs">
            Pendiente
          </Badge>
        )
      case "vencido":
        return (
          <Badge variant="destructive" className="text-xs">
            Vencido
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Pagos</h1>
        <DialogNuevoPago onPagoCreado={cargarPagos} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar pagos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as typeof filtroEstado)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="todos" className="text-xs flex-1 sm:flex-none">
            Todos
          </TabsTrigger>
          <TabsTrigger value="pendiente" className="text-xs flex-1 sm:flex-none">
            Pendientes
          </TabsTrigger>
          <TabsTrigger value="pagado" className="text-xs flex-1 sm:flex-none">
            Pagados
          </TabsTrigger>
          <TabsTrigger value="vencido" className="text-xs flex-1 sm:flex-none">
            Vencidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filtroEstado} className="mt-4">
          {pagosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-8 md:py-12 text-center text-muted-foreground">
                <p className="text-sm md:text-base">No hay pagos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pagosFiltrados.map((pago) => {
                const alumno = dataStore.getAlumno(pago.alumnoId)
                const fecha = new Date(pago.fecha)

                return (
                  <Card key={pago.id}>
                    <CardContent className="pt-3 md:pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base truncate">{alumno?.nombre}</h3>
                            {getEstadoBadge(pago.estado)}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{pago.concepto}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-muted-foreground mt-1">
                            <span>{fecha.toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="font-semibold text-foreground">${pago.monto.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:shrink-0">
                          {pago.estado !== "pagado" && (
                            <Button
                              size="sm"
                              onClick={() => cambiarEstadoPago(pago.id, "pagado")}
                              className="text-xs h-8 flex-1 sm:flex-none"
                            >
                              Marcar Pagado
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
