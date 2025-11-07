"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
  const { data: session, status } = useSession()
const usuario = session?.user
  const [busqueda, setBusqueda] = useState("")
  const [grupoActivo, setGrupoActivo] = useState("Todos")
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [cargando, setCargando] = useState(true)

  // 🔹 Cargar ejercicios del backend de forma segura
  const cargarEjercicios = async () => {
    if (!usuario?.id) return
    setCargando(true)
    try {
      const result = await dataStore.getEjercicios(usuario.id)
      // 🔧 Validamos que el resultado sea un array
      if (Array.isArray(result)) {
        setEjercicios(result)
      } else if (result && typeof result === "object") {
        // Si viene un objeto, lo convertimos a array (por defensa)
        setEjercicios(Object.values(result))
      } else {
        setEjercicios([])
      }
    } catch (error) {
      console.error("❌ Error al cargar ejercicios:", error)
      setEjercicios([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarEjercicios()
  }, [usuario])

  // Si todavía está cargando
  if (cargando) {
    return <p className="text-center text-muted-foreground">Cargando ejercicios...</p>
  }

  // Siempre garantizamos que sea un array
  const ejerciciosArray = Array.isArray(ejercicios) ? ejercicios : []
  const ejerciciosFiltrados = ejerciciosArray.filter((ejercicio) => {
    const coincideBusqueda =
      ejercicio.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejercicio.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (ejercicio.subcategoria &&
        ejercicio.subcategoria.toLowerCase().includes(busqueda.toLowerCase()))
    const coincideGrupo =
      grupoActivo === "Todos" || ejercicio.grupoMuscular === grupoActivo
    return coincideBusqueda && coincideGrupo
  })

  const handleEliminar = async (id: string) => {
    if (!id) return alert("ID inválido del ejercicio.")

    if (confirm("¿Eliminar este ejercicio?")) {
      try {
        const res = await fetch(`/api/ejercicios/${id}`, { method: "DELETE" })
        if (!res.ok) throw new Error("No se pudo eliminar el ejercicio")

        alert("✅ Ejercicio eliminado correctamente")
        await cargarEjercicios()
      } catch (error) {
        console.error("❌ Error al eliminar ejercicio:", error)
        alert("Error al eliminar el ejercicio")
      }
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
              {ejerciciosFiltrados.map((ejercicio, index) => {
                const key = ejercicio.id || ejercicio._id?.toString() || `ejercicio-${index}`
                return (
                  <CardEjercicio
                    key={key}
                    ejercicio={ejercicio}
                    onEliminar={handleEliminar}
                    onEditar={cargarEjercicios}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
