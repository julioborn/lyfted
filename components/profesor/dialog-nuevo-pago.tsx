"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import type { Pago } from "@/types"

interface DialogNuevoPagoProps {
  onPagoCreado?: () => void
}

export function DialogNuevoPago({ onPagoCreado }: DialogNuevoPagoProps) {
  const { data: session, status } = useSession()
const usuario = session?.user
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)

  const alumnos = dataStore.getAlumnos(usuario?.id)

  const [formData, setFormData] = useState({
    alumnoId: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    estado: "pendiente" as "pendiente" | "pagado" | "vencido",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    const nuevoPago: Pago = {
      id: `pago${Date.now()}`,
      alumnoId: formData.alumnoId,
      monto: Number.parseFloat(formData.monto),
      fecha: formData.fecha,
      concepto: formData.concepto,
      estado: formData.estado,
    }

    dataStore.agregarPago(nuevoPago)

    // Resetear formulario
    setFormData({
      alumnoId: "",
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      concepto: "",
      estado: "pendiente",
    })
    setCargando(false)
    setAbierto(false)

    if (onPagoCreado) {
      onPagoCreado()
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogDescription>Registra un pago o cuota de un alumno</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="alumno">Alumno *</Label>
              <Select
                value={formData.alumnoId}
                onValueChange={(value) => setFormData({ ...formData, alumnoId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un alumno" />
                </SelectTrigger>
                <SelectContent>
                  {alumnos.map((alumno) => (
                    <SelectItem key={alumno.id} value={alumno.id}>
                      {alumno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto">Monto *</Label>
              <Input
                id="monto"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concepto">Concepto *</Label>
              <Textarea
                id="concepto"
                placeholder="Ej: Mensualidad Enero 2025"
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "pendiente" | "pagado" | "vencido") =>
                  setFormData({ ...formData, estado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando || !formData.alumnoId || !formData.monto || !formData.concepto}>
              {cargando ? "Guardando..." : "Registrar Pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
