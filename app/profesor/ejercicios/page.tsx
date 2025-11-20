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
import {
  Dumbbell,
  Activity,
  Zap,
  Target,
  CircleDot,
  Footprints,
} from "lucide-react"

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
  const { data: session } = useSession()
  const usuario = session?.user

  const [busqueda, setBusqueda] = useState("")
  const [grupoActivo, setGrupoActivo] = useState("Todos")
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [cargando, setCargando] = useState(true)

  const cargarEjercicios = async () => {
    if (!usuario?.id) return
    setCargando(true)

    try {
      const result = await dataStore.getEjercicios(usuario.id)
      setEjercicios(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("❌ Error:", error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarEjercicios()
  }, [usuario])

  const ejerciciosFiltrados = ejercicios.filter((e) => {
    const coincideBusqueda =
      e.nombre?.toLowerCase().includes(busqueda.toLowerCase())

    const coincideGrupo =
      grupoActivo === "Todos" || e.grupoMuscular === grupoActivo

    return coincideBusqueda && coincideGrupo
  })

  if (cargando) {
    return <p className="text-center text-muted-foreground">Cargando ejercicios...</p>
  }

  return (
    <div className="space-y-6 p-6 w-[90%] flex flex-col justify-center mx-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#1E3A5F] text-center lg:text-left">
          Ejercicios
        </h1>
        <DialogNuevoEjercicio onEjercicioCreado={cargarEjercicios} />
      </div>

      {/* 🔹 Categorías principales */}
      <div className="grid grid-cols-2 gap-4">

        {[
          {
            titulo: "Zona Media",
            descripcion: "Core, abdomen y estabilidad",
          },
          {
            titulo: "Movilidad",
            descripcion: "Flexibilidad y rango articular",
          },
          {
            titulo: "Pliometría",
            descripcion: "Saltos y potencia explosiva",
          },
          {
            titulo: "Lanzamientos",
            descripcion: "Potencia y coordinación",
          },
          {
            titulo: "Tren Superior",
            descripcion: "Pecho, espalda, brazos",
          },
          {
            titulo: "Tren Inferior",
            descripcion: "Piernas y glúteos",
          },
        ].map((item) => (
          <Card
            key={item.titulo}
            className="
            bg-[#E8F1FF]
            border border-[#1E3A5F]/15
            shadow-md hover:shadow-lg
            rounded-2xl
            cursor-pointer
            transition-all
            hover:scale-[1.03]
          "
          >
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-2 md:gap-3">

              <h3 className="font-semibold text-sm md:text-lg text-[#1E3A5F]">
                {item.titulo}
              </h3>

              {/* <p className="text-xs md:text-sm text-gray-600">
                {item.descripcion}
              </p> */}

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )

}
