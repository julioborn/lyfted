"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { NavbarProfesor } from "@/components/profesor/navbar-profesor"

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const usuario = session?.user
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!usuario) router.push("/login")
    else if (usuario.tipo !== "profesor") router.push("/")
  }, [usuario, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarProfesor /> {/* 👈 acá */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
