"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { Dumbbell } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [emailProfesor, setEmailProfesor] = useState("")
  const [passwordProfesor, setPasswordProfesor] = useState("")
  const [dniAlumno, setDniAlumno] = useState("")
  const [passwordAlumno, setPasswordAlumno] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAuth()

  const handleSubmitProfesor = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    const exito = await iniciarSesion(emailProfesor, passwordProfesor, "profesor")

    if (!exito) {
      setError("Credenciales incorrectas")
    }

    setCargando(false)
  }

  const handleSubmitAlumno = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    const exito = await iniciarSesion(dniAlumno, passwordAlumno, "alumno")

    if (!exito) {
      setError("DNI o contraseña incorrectos")
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
          <CardTitle className="text-2xl">GymApp</CardTitle>
          <CardDescription>Plataforma de entrenamiento personalizado</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alumno" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alumno">Alumno</TabsTrigger>
              <TabsTrigger value="profesor">Profesor</TabsTrigger>
            </TabsList>

            <TabsContent value="alumno">
              <form onSubmit={handleSubmitAlumno} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dni-alumno">DNI</Label>
                  <Input
                    id="dni-alumno"
                    type="text"
                    placeholder="12345678"
                    value={dniAlumno}
                    onChange={(e) => setDniAlumno(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-alumno">Contraseña</Label>
                  <Input
                    id="password-alumno"
                    type="password"
                    placeholder="••••••••"
                    value={passwordAlumno}
                    onChange={(e) => setPasswordAlumno(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={cargando}>
                  {cargando ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  ¿Primera vez?{" "}
                  <Link href="/registro/alumno" className="text-primary hover:underline">
                    Registrate aquí
                  </Link>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="profesor">
              <form onSubmit={handleSubmitProfesor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-profesor">Email</Label>
                  <Input
                    id="email-profesor"
                    type="email"
                    placeholder="tu@email.com"
                    value={emailProfesor}
                    onChange={(e) => setEmailProfesor(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-profesor">Contraseña</Label>
                  <Input
                    id="password-profesor"
                    type="password"
                    placeholder="••••••••"
                    value={passwordProfesor}
                    onChange={(e) => setPasswordProfesor(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={cargando}>
                  {cargando ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  ¿Nuevo profesor?{" "}
                  <Link href="/registro/profesor" className="text-primary hover:underline">
                    Registrate aquí
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Usuarios de prueba:</p>
            <p className="text-muted-foreground">
              <strong>Profesor:</strong> profesor@gym.com
            </p>
            <p className="text-muted-foreground">
              <strong>Alumno:</strong> DNI: 12345678
            </p>
            <p className="text-muted-foreground mt-1 text-xs">(Cualquier contraseña funciona en modo demo)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
