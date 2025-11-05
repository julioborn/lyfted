"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

type LoginFormProps = {
  tipo: "alumno" | "profesor"
}

export function LoginForm({ tipo }: LoginFormProps) {
  const router = useRouter()
  const [emailProfesor, setEmailProfesor] = useState("")
  const [passwordProfesor, setPasswordProfesor] = useState("")
  const [dniAlumno, setDniAlumno] = useState("")
  const [passwordAlumno, setPasswordAlumno] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identificador: tipo === "profesor" ? emailProfesor : dniAlumno,
          password: tipo === "profesor" ? passwordProfesor : passwordAlumno,
          tipo,
        }),
      })

      const data = await res.json()

      if (data.requiereRegistro) {
        router.push(`/registro/alumno?dni=${dniAlumno}`)
        return
      }

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión")
        return
      }

      await iniciarSesion(
        tipo === "profesor" ? emailProfesor : dniAlumno,
        tipo === "profesor" ? passwordProfesor : passwordAlumno,
        tipo
      )

      router.push(`/${tipo}/dashboard`)
    } catch (err) {
      setError("Error de conexión con el servidor")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          {/* Logo redondeado */}
          <div className="flex justify-center">
            <div className="shadow-md shadow-[#1E3A5F]/30 rounded-full overflow-hidden">
              <Image
                src="/logo-lyfted.png"
                alt="Lyfted Logo"
                width={110}
                height={110}
                className="object-cover object-center scale-125 rounded-full"
                priority
              />
            </div>
          </div>

          <CardTitle className="text-3xl font-SEMIBOLD text-[#1E3A5F]">
            LYFTED
          </CardTitle>

          <CardDescription className="text-gray-600 dark:text-gray-400">
            {tipo === "profesor"
              ? "Accedé a tu panel de gestión"
              : "Ingresá para ver tus entrenamientos"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tipo === "profesor" ? (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={emailProfesor}
                  onChange={(e) => setEmailProfesor(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>DNI</Label>
                <Input
                  type="text"
                  value={dniAlumno}
                  onChange={(e) => setDniAlumno(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={tipo === "profesor" ? passwordProfesor : passwordAlumno}
                onChange={(e) =>
                  tipo === "profesor"
                    ? setPasswordProfesor(e.target.value)
                    : setPasswordAlumno(e.target.value)
                }
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 transition-all font-semibold"
            >
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
