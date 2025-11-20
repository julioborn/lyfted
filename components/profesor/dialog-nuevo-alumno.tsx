"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import type { Alumno } from "@/types"

export function DialogNuevoAlumno({ onAlumnoCreado }: { onAlumnoCreado?: () => void }) {
  const { data: session } = useSession()
  const usuario = session?.user

  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nivel: "principiante", // 👈 valor por defecto
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    const nuevoAlumno: Alumno = {
      id: `alumno${Date.now()}`,
      nombre: formData.nombre,
      apellido: formData.apellido,
      dni: formData.dni,
      telefono: "",
      email: "",
      fechaNacimiento: null,
      genero: null,
      ciudad: "",
      provincia: "",
      pais: "",
      objetivoPrincipal: null,
      lesiones: "",
      peso: null,
      altura: null,
      nivel: formData.nivel,
      estadoPlan: "sin_plan",
      tipo: "alumno",
      profesorId: usuario?.id || "",
      planActualId: null,
      registroCompleto: false,
      avatar: "/placeholder.svg?height=100&width=100",
      activo: true,
    }

    // 🧠 Guardado en tu sistema (local o backend)
    dataStore.agregarAlumno(nuevoAlumno)

    // limpiar formulario
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      nivel: "principiante",
    })

    setCargando(false)
    setAbierto(false)

    if (onAlumnoCreado) onAlumnoCreado()
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button className="bg-[#1E3A5F]">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Alumno
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dar de Alta Nuevo Alumno</DialogTitle>
          <DialogDescription>
            Completa los datos del alumno. Luego él podrá finalizar su registro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                type="text"
                placeholder="12345678"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
              />
            </div>

            {/* Nivel */}
            <div className="space-y-2">
              <Label htmlFor="nivel">Nivel</Label>
              <select
                id="nivel"
                className="border rounded-lg p-2 w-full"
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
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
                !formData.apellido ||
                !formData.dni
              }
            >
              {cargando ? "Guardando..." : "Dar de Alta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
