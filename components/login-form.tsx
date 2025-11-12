"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import RegistroPorPasos from "./RegistroPorPasos"
import RegistroProfesorPorPasos from "./RegistroProfesorPorPasos"

export default function LoginPorPasos({ tipo }: { tipo: "alumno" | "profesor" }) {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [modo, setModo] = useState<"login" | "registro" | null>(null)
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<any>(null)

  const siguiente = () => setPaso((p) => Math.min(p + 1, 3))
  const anterior = () => setPaso((p) => Math.max(p - 1, 1))

  // 🔍 Buscar alumno por DNI
  const handleBuscarAlumno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni) {
      setError("Por favor ingresá tu DNI.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/alumnos/by-dni?dni=${dni}`)
      const data = await res.json()
      if (!res.ok) {
        Swal.fire("❌", data.error || "Alumno no encontrado", "error")
        return
      }

      if (data.alumno.registroCompleto) {
        Swal.fire("ℹ️", "Este DNI ya está registrado. Usá tu contraseña para iniciar sesión.", "info")
        setModo("login")
        setPaso(2)
      } else {
        setAlumnoEncontrado(data.alumno)
        setModo("registro")
        setPaso(3)
      }
    } catch {
      Swal.fire("❌", "Error al buscar alumno", "error")
    } finally {
      setLoading(false)
    }
  }

  // 🔐 Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      identificador: dni,
      password,
      tipo,
    })

    setLoading(false)
    if (result?.error) {
      setError("DNI o contraseña incorrectos.")
      return
    }

    router.push(tipo === "profesor" ? "/profesor/dashboard" : "/alumno/dashboard")
  }

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white text-[#1E3A5F]">
      {/* 🔵 Halos azules de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute left-[-20%] top-0 w-[55%] h-full bg-linear-to-r from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>
        <div className="hidden sm:block absolute right-[-20%] top-0 w-[55%] h-full bg-linear-to-l from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>
        <div className="block sm:hidden absolute top-[-20%] left-0 w-full h-[50%] bg-linear-to-b from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
        <div className="block sm:hidden absolute bottom-[-20%] left-0 w-full h-[50%] bg-linear-to-t from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
      </div>

      <div className="relative mt-10 z-10 bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-md sm:max-w-2xl lg:max-w-2xl mx-4 border border-slate-100 text-center">
        {/* Logo superior */}
        <Image
          src="/logosinfondoazul.png"
          alt="Lyfted Logo"
          width={200}
          height={200}
          className="mx-auto" // 👈 margen mínimo o podés quitarlo directamente
          priority
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${paso}-${modo}`}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {/* 🔹 Paso 1 - Elegir acción */}
            {paso === 1 && (
              <>
                <h2 className="text-2xl font-semibold mb-2 mt-2">
                  {tipo === "profesor" ? "Bienvenido entrenador" : "Bienvenido alumno"}
                </h2>
                <p className="text-gray-600 text-sm mb-8">
                  Elegí una opción para continuar
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => {
                      setModo("login")
                      setPaso(2)
                    }}
                    className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 py-2 rounded-xl shadow-md transition-all"
                  >
                    Iniciar sesión
                  </Button>

                  <Button
                    onClick={() => {
                      setModo("registro")
                      setPaso(2)
                    }}
                    variant="outline"
                    className="w-full border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F]/10 py-2 rounded-xl shadow-md transition-all"
                  >
                    Registrarme
                  </Button>
                </div>
              </>
            )}

            {/* 🔹 Paso 2 - Iniciar sesión o buscar para registro */}
            {paso === 2 && modo === "login" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  {/* <Button variant="ghost" onClick={anterior}>
                    <ChevronLeft className="w-5 h-5 text-[#1E3A5F]" />
                  </Button> */}
                  <h2 className="text-2xl font-semibold flex-1">
                    Iniciar sesión
                  </h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>DNI</Label>
                    <Input
                      type="text"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      required
                      className="text-center text-lg"
                    />
                  </div>

                  <div>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-center text-lg"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 py-2 rounded-xl shadow-md transition-all"
                  >
                    {loading ? "Ingresando..." : "Entrar"}
                  </Button>
                </form>
              </>
            )}

            {paso === 2 && modo === "registro" && (
              <>
                {tipo === "profesor" ? (
                  // 🔹 Registro completo del profesor (sin búsqueda previa)
                  <RegistroProfesorPorPasos router={router} />
                ) : (
                  // 🔹 Registro de alumno (con búsqueda por DNI)
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-2xl font-semibold flex-1">
                        Registrate con tu DNI
                      </h2>
                    </div>

                    <form onSubmit={handleBuscarAlumno} className="space-y-4">
                      <div>
                        <Label>DNI</Label>
                        <Input
                          type="text"
                          value={dni}
                          onChange={(e) => setDni(e.target.value)}
                          required
                          className="text-center text-lg"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 py-2 rounded-xl shadow-md transition-all"
                      >
                        {loading ? "Buscando..." : "Continuar"}
                      </Button>
                    </form>
                  </>
                )}
              </>
            )}

            {/* 🔹 Paso 3 - Registro por pasos */}
            {paso === 3 && modo === "registro" && alumnoEncontrado && (
              <RegistroPorPasos
                alumnoEncontrado={alumnoEncontrado}
                identificador={dni}
                router={router}
                tipo={tipo} // 👈 agregado aquí
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
