"use client"

import type { Ejercicio, PlanEntrenamiento, Pago, Mensaje, Alumno, Profesor, DiaEntrenamiento as Entrenamiento } from "@/types"

// Store simple para datos mock - en producción esto sería una base de datos

class DataStore {
  // Ejercicios
  async getEjercicios(profesorId?: string): Promise<Ejercicio[]> {
    try {
      const url = profesorId ? `/api/ejercicios?profesorId=${profesorId}` : "/api/ejercicios"
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener ejercicios:", error)
      return []
    }
  }

  async getEjercicio(id: string): Promise<Ejercicio | undefined> {
    try {
      const response = await fetch(`/api/ejercicios/${id}`)
      if (response.ok) {
        return await response.json()
      }
      return undefined
    } catch (error) {
      console.error("Error al obtener ejercicio:", error)
      return undefined
    }
  }

  async agregarEjercicio(ejercicio: Ejercicio): Promise<boolean> {
    try {
      const response = await fetch("/api/ejercicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ejercicio),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar ejercicio:", error)
      return false
    }
  }

  async actualizarEjercicio(id: string, ejercicio: Partial<Ejercicio>): Promise<boolean> {
    try {
      const response = await fetch(`/api/ejercicios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ejercicio),
      })
      return response.ok
    } catch (error) {
      console.error("Error al actualizar ejercicio:", error)
      return false
    }
  }

  async eliminarEjercicio(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/ejercicios/${id}`, {
        method: "DELETE",
      })
      return response.ok
    } catch (error) {
      console.error("Error al eliminar ejercicio:", error)
      return false
    }
  }

  // Planes
  async getPlanes(alumnoId?: string): Promise<PlanEntrenamiento[]> {
    try {
      const url = alumnoId ? `/api/planes?alumnoId=${alumnoId}` : "/api/planes"
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener planes:", error)
      return []
    }
  }

  async getPlan(id: string): Promise<PlanEntrenamiento | undefined> {
    try {
      const response = await fetch(`/api/planes/${id}`)
      if (response.ok) {
        return await response.json()
      }
      return undefined
    } catch (error) {
      console.error("Error al obtener plan:", error)
      return undefined
    }
  }

  async agregarPlan(plan: PlanEntrenamiento): Promise<boolean> {
    try {
      const response = await fetch("/api/planes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar plan:", error)
      return false
    }
  }

  async actualizarPlan(id: string, plan: Partial<PlanEntrenamiento>): Promise<boolean> {
    try {
      const response = await fetch(`/api/planes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      })
      return response.ok
    } catch (error) {
      console.error("Error al actualizar plan:", error)
      return false
    }
  }

  // Pagos
  async getPagos(alumnoId?: string): Promise<Pago[]> {
    try {
      const url = alumnoId ? `/api/pagos?alumnoId=${alumnoId}` : "/api/pagos"
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener pagos:", error)
      return []
    }
  }

  async agregarPago(pago: Pago): Promise<boolean> {
    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar pago:", error)
      return false
    }
  }

  async actualizarPago(id: string, pago: Partial<Pago>): Promise<boolean> {
    try {
      const response = await fetch(`/api/pagos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      })
      return response.ok
    } catch (error) {
      console.error("Error al actualizar pago:", error)
      return false
    }
  }

  // Mensajes
  async getMensajes(usuarioId: string, otroUsuarioId?: string): Promise<Mensaje[]> {
    try {
      const url = otroUsuarioId
        ? `/api/mensajes?usuarioId=${usuarioId}&otroUsuarioId=${otroUsuarioId}`
        : `/api/mensajes?usuarioId=${usuarioId}`
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener mensajes:", error)
      return []
    }
  }

  async agregarMensaje(mensaje: Mensaje): Promise<boolean> {
    try {
      const response = await fetch("/api/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensaje),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar mensaje:", error)
      return false
    }
  }

  async marcarMensajesLeidos(usuarioId: string, otroUsuarioId: string): Promise<boolean> {
    try {
      const response = await fetch("/api/mensajes/marcar-leidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, otroUsuarioId }),
      })
      return response.ok
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error)
      return false
    }
  }

  // Alumnos
  async getAlumnos(profesorId?: string): Promise<Alumno[]> {
    try {
      const url = profesorId ? `/api/alumnos?profesorId=${profesorId}` : "/api/alumnos"
      const response = await fetch(url)
      if (!response.ok) return []

      const data = await response.json()

      // 🧠 Si la API devuelve { alumnos: [...] }, usamos data.alumnos
      if (Array.isArray(data)) return data
      if (Array.isArray(data.alumnos)) return data.alumnos

      return []
    } catch (error) {
      console.error("Error al obtener alumnos:", error)
      return []
    }
  }

  async getAlumno(id: string): Promise<Alumno | undefined> {
    try {
      const response = await fetch(`/api/alumnos/${id}`)
      if (response.ok) {
        return await response.json()
      }
      return undefined
    } catch (error) {
      console.error("Error al obtener alumno:", error)
      return undefined
    }
  }

  async getAlumnoPorDNI(dni: string): Promise<Alumno | undefined> {
    try {
      const response = await fetch(`/api/alumnos?dni=${dni}`)
      if (response.ok) {
        const alumnos = await response.json()
        return alumnos[0]
      }
      return undefined
    } catch (error) {
      console.error("Error al obtener alumno por DNI:", error)
      return undefined
    }
  }

  async agregarAlumno(alumno: Alumno): Promise<boolean> {
    try {
      const response = await fetch("/api/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar alumno:", error)
      return false
    }
  }

  async actualizarAlumno(id: string, alumno: Partial<Alumno>): Promise<boolean> {
    try {
      const response = await fetch(`/api/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno),
      })
      return response.ok
    } catch (error) {
      console.error("Error al actualizar alumno:", error)
      return false
    }
  }

  // Entrenamientos
  async getEntrenamientos(alumnoId: string): Promise<Entrenamiento[]> {
    try {
      const response = await fetch(`/api/entrenamientos?alumnoId=${alumnoId}`)
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener entrenamientos:", error)
      return []
    }
  }

  async agregarEntrenamiento(entrenamiento: Entrenamiento): Promise<boolean> {
    try {
      const response = await fetch("/api/entrenamientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrenamiento),
      })
      return response.ok
    } catch (error) {
      console.error("Error al agregar entrenamiento:", error)
      return false
    }
  }

  // Profesores
  async getProfesores(): Promise<Profesor[]> {
    try {
      const response = await fetch("/api/profesores")
      if (response.ok) {
        return await response.json()
      }
      return []
    } catch (error) {
      console.error("Error al obtener profesores:", error)
      return []
    }
  }

  async getProfesor(id: string): Promise<Profesor | undefined> {
    try {
      const response = await fetch(`/api/profesores/${id}`)
      if (response.ok) {
        return await response.json()
      }
      return undefined
    } catch (error) {
      console.error("Error al obtener profesor:", error)
      return undefined
    }
  }

  async actualizarProfesor(id: string, profesor: Partial<Profesor>): Promise<boolean> {
    try {
      const response = await fetch(`/api/profesores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profesor),
      })
      return response.ok
    } catch (error) {
      console.error("Error al actualizar profesor:", error)
      return false
    }
  }
}

export const dataStore = new DataStore()
