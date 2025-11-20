"use client"

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
import { useSession } from "next-auth/react"
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

export function DialogNuevoEjercicio({ onEjercicioCreado }: { onEjercicioCreado?: () => void }) {
  const { data: session } = useSession()
  const usuario = session?.user

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
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    })

    if (!res.ok) throw new Error("Error al subir video")
    const data = await res.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario?.id) return

    setCargando(true)

    try {
      let videoUrl = ""
      if (videoFile) {
        videoUrl = await subirVideoACloudinary(videoFile)
      }

      const nuevoEjercicio: Partial<Ejercicio> = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        grupoMuscular: formData.grupoMuscular,
        subcategoria: formData.subcategoria || undefined,
        instrucciones: formData.instrucciones,
        videoUrl,

        // ✅ Nuevo sistema
        origen: "profesor",
        profesorId: usuario.id,
      }

      await dataStore.agregarEjercicio(nuevoEjercicio as Ejercicio)

      setFormData({
        nombre: "",
        descripcion: "",
        grupoMuscular: "",
        subcategoria: "",
        instrucciones: "",
      })
      setVideoFile(null)
      setAbierto(false)
      onEjercicioCreado?.()
    } catch (error) {
      console.error("❌ Error al crear ejercicio:", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ejercicio</DialogTitle>
          <DialogDescription>
            Este ejercicio será personalizado para tu cuenta y no afectará los ejercicios base.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre *</Label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Grupo Muscular *</Label>
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
            <div>
              <Label>Subcategoría *</Label>
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

          <div>
            <Label>Descripción</Label>
            <Input
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div>
            <Label>Instrucciones</Label>
            <Textarea
              value={formData.instrucciones}
              onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
            />
          </div>

          <div>
            <Label>Video (opcional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="hidden"
                id="video"
              />
              <label htmlFor="video" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">
                  {videoFile ? videoFile.name : "Subir video"}
                </p>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando || !formData.nombre || !formData.grupoMuscular}>
              {cargando ? "Guardando..." : "Crear Ejercicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}