"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { NavbarProfesor } from "@/components/profesor/navbar-profesor"
import LoaderGlobal from "@/components/LoaderGlobal"

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

  // ✅ LOADER GLOBAL CON LOGO LATIENDO
  if (status === "loading") {
    return <LoaderGlobal />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarProfesor />
      <main className="flex-1">{children}</main>
    </div>
  )
}
