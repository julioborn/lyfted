"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Inicio } from "@/components/Inicio"

export default function HomePage() {
  const { usuario, cargando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!cargando && usuario) {
      if (usuario.tipo === "profesor") {
        router.push("/profesor/dashboard")
      } else {
        router.push("/alumno/dashboard")
      }
    }
  }, [usuario, cargando, router])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si hay usuario, no mostramos nada (redirige)
  if (usuario) return null

  // Si no hay usuario, mostramos la nueva pantalla de inicio
  return <Inicio />
}
