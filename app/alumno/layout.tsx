"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { NavbarAlumno } from "@/components/alumno/navbar-alumno"

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { usuario, cargando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!cargando && (!usuario || usuario.tipo !== "alumno")) {
      router.push("/")
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

  if (!usuario || usuario.tipo !== "alumno") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarAlumno />
      <main className="container mx-auto p-4 md:p-6">{children}</main>
    </div>
  )
}
