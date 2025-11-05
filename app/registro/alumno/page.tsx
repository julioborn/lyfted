"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"

export default function RegistroAlumnoPage() {
  const router = useRouter()
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setCargando(true)

    // Validar que el DNI existe en la base de datos (dado de alta por el profesor)
    const alumnoExistente = dataStore.obtenerAlumnoPorDni(dni)

    if (!alumnoExistente) {
      setError("DNI no encontrado. Contacta a tu profesor para que te dé de alta.")
      setCargando(false)
      return
    }

    if (alumnoExistente.password) {
      setError("Este DNI ya está registrado. Inicia sesión en su lugar.")
      setCargando(false)
      return
    }

    // Registrar al alumno con su contraseña
    const registroExitoso = await dataStore.registrarAlumno(dni, password)

    if (registroExitoso) {
      // Redirigir al formulario de bienvenida para completar datos
      router.push(`/bienvenida/alumno?dni=${dni}`)
    } else {
      setError("Error al registrar. Intenta nuevamente.")
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Dumbbell className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Registro de Alumno</CardTitle>
          <CardDescription>Ingresa tu DNI y crea tu contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                type="text"
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Ingresa el DNI que tu profesor registró para ti</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrarse"}
            </Button>

            <div className="text-center">
              <Link href="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
