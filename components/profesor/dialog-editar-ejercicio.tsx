"use client"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
        nombre: "",
        descripcion: "",
        grupoMuscular: "",
        subcategoria: "",
        instrucciones: "",
    })

    // 🧩 Cargar datos iniciales del ejercicio al abrir el modal
    useEffect(() => {
        if (ejercicio) {
            setFormData({
                nombre: ejercicio.nombre || "",
                descripcion: ejercicio.descripcion || "",
                grupoMuscular: ejercicio.grupoMuscular || "",
                subcategoria: ejercicio.subcategoria || "",
                instrucciones: ejercicio.instrucciones || "",
            })
        }
    }, [ejercicio])

    // 🔹 Subir video a Cloudinary si se selecciona uno nuevo
    async function subirVideoACloudinary(file: File): Promise<string> {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        if (!res.ok) throw new Error("Error al subir video a Cloudinary")
        const data = await res.json()
        return data.url // URL pública del video
    }

    // 💾 Guardar cambios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setCargando(true)

        try {
            let videoUrl = ejercicio.videoUrl || ""
            if (videoFile) {
                videoUrl = await subirVideoACloudinary(videoFile)
            }

            const ejercicioActualizado: Partial<Ejercicio> = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                grupoMuscular: formData.grupoMuscular,
                subcategoria: formData.subcategoria || undefined,
                instrucciones: formData.instrucciones,
                videoUrl,
            }

            await dataStore.actualizarEjercicio(ejercicio.id || ejercicio._id?.toString() || "", ejercicioActualizado)
            
            setVideoFile(null)
            setCargando(false)
            onOpenChange(false)
            onEjercicioEditado?.()
        } catch (error) {
            console.error("❌ Error al actualizar ejercicio:", error)
            setCargando(false)
        }
    }

    return (
        <Dialog open={abierto} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Ejercicio</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del ejercicio y actualiza su video instructivo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Nombre */}
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

                        {/* Grupo Muscular */}
                        <div className="space-y-2">
                            <Label htmlFor="grupoMuscular">Grupo Muscular *</Label>
                            <Select
                                value={formData.grupoMuscular}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, grupoMuscular: value, subcategoria: "" })
                                }
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

                        {/* Subcategoría */}
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

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input
                                id="descripcion"
                                placeholder="Breve descripción del ejercicio"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                            />
                        </div>

                        {/* Instrucciones */}
                        <div className="space-y-2">
                            <Label htmlFor="instrucciones">Instrucciones</Label>
                            <Textarea
                                id="instrucciones"
                                placeholder="Instrucciones detalladas..."
                                value={formData.instrucciones}
                                onChange={(e) =>
                                    setFormData({ ...formData, instrucciones: e.target.value })
                                }
                                rows={4}
                            />
                        </div>

                        {/* Video */}
                        <div className="space-y-2">
                            <Label htmlFor="video">Video Instructivo</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                                <input
                                    id="video"
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <label htmlFor="video" className="cursor-pointer">
                                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {videoFile
                                            ? videoFile.name
                                            : ejercicio.videoUrl
                                                ? "Cambiar video"
                                                : "Subir video"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        MP4, MOV, AVI (máx. 100MB)
                                    </p>
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                cargando ||
                                !formData.nombre ||
                                !formData.grupoMuscular ||
                                (formData.grupoMuscular === "Multiarticulares" &&
                                    !formData.subcategoria)
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
