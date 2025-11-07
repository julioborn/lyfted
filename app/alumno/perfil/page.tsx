"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Save, X } from "lucide-react"
import type { Alumno } from "@/types"
import { dataStore } from "@/lib/data-store"

export default function PerfilAlumnoPage() {
  const { data: session, status } = useSession()
const usuario = session?.user
  const alumno = usuario as Alumno
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(false)

  const [formData, setFormData] = useState({
    telefono: alumno.telefono || "",
    email: alumno.email || "",
    fechaNacimiento: alumno.fechaNacimiento || "",
    genero: alumno.genero || "",
    objetivoPrincipal: alumno.objetivoPrincipal || "",
    lesiones: alumno.lesiones || "",
  })

  const handleGuardar = async () => {
    setCargando(true)

    dataStore.actualizarAlumno(alumno.id, {
      telefono: formData.telefono,
      email: formData.email,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero as "masculino" | "femenino" | "otro",
      objetivoPrincipal: formData.objetivoPrincipal as "fuerza" | "masa_muscular" | "rendimiento" | "salud",
      lesiones: formData.lesiones,
    })

    setCargando(false)
    setEditando(false)
    window.location.reload()
  }

  const handleCancelar = () => {
    setFormData({
      telefono: alumno.telefono || "",
      email: alumno.email || "",
      fechaNacimiento: alumno.fechaNacimiento || "",
      genero: alumno.genero || "",
      objetivoPrincipal: alumno.objetivoPrincipal || "",
      lesiones: alumno.lesiones || "",
    })
    setEditando(false)
  }

  const getObjetivoTexto = (objetivo: string) => {
    const objetivos: Record<string, string> = {
      fuerza: "Fuerza",
      masa_muscular: "Aumento de Masa Muscular",
      rendimiento: "Rendimiento Deportivo",
      salud: "Salud y Bienestar",
    }
    return objetivos[objetivo] || objetivo
  }

  const getGeneroTexto = (genero: string) => {
    const generos: Record<string, string> = {
      masculino: "Masculino",
      femenino: "Femenino",
      otro: "Otro",
    }
    return generos[genero] || genero
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Mi Perfil</h1>
        {!editando ? (
          <Button onClick={() => setEditando(true)} size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleGuardar} disabled={cargando} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={handleCancelar} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
              <AvatarFallback className="text-xl md:text-2xl">{alumno.nombre.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg md:text-xl">{alumno.nombre}</CardTitle>
              <p className="text-sm text-muted-foreground">DNI: {alumno.dni}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editando ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Género</Label>
                  <Select
                    value={formData.genero}
                    onValueChange={(value) => setFormData({ ...formData, genero: value })}
                  >
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
                <Label htmlFor="objetivoPrincipal">Objetivo Principal</Label>
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
                  value={formData.lesiones}
                  onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{alumno.telefono || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold">{alumno.email || "No especificado"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                  <p className="font-semibold">
                    {alumno.fechaNacimiento
                      ? new Date(alumno.fechaNacimiento).toLocaleDateString("es-AR")
                      : "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Género</p>
                  <p className="font-semibold">{alumno.genero ? getGeneroTexto(alumno.genero) : "No especificado"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Objetivo Principal</p>
                <p className="font-semibold">
                  {alumno.objetivoPrincipal ? getObjetivoTexto(alumno.objetivoPrincipal) : "No especificado"}
                </p>
              </div>

              {alumno.lesiones && (
                <div>
                  <p className="text-xs text-muted-foreground">Lesiones o Limitaciones</p>
                  <p className="text-sm">{alumno.lesiones}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
