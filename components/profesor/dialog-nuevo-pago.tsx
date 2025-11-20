"use client"

import { useState, useEffect, ReactNode } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dataStore } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import type { Pago, Alumno } from "@/types"

interface DialogNuevoPagoProps {
  onPagoCreado?: () => void
  children: ReactNode
}

export function DialogNuevoPago({ onPagoCreado, children }: DialogNuevoPagoProps) {
  const { data: session } = useSession()
  const usuario = session?.user

  if (!usuario?.id) return null

  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])

  const [formData, setFormData] = useState({
    alumnoId: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    estado: "pendiente" as "pendiente" | "pagado" | "vencido",
  })

  useEffect(() => {
    dataStore.getAlumnos(usuario.id).then((lista) => {
      setAlumnos(Array.isArray(lista) ? lista : [])
    })
  }, [usuario.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const nuevoPago: Pago = {
        alumnoId: formData.alumnoId,
        monto: Number(formData.monto),
        fecha: formData.fecha,
        concepto: formData.concepto,
        estado: formData.estado,
      }

      await dataStore.agregarPago(nuevoPago)
      onPagoCreado?.()
      setAbierto(false)

      setFormData({
        alumnoId: "",
        monto: "",
        fecha: new Date().toISOString().split("T")[0],
        concepto: "",
        estado: "pendiente",
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registrar nuevo pago</DialogTitle>
          <DialogDescription>
            Ingresá los datos del pago del alumno
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            <div className="space-y-2">
              <Label>Alumno</Label>
              <Select
                value={formData.alumnoId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, alumnoId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar alumno" />
                </SelectTrigger>
                <SelectContent>
                  {alumnos.map((alumno) => (
                    <SelectItem key={alumno._id} value={alumno._id!}>
                      {alumno.nombre} {alumno.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Monto</Label>
              <Input
                type="number"
                value={formData.monto}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, monto: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fecha: e.target.value }))
                }
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label>Concepto *</Label>
              <Textarea
                value={formData.concepto}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, concepto: e.target.value }))
                }
                rows={2}
                required
              />
            </div> */}

            {/* <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    estado: value as any,
                  }))
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
            </div> */}

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#1E3A5F] hover:bg-[#1e3a5fce]" type="submit" disabled={cargando}>
              {cargando ? "Guardando..." : "Registrar Pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
