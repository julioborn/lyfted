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
  const { data: session, status } = useSession()
const usuario = session?.user
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    const nuevoAlumno: Alumno = {
      id: `alumno${Date.now()}`,
      nombre: formData.nombre,
      dni: formData.dni,
      tipo: "alumno",
      profesorId: usuario?.id || "",
      registroCompleto: false, // Indica que el alumno aún no completó su registro
      avatar: "/placeholder.svg?height=100&width=100",
    }

    dataStore.agregarAlumno(nuevoAlumno)

    setFormData({
      nombre: "",
      dni: "",
    })
    setCargando(false)
    setAbierto(false)

    if (onAlumnoCreado) {
      onAlumnoCreado()
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Alumno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dar de Alta Nuevo Alumno</DialogTitle>
          <DialogDescription>
            Ingresa el nombre completo y DNI del alumno. El alumno podrá registrarse usando su DNI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                type="text"
                placeholder="12345678"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando || !formData.nombre || !formData.dni}>
              {cargando ? "Guardando..." : "Dar de Alta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
