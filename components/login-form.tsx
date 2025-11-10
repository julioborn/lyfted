"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import RegistroPorPasos from "./RegistroPorPasos"
import RegistroProfesorPorPasos from "./profesor/RegistroProfesorPorPasos"

export function LoginForm({ tipo }: { tipo: "alumno" | "profesor" }) {
  const router = useRouter()
  const [identificador, setIdentificador] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [genero, setGenero] = useState("")
  const [objetivoPrincipal, setObjetivoPrincipal] = useState("")
  const [lesiones, setLesiones] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<any>(null)
  const [fase, setFase] = useState<"inicio" | "login" | "buscar" | "registro">("inicio")
  const [dni, setDni] = useState("")
  const [nombreGimnasio, setNombreGimnasio] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [provincia, setProvincia] = useState("")

  // --- BUSCAR ALUMNO ---
  const handleBuscarAlumno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identificador) {
      setError("Por favor ingresá tu DNI.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/alumnos/by-dni?dni=${identificador}`)
      const data = await res.json()

      if (!res.ok) {
        Swal.fire("❌", data.error || "Alumno no encontrado", "error")
        setLoading(false)
        return
      }

      // Si el alumno ya completó su registro → login normal
      if (data.alumno.registroCompleto) {
        Swal.fire("ℹ️", "Tu registro ya está completo. Iniciá sesión.", "info")
        setFase("inicio")
        setLoading(false)
        return
      }

      // Si aún no completó → mostrar formulario de registro
      setAlumnoEncontrado(data.alumno)
      setFase("registro")
      // Swal.fire("✅", "Alumno encontrado. Completá tus datos.", "success")
    } catch (err) {
      Swal.fire("❌", "Error al buscar alumno", "error")
    } finally {
      setLoading(false)
    }
  }

  // --- FINALIZAR REGISTRO ---
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alumnoEncontrado) return
    if (password !== confirmPassword) {
      Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/alumnos/${alumnoEncontrado._id}/completar-registro`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          email,
          telefono,
          fechaNacimiento,
          genero,
          objetivoPrincipal,
          lesiones,
        }),
      })

      if (!res.ok) {
        Swal.fire("❌", "Error al completar el registro", "error")
        return
      }

      // ✅ Inicia sesión automáticamente después de registrarse
      await signIn("credentials", {
        redirect: false,
        identificador,
        password,
        tipo: "alumno",
      })

      Swal.fire("✅", "Registro completado correctamente", "success").then(() =>
        router.replace("/alumno/bienvenida")
      )
    } catch (err) {
      Swal.fire("❌", "Error interno del servidor", "error")
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIN DIRECTO (si ya tiene registro completo) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      identificador,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md bg-transparent p-0 shadow-none">
        <div className="flex justify-center mb-4">
          <Image src="/logo-lyfted.png" alt="Lyfted Logo" width={100} height={100} priority />
        </div>

        <h1 className="text-center text-3xl font-semibold text-[#1E3A5F] mb-6">
          {tipo === "profesor" ? "Acceso Entrenador" : "Acceso Alumno"}
        </h1>

        {/* --- FASE INICIAL: ELEGIR LOGIN O REGISTRO --- */}
        {fase === "inicio" && tipo === "alumno" && !alumnoEncontrado && (
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setFase("login")}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => setFase("buscar")}
              className="w-full bg-white border text-[#1E3A5F] hover:bg-slate-100"
            >
              Registrarme
            </Button>
          </div>
        )}

        {/* --- LOGIN DIRECTO --- */}
        {fase === "login" && tipo === "alumno" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>DNI</Label>
              <Input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <p
              className="text-center text-sm text-[#1E3A5F] mt-2 cursor-pointer hover:underline"
              onClick={() => setFase("inicio")}
            >
              ← Volver
            </p>
          </form>
        )}

        {/* --- FASE BUSCAR ALUMNO PARA REGISTRO --- */}
        {fase === "buscar" && tipo === "alumno" && (
          <form onSubmit={handleBuscarAlumno} className="space-y-4">
            <div>
              <Label>DNI</Label>
              <Input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              {loading ? "Buscando..." : "Continuar"}
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <p
              className="text-center text-sm text-[#1E3A5F] mt-2 cursor-pointer hover:underline"
              onClick={() => setFase("inicio")}
            >
              ← Volver
            </p>
          </form>
        )}

        {/* --- FASE DE REGISTRO COMPLETO --- */}
        {fase === "registro" && tipo === "alumno" && (
          <div className="w-full">
            <RegistroPorPasos
              alumnoEncontrado={alumnoEncontrado}
              identificador={identificador}
              router={router}
            />
          </div>
        )}

        {fase === "registro" && tipo === "profesor" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setError("")
              setLoading(true)

              try {
                const res = await fetch("/api/profesores/registro", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    nombre: identificador,
                    dni,
                    telefono,
                    password,
                    email,
                    nombreGimnasio,
                    ciudad,
                    provincia,
                  }),
                })

                const data = await res.json()

                if (!res.ok) {
                  Swal.fire("❌", data.error || "Error al crear el entrenador", "error")
                  setLoading(false)
                  return
                }

                // ✅ Inicia sesión automáticamente después del registro
                await signIn("credentials", {
                  redirect: false,
                  identificador: dni,
                  password,
                  tipo: "profesor",
                })

                Swal.fire("✅", "Entrenador registrado correctamente", "success").then(() => {
                  router.replace("/profesor/bienvenida")
                })

                router.push("/profesor/dashboard")
              } catch (err) {
                console.error(err)
                Swal.fire("❌", "Error interno del servidor", "error")
              } finally {
                setLoading(false)
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label>Nombre y Apellido</Label>
              <Input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>DNI</Label>
              <Input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div>
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Nombre del gimnasio o marca personal</Label>
              <Input
                type="text"
                value={nombreGimnasio}
                onChange={(e) => setNombreGimnasio(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Ciudad</Label>
                <Input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>Provincia</Label>
                <Input
                  type="text"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Confirmar contraseña</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              {loading ? "Registrando..." : "Registrarme como entrenador"}
            </Button>

            <p
              className="text-center text-sm text-[#1E3A5F] mt-2 cursor-pointer hover:underline"
              onClick={() => setFase("inicio")}
            >
              ← Volver
            </p>
          </form>
        )}

        {/* --- FASE INICIAL: ELEGIR LOGIN O REGISTRO (PROFESOR) --- */}
        {fase === "inicio" && tipo === "profesor" && (
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setFase("login")}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => setFase("registro")}
              className="w-full bg-white border text-[#1E3A5F] hover:bg-slate-100"
            >
              Registrarme
            </Button>
          </div>
        )}

        {/* --- LOGIN DIRECTO PROFESOR --- */}
        {fase === "login" && tipo === "profesor" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>DNI</Label>
              <Input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <p
              className="text-center text-sm text-[#1E3A5F] mt-2 cursor-pointer hover:underline"
              onClick={() => setFase("inicio")}
            >
              ← Volver
            </p>
          </form>
        )}

      </div>
    </div>
  )

}
