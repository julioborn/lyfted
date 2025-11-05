"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario, Profesor, Alumno } from "@/types"

interface AuthContextType {
  usuario: Usuario | null
  iniciarSesion: (credencial: string, password: string, tipo: "profesor" | "alumno") => Promise<boolean>
  registrarProfesor: (datos: Partial<Profesor>) => Promise<boolean>
  registrarAlumno: (dni: string, password: string) => Promise<boolean>
  completarDatosAlumno: (datos: Partial<Alumno>) => Promise<boolean>
  cerrarSesion: () => void
  esProfeso: boolean
  esAlumno: boolean
  cargando: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      const usuarioParseado = JSON.parse(usuarioGuardado)
      setUsuario(usuarioParseado)
    }
    setCargando(false)
  }, [])

  const iniciarSesion = async (credencial: string, password: string, tipo: "profesor" | "alumno"): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credencial, password, tipo }),
      })

      if (response.ok) {
        const data = await response.json()
        setUsuario(data.usuario)
        localStorage.setItem("usuario", JSON.stringify(data.usuario))
        return true
      }
      return false
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return false
    }
  }

  const registrarProfesor = async (datos: Partial<Profesor>): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/registro-profesor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      })

      if (response.ok) {
        const data = await response.json()
        setUsuario(data.profesor)
        localStorage.setItem("usuario", JSON.stringify(data.profesor))
        return true
      }
      return false
    } catch (error) {
      console.error("Error al registrar profesor:", error)
      return false
    }
  }

  const registrarAlumno = async (dni: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/registro-alumno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUsuario(data.alumno)
        localStorage.setItem("usuario", JSON.stringify(data.alumno))
        return true
      }
      return false
    } catch (error) {
      console.error("Error al registrar alumno:", error)
      return false
    }
  }

  const completarDatosAlumno = async (datos: Partial<Alumno>): Promise<boolean> => {
    if (usuario && usuario.tipo === "alumno") {
      try {
        const response = await fetch("/api/auth/completar-datos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alumnoId: usuario.id, ...datos }),
        })

        if (response.ok) {
          const data = await response.json()
          setUsuario(data.alumno)
          localStorage.setItem("usuario", JSON.stringify(data.alumno))
          return true
        }
        return false
      } catch (error) {
        console.error("Error al completar datos:", error)
        return false
      }
    }
    return false
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  const esProfeso = usuario?.tipo === "profesor"
  const esAlumno = usuario?.tipo === "alumno"

  return (
    <AuthContext.Provider
      value={{
        usuario,
        iniciarSesion,
        registrarProfesor,
        registrarAlumno,
        completarDatosAlumno,
        cerrarSesion,
        esProfeso,
        esAlumno,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
