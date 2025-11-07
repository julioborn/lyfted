"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Inicio } from "@/components/Inicio"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 🚀 Redirección automática si el usuario ya está autenticado
  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session?.user) {
      if (session.user.tipo === "profesor") {
        router.push("/profesor/dashboard")
      } else {
        router.push("/alumno/dashboard")
      }
    }
  }, [status, session, router])

  // ⏳ Estado de carga
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // 👤 Si hay sesión, no mostramos nada (porque redirige)
  if (status === "authenticated") return null

  // 🏠 Si no hay usuario, mostramos la página de inicio
  return <Inicio />
}
