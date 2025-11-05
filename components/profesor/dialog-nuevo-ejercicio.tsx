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
import { Plus, Upload } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
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

export function DialogNuevoEjercicio({ onEjercicioCreado }: { onEjercicioCreado?: () => void }) {
  const { usuario } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grupoMuscular: "",
    subcategoria: "",
    instrucciones: "",
  })

  async function subirVideoACloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir video a Cloudinary");
    const data = await res.json();
    return data.url; // Devuelve la URL pública del video
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    let videoUrl = ""
    if (videoFile) {
      videoUrl = await subirVideoACloudinary(videoFile)
    }

    const nuevoEjercicio: Ejercicio = {
      id: `ej${Date.now()}`,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      grupoMuscular: formData.grupoMuscular,
      subcategoria: formData.subcategoria || undefined,
      instrucciones: formData.instrucciones,
      videoUrl,
      profesorId: usuario?.id || "",
    }

    await dataStore.agregarEjercicio(nuevoEjercicio)

    setFormData({
      nombre: "",
      descripcion: "",
      grupoMuscular: "",
      subcategoria: "",
      instrucciones: "",
    })
    setVideoFile(null)
    setCargando(false)
    setAbierto(false)
    onEjercicioCreado?.()
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Ejercicio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ejercicio</DialogTitle>
          <DialogDescription>Agrega un nuevo ejercicio a tu biblioteca con video instructivo</DialogDescription>
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
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="video" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {videoFile ? videoFile.name : "Haz clic para subir un video"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI (máx. 100MB)</p>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
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
            >
              {cargando ? "Guardando..." : "Crear Ejercicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
