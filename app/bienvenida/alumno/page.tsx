"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useSession } from "next-auth/react"

export default function BienvenidaAlumnoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { iniciarSesion } = const { data: session } = useSession()
  const dni = searchParams.get("dni")

  const [cargando, setCargando] = useState(false)
  const [formData, setFormData] = useState({
    telefono: "",
    email: "",
    fechaNacimiento: "",
    genero: "",
    objetivoPrincipal: "",
    lesiones: "",
  })

  useEffect(() => {
    if (!dni) {
      router.push("/")
    }
  }, [dni, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    if (!dni) return

    // Completar datos del alumno
    const exito = await dataStore.completarDatosAlumno(dni, {
      telefono: formData.telefono,
      email: formData.email,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero as "masculino" | "femenino" | "otro",
      objetivoPrincipal: formData.objetivoPrincipal as "fuerza" | "masa_muscular" | "rendimiento" | "salud",
      lesiones: formData.lesiones,
    })

    if (exito) {
      // Obtener la contraseña del alumno para iniciar sesión automáticamente
      const alumno = dataStore.obtenerAlumnoPorDni(dni)
      if (alumno?.password) {
        await iniciarSesion(dni, alumno.password, "alumno")
        router.push("/alumno/dashboard")
      }
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Dumbbell className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">¡Bienvenido!</CardTitle>
          <CardDescription>Completa tus datos personales para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+54 9 11 1234-5678"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Género *</Label>
                <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivoPrincipal">Objetivo Principal *</Label>
              <Select
                value={formData.objetivoPrincipal}
                onValueChange={(value) => setFormData({ ...formData, objetivoPrincipal: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuerza">Fuerza</SelectItem>
                  <SelectItem value="masa_muscular">Aumento de Masa Muscular</SelectItem>
                  <SelectItem value="rendimiento">Rendimiento Deportivo</SelectItem>
                  <SelectItem value="salud">Salud y Bienestar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesiones">Lesiones o Limitaciones</Label>
              <Textarea
                id="lesiones"
                placeholder="Describe cualquier lesión o limitación física que debamos tener en cuenta..."
                value={formData.lesiones}
                onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? "Guardando..." : "Completar Registro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
