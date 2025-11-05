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
import { useAuth } from "@/lib/auth-context"
import type { PlanEntrenamiento } from "@/types"

interface DialogNuevoPlanProps {
  onPlanCreado?: () => void
}

export function DialogNuevoPlan({ onPlanCreado }: DialogNuevoPlanProps) {
  const { usuario } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)

  const alumnos = dataStore.getAlumnos(usuario?.id)

  const [formData, setFormData] = useState({
    alumnoId: "",
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    totalDias: 12,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    const nuevoPlan: PlanEntrenamiento = {
      id: `plan${Date.now()}`,
      alumnoId: formData.alumnoId,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      diasCompletados: 0,
      totalDias: formData.totalDias,
      dias: [],
    }

    dataStore.agregarPlan(nuevoPlan)

    // Actualizar el alumno con el plan actual
    const alumno = dataStore.getAlumno(formData.alumnoId)
    if (alumno) {
      alumno.planActualId = nuevoPlan.id
    }

    // Resetear formulario
    setFormData({
      alumnoId: "",
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      totalDias: 12,
    })
    setCargando(false)
    setAbierto(false)

    if (onPlanCreado) {
      onPlanCreado()
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Plan de Entrenamiento</DialogTitle>
          <DialogDescription>Crea un plan personalizado para tu alumno</DialogDescription>
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
              <Label htmlFor="nombre">Nombre del Plan *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Plan de Tonificación - Enero"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del plan y objetivos..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalDias">Total de Días de Entrenamiento *</Label>
              <Input
                id="totalDias"
                type="number"
                min="1"
                value={formData.totalDias}
                onChange={(e) => setFormData({ ...formData, totalDias: Number.parseInt(e.target.value) })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Número de entrenamientos que el alumno debe completar en este plan
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando || !formData.alumnoId || !formData.nombre}>
              {cargando ? "Creando..." : "Crear Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
