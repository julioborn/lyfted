"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { NavbarAlumno } from "@/components/alumno/navbar-alumno"

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const usuario = session?.user
  const router = useRouter()
  const pathname = usePathname()

  const cargando = status === "loading"

  useEffect(() => {
    if (cargando) return

    if (!usuario || usuario.tipo !== "alumno") {
      router.replace("/login")
      return
    }

    // Evitar bucles infinitos
    if (pathname.startsWith("/alumno/registro") && usuario.registroCompleto) {
      router.replace("/alumno/bienvenida")
      return
    }

    if (!usuario.registroCompleto && !pathname.startsWith("/alumno/registro")) {
      router.replace("/alumno/registro")
    }
  }, [usuario, cargando, pathname, router])

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

  if (!usuario || usuario.tipo !== "alumno") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar del alumno */}
      <NavbarAlumno />
      <main className="min-h-screen w-full p-0 m-0">{children}</main>
    </div>
  )
}
