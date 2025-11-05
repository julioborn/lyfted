"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { DialogNuevoEjercicio } from "@/components/profesor/dialog-nuevo-ejercicio"
import { CardEjercicio } from "@/components/profesor/card-ejercicio"
import type { Ejercicio } from "@/types"

const gruposMusculares = [
  "Todos",
  "Multiarticulares",
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Piernas",
  "Glúteos",
  "Abdominales",
  "Cardio",
]

export default function EjerciciosPage() {
  const { usuario } = useAuth()
  const [busqueda, setBusqueda] = useState("")
  const [grupoActivo, setGrupoActivo] = useState("Todos")
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])

  const cargarEjercicios = () => {
    const ejerciciosCargados = dataStore.getEjercicios(usuario?.id)
    setEjercicios(ejerciciosCargados)
  }

  useEffect(() => {
    cargarEjercicios()
  }, [usuario])

  const ejerciciosFiltrados = ejercicios.filter((ejercicio) => {
    const coincideBusqueda =
      ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejercicio.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (ejercicio.subcategoria && ejercicio.subcategoria.toLowerCase().includes(busqueda.toLowerCase()))
    const coincideGrupo = grupoActivo === "Todos" || ejercicio.grupoMuscular === grupoActivo
    return coincideBusqueda && coincideGrupo
  })

  const handleEliminar = (id: string) => {
    if (confirm("¿Eliminar este ejercicio?")) {
      dataStore.eliminarEjercicio(id)
      cargarEjercicios()
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Ejercicios</h1>
        <DialogNuevoEjercicio onEjercicioCreado={cargarEjercicios} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ejercicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={grupoActivo} onValueChange={setGrupoActivo}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1">
          {gruposMusculares.map((grupo) => (
            <TabsTrigger key={grupo} value={grupo} className="text-xs whitespace-nowrap">
              {grupo}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={grupoActivo} className="mt-4">
          {ejerciciosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-8 md:py-12 text-center text-muted-foreground">
                <p className="text-sm md:text-base">No hay ejercicios</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ejerciciosFiltrados.map((ejercicio) => (
                <CardEjercicio
                  key={ejercicio.id}
                  ejercicio={ejercicio}
                  onEliminar={handleEliminar}
                  onEditar={cargarEjercicios}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
