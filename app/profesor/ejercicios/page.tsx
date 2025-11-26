"use client"

import { useState, useEffect } from "react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

type CategoriaDB = {
  cp: string
  s1?: {
    nombre: string
    s2?: {
      nombre: string
      ej?: string[]
    }[]
    ej?: string[]
  }[]
  ej?: string[]
}

export default function EjerciciosPage() {

  const [categorias, setCategorias] = useState<CategoriaDB[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)
  const [subAbierta, setSubAbierta] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const ordenCategorias = [
    "Movilidad",
    "Zona Media",
    "Pliometría",
    "Lanzamientos",
    "Activadores Olímpicos",
    "Activadores No Olímpicos",
    "Tren Superior",
    "Tren Inferior",
  ]

  useEffect(() => {
    const cargarCategorias = async () => {
      const data = await dataStore.getCategoriasEjercicios()
      setCategorias(data)
      setCargando(false)
    }
    cargarCategorias()
  }, [])

  useEffect(() => {
    console.log("CATEGORIAS REALES:", categorias)
  }, [categorias])

  if (cargando) {
    return <p className="text-center text-muted-foreground">Cargando categorías...</p>
  }

  const categoriaSeleccionada = categorias.find(c => c.cp === categoriaActiva)

  return (
    <div className="space-y-6 p-6 w-[90%] mx-auto">

      <h1 className="text-3xl font-semibold text-[#1E3A5F]">Ejercicios</h1>

      {/* CATEGORÍAS */}
      <div className="grid grid-cols-2 gap-4">
        {ordenCategorias
          .map(nombre => categorias.find(c => c.cp === nombre))
          .filter(Boolean)
          .map((cat) => (
            <Card
              key={cat!.cp}
              onClick={() => setCategoriaActiva(cat!.cp)}
              className={`
          cursor-pointer rounded-2xl transition-all
          ${categoriaActiva === cat!.cp
                  ? "bg-[#1E3A5F] text-white shadow-lg"
                  : "bg-[#E8F1FF] border border-[#1E3A5F]/15 hover:scale-[1.03]"
                }
        `}
            >
              <CardContent className="p-4 text-center font-semibold">
                {cat!.cp}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* CONTENIDO */}
      {categoriaSeleccionada && (
        <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">

          <h2 className="text-xl font-semibold text-[#1E3A5F]">
            {categoriaSeleccionada.cp}
          </h2>

          {categoriaSeleccionada.s1?.map((sub) => (
            <div key={sub.nombre} className="border rounded-xl p-3">

              <button
                onClick={() =>
                  setSubAbierta(subAbierta === sub.nombre ? null : sub.nombre)
                }
                className="w-full flex justify-between items-center font-medium text-[#1E3A5F]"
              >
                {sub.nombre}
                <ChevronDown
                  className={`transition-transform ${subAbierta === sub.nombre ? "rotate-180" : ""}`}
                />
              </button>

              {subAbierta === sub.nombre && (
                <div className="mt-3 space-y-3 pl-2">

                  {sub.s2?.map((s2) => (
                    <div key={s2.nombre}>
                      <h4 className="font-semibold text-sm">{s2.nombre}</h4>
                      <ul className="ml-4 list-disc text-sm text-gray-600">
                        {s2.ej?.map((ej) => (
                          <li key={ej}>{ej}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {sub.ej && sub.ej.length > 0 && (
                    <ul className="ml-4 list-disc text-sm text-gray-600">
                      {sub.ej.map((ej) => (
                        <li key={ej}>{ej}</li>
                      ))}
                    </ul>
                  )}

                </div>
              )}
            </div>
          ))}

          {/* EJERCICIOS DIRECTOS DE LA CATEGORÍA (sin subcategorías) */}
          {categoriaSeleccionada.ej && categoriaSeleccionada.ej.length > 0 && (
            <div className="space-y-2 border rounded-xl p-4">
              <h3 className="font-semibold text-[#1E3A5F]">
                Ejercicios
              </h3>
              <ul className="ml-4 list-disc text-sm text-gray-600 space-y-1">
                {categoriaSeleccionada.ej.map((ej) => (
                  <li key={ej}>{ej}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
