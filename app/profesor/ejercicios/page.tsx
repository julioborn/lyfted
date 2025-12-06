"use client"

import { useState, useEffect } from "react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useRef } from "react"
import LoaderGlobal from "@/components/LoaderGlobal"

type CategoriaDB = {
  cp: string
  s1?: {
    nombre: string
    s2?: {
      nombre: string
      s3?: {
        nombre: string
        ej?: string[]
      }[]
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
  const [sub2Abierta, setSub2Abierta] = useState<string | null>(null)
  const [sub3Abierta, setSub3Abierta] = useState<string | null>(null)
  const contenidoRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (categoriaActiva && contenidoRef.current) {
      const timeout = setTimeout(() => {
        contenidoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [categoriaActiva])

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
              onClick={() => setCategoriaActiva(cat!.cp)} className={`
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
        <div
          ref={contenidoRef}
          className="bg-white rounded-2xl space-y-4"
        >

          <h2 className="text-xl font-semibold text-black">
            {categoriaSeleccionada.cp}
          </h2>

          {categoriaSeleccionada.s1?.map((s1) => (
            <div key={s1.nombre} className="border rounded-xl p-3 bg-[#E8F1FF]">

              {/* ====== NIVEL S1 ====== */}
              <button
                onClick={() =>
                  setSubAbierta(subAbierta === s1.nombre ? null : s1.nombre)
                }
                className="w-full flex justify-between items-center font-medium text-[#1E3A5F]"
              >
                {s1.nombre}
                <ChevronDown
                  className={`transition-transform ${subAbierta === s1.nombre ? "rotate-180" : ""}`}
                />
              </button>

              {subAbierta === s1.nombre && (
                <div className="mt-3 space-y-3 pl-2">

                  {/* ====== NIVEL S2 ====== */}
                  {s1.s2?.map((s2) => (
                    <div key={s2.nombre} className="border rounded-lg p-2 bg-gray-50">

                      <button
                        onClick={() =>
                          setSub2Abierta(sub2Abierta === s2.nombre ? null : s2.nombre)
                        }
                        className="w-full flex justify-between items-center text-sm font-semibold text-[#1E3A5F]"
                      >
                        {s2.nombre}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${sub2Abierta === s2.nombre ? "rotate-180" : ""}`}
                        />
                      </button>

                      {sub2Abierta === s2.nombre && (
                        <div className="mt-2 ml-2 space-y-2">

                          {/* ====== NIVEL S3 (también acordeón) ====== */}
                          {s2.s3 && s2.s3.length > 0 ? (
                            s2.s3.map((s3) => (
                              <div
                                key={s3.nombre}
                                className="border rounded-md p-2 bg-white"
                              >
                                <button
                                  onClick={() =>
                                    setSub3Abierta(sub3Abierta === s3.nombre ? null : s3.nombre)
                                  }
                                  className="w-full flex justify-between items-center text-xs font-semibold text-[#1E3A5F]"
                                >
                                  {s3.nombre}
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform ${sub3Abierta === s3.nombre ? "rotate-180" : ""}`}
                                  />
                                </button>

                                {sub3Abierta === s3.nombre && (
                                  <ul className="mt-2 ml-4 list-disc text-xs text-gray-600 space-y-1">
                                    {s3.ej?.map((ej) => (
                                      <li key={ej}>{ej}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))
                          ) : (
                            // Si el nivel s2 NO tiene s3 mostramos ejercicios directos
                            <ul className="ml-4 list-disc text-xs text-gray-600 space-y-1">
                              {s2.ej?.map((ej) => (
                                <li key={ej}>{ej}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* EJERCICIOS DIRECTOS EN s1 */}
                  {s1.ej && s1.ej.length > 0 && (
                    <ul className="ml-4 list-disc text-sm text-gray-600">
                      {s1.ej.map((ej) => (
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
