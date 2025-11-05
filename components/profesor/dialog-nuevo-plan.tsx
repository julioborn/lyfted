"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Alumno {
  _id: string
  nombre: string
}

interface Ejercicio {
  _id: string
  nombre: string
}

export function DialogNuevoPlan({ onPlanCreado }: { onPlanCreado?: () => void }) {
  const { usuario } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [nombre, setNombre] = useState("")
  const [alumnoId, setAlumnoId] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [dias, setDias] = useState<any[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [cargando, setCargando] = useState(false)

  // 🔹 Cargar alumnos y ejercicios disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Esperar a que esté disponible el usuario (profesor logueado)
        if (!usuario?.id) return

        // ✅ Traer alumnos y ejercicios del profesor
        const alumnosRes = await fetch(`/api/alumnos?profesorId=${usuario.id}`)
        const ejerciciosRes = await fetch(`/api/ejercicios?profesorId=${usuario.id}`)

        const alumnosData = await alumnosRes.json()
        const ejerciciosData = await ejerciciosRes.json()

        setAlumnos(alumnosData.alumnos || [])
        setEjercicios(Array.isArray(ejerciciosData) ? ejerciciosData : ejerciciosData.ejercicios || [])
      } catch (error) {
        console.error("❌ Error al cargar datos:", error)
        setAlumnos([])
        setEjercicios([])
      }
    }

    fetchData()
  }, [usuario])

  // ➕ Agregar un nuevo día
  const agregarDia = () => {
    setDias([...dias, { nombre: "", ejercicios: [] }])
  }

  // ➕ Agregar un ejercicio a un día
  const agregarEjercicio = (diaIndex: number) => {
    const nuevosDias = [...dias]
    nuevosDias[diaIndex].ejercicios.push({
      ejercicioId: "",
      series: 3,
      repeticiones: "10",
      descanso: "60s",
      notas: "",
    })
    setDias(nuevosDias)
  }

  // 🗑️ Eliminar día o ejercicio
  const eliminarDia = (diaIndex: number) => {
    setDias(dias.filter((_, i) => i !== diaIndex))
  }
  const eliminarEjercicio = (diaIndex: number, ejercicioIndex: number) => {
    const nuevosDias = [...dias]
    nuevosDias[diaIndex].ejercicios.splice(ejercicioIndex, 1)
    setDias(nuevosDias)
  }

  // 🧩 Actualizar campos
  const actualizarDia = (diaIndex: number, campo: string, valor: string) => {
    const nuevosDias = [...dias]
    nuevosDias[diaIndex][campo] = valor
    setDias(nuevosDias)
  }
  const actualizarEjercicio = (diaIndex: number, ejercicioIndex: number, campo: string, valor: string) => {
    const nuevosDias = [...dias]
    nuevosDias[diaIndex].ejercicios[ejercicioIndex][campo] = valor
    setDias(nuevosDias)
  }

  // 🧾 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const nuevoPlan = {
        nombre,
        alumnoId,
        profesorId: usuario?.id,
        fechaInicio,
        fechaFin,
        dias,
      }

      const res = await fetch("/api/planes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPlan),
      })

      if (!res.ok) throw new Error("No se pudo crear el plan")
      setAbierto(false)
      setNombre("")
      setDias([])
      onPlanCreado?.()
    } catch (error) {
      console.error("❌ Error al crear plan:", error)
      alert("Error al crear plan")
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>Nuevo Plan</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Plan de Entrenamiento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y fechas */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Nombre del Plan</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div>
              <Label>Alumno</Label>
              <Select value={alumnoId} onValueChange={(v) => setAlumnoId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un alumno" />
                </SelectTrigger>
                <SelectContent>
                  {alumnos.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Fecha de inicio</Label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
            </div>
            <div className="flex-1">
              <Label>Fecha de fin</Label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
            </div>
          </div>

          {/* Días de entrenamiento */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Días del Plan</Label>
              <Button type="button" size="sm" onClick={agregarDia}>
                <Plus className="w-4 h-4 mr-1" /> Agregar Día
              </Button>
            </div>

            {dias.map((dia, i) => (
              <div key={i} className="border p-3 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Nombre del día (Ej: Lunes - Piernas)"
                    value={dia.nombre}
                    onChange={(e) => actualizarDia(i, "nombre", e.target.value)}
                    required
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => eliminarDia(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Ejercicios dentro del día */}
                {dia.ejercicios.map((ej: any, j: number) => (
                  <div
                    key={j}
                    className="border p-3 rounded-lg space-y-3 bg-muted/20"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[2fr,0.6fr,0.6fr,0.8fr,auto] gap-3 items-end">
                      {/* Ejercicio */}
                      <div className="flex flex-col">
                        <Label className="text-xs text-muted-foreground mb-1">Ejercicio</Label>
                        <Select
                          value={ej.ejercicioId}
                          onValueChange={(v) => actualizarEjercicio(i, j, "ejercicioId", v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecciona un ejercicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {ejercicios.map((e) => (
                              <SelectItem key={e._id} value={e._id}>
                                {e.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Series */}
                      <div className="flex flex-col">
                        <Label className="text-xs text-muted-foreground mb-1">Series</Label>
                        <Input
                          type="number"
                          className="h-9"
                          placeholder="3"
                          value={ej.series}
                          onChange={(e) => actualizarEjercicio(i, j, "series", e.target.value)}
                        />
                      </div>

                      {/* Repeticiones */}
                      <div className="flex flex-col">
                        <Label className="text-xs text-muted-foreground mb-1">Reps</Label>
                        <Input
                          className="h-9"
                          placeholder="10"
                          value={ej.repeticiones}
                          onChange={(e) => actualizarEjercicio(i, j, "repeticiones", e.target.value)}
                        />
                      </div>

                      {/* Descanso */}
                      <div className="flex flex-col">
                        <Label className="text-xs text-muted-foreground mb-1">Descanso</Label>
                        <Input
                          className="h-9"
                          placeholder="60s"
                          value={ej.descanso}
                          onChange={(e) => actualizarEjercicio(i, j, "descanso", e.target.value)}
                        />
                      </div>

                      {/* Botón eliminar */}
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => eliminarEjercicio(i, j)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" size="sm" onClick={() => agregarEjercicio(i)}>
                  + Agregar Ejercicio
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={cargando} className="w-full">
            {cargando ? "Creando..." : "Crear Plan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
