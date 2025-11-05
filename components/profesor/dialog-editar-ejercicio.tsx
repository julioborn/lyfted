"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import type { Ejercicio } from "@/types"

const gruposMusculares = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Piernas",
  "Glúteos",
  "Abdominales",
  "Cardio",
  "Funcional",
  "Multiarticulares",
]

const subcategoriasMultiarticulares = [
  "Cargadas",
  "Arranque",
  "Envión",
  "Sentadillas",
  "Peso Muerto",
  "Clean & Jerk",
  "Snatch",
  "Otros",
]

interface DialogEditarEjercicioProps {
  ejercicio: Ejercicio
  abierto: boolean
  onOpenChange: (abierto: boolean) => void
  onEjercicioEditado?: () => void
}

export function DialogEditarEjercicio({
  ejercicio,
  abierto,
  onOpenChange,
  onEjercicioEditado,
}: DialogEditarEjercicioProps) {
  const [cargando, setCargando] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nombre: ejercicio.nombre,
    descripcion: ejercicio.descripcion,
    grupoMuscular: ejercicio.grupoMuscular,
    subcategoria: ejercicio.subcategoria || "",
    instrucciones: ejercicio.instrucciones || "",
  })

  useEffect(() => {
    setFormData({
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion,
      grupoMuscular: ejercicio.grupoMuscular,
      subcategoria: ejercicio.subcategoria || "",
      instrucciones: ejercicio.instrucciones || "",
    })
  }, [ejercicio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    let videoUrl = ejercicio.videoUrl
    if (videoFile) {
      videoUrl = URL.createObjectURL(videoFile)
    }

    const ejercicioActualizado: Partial<Ejercicio> = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      grupoMuscular: formData.grupoMuscular,
      subcategoria: formData.subcategoria || undefined,
      instrucciones: formData.instrucciones,
      videoUrl,
    }

    dataStore.actualizarEjercicio(ejercicio.id, ejercicioActualizado)

    setVideoFile(null)
    setCargando(false)
    onOpenChange(false)

    if (onEjercicioEditado) {
      onEjercicioEditado()
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ejercicio</DialogTitle>
          <DialogDescription>Modifica los datos del ejercicio</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Ejercicio *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Press de Banca"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grupoMuscular">Grupo Muscular *</Label>
              <Select
                value={formData.grupoMuscular}
                onValueChange={(value) => setFormData({ ...formData, grupoMuscular: value, subcategoria: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un grupo muscular" />
                </SelectTrigger>
                <SelectContent>
                  {gruposMusculares.map((grupo) => (
                    <SelectItem key={grupo} value={grupo}>
                      {grupo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.grupoMuscular === "Multiarticulares" && (
              <div className="space-y-2">
                <Label htmlFor="subcategoria">Subcategoría *</Label>
                <Select
                  value={formData.subcategoria}
                  onValueChange={(value) => setFormData({ ...formData, subcategoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoriasMultiarticulares.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                placeholder="Breve descripción del ejercicio"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrucciones">Instrucciones</Label>
              <Textarea
                id="instrucciones"
                placeholder="Instrucciones detalladas de cómo realizar el ejercicio..."
                value={formData.instrucciones}
                onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video Instructivo</Label>
              <div className="border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:border-primary transition-colors">
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="video" className="cursor-pointer">
                  <Upload className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {videoFile ? videoFile.name : ejercicio.videoUrl ? "Cambiar video" : "Subir video"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI (máx. 100MB)</p>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                cargando ||
                !formData.nombre ||
                !formData.grupoMuscular ||
                (formData.grupoMuscular === "Multiarticulares" && !formData.subcategoria)
              }
              className="w-full sm:w-auto"
            >
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
