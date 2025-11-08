"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Calendar, Phone, UserCircle, Activity, Target } from "lucide-react"
import { DialogNuevoAlumno } from "@/components/profesor/dialog-nuevo-alumno"
import { DialogDetalleAlumno } from "@/components/profesor/dialog-detalle-alumno"
import type { Alumno, PlanEntrenamiento, Pago } from "@/types"

export default function AlumnosPage() {
  const { data: session, status } = useSession()
  const usuario = session?.user
  const [busqueda, setBusqueda] = useState("")
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [pagos, setPagos] = useState<Record<string, Pago[]>>({})
  const [planes, setPlanes] = useState<Record<string, PlanEntrenamiento | null>>({})
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null)
  const [cargando, setCargando] = useState(true)
  const [actualizacion, setActualizacion] = useState(0)

  useEffect(() => {
    if (!usuario?.id) return

    const fetchData = async () => {
      try {
        const alumnosData = await dataStore.getAlumnos(usuario.id)
        const listaAlumnos = Array.isArray(alumnosData) ? alumnosData : []
        setAlumnos(listaAlumnos)

        const pagosMap: Record<string, Pago[]> = {}
        const planesMap: Record<string, PlanEntrenamiento | null> = {}

        for (const alumno of listaAlumnos) {
          const alumnoId = alumno._id?.toString() ?? alumno.id
          if (!alumnoId) continue

          const pagosAlumno = await dataStore.getPagos(alumnoId)
          pagosMap[alumnoId] = Array.isArray(pagosAlumno) ? pagosAlumno : []

          const plan = alumno.planActualId ? await dataStore.getPlan(alumno.planActualId) : null
          planesMap[alumnoId] = plan ?? null
        }

        setPagos(pagosMap)
        setPlanes(planesMap)
      } catch (error) {
        console.error("❌ Error al cargar alumnos:", error)
        setAlumnos([])
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [usuario, actualizacion])

  const handleAlumnoCreado = () => {
    window.location.reload()
  }

  if (cargando)
    return <p className="text-center text-muted-foreground mt-10">Cargando alumnos...</p>

  const alumnosFiltrados = alumnos.filter(
    (alumno) =>
      alumno.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.dni?.includes(busqueda)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold">Mis Alumnos</h1>
        <DialogNuevoAlumno onAlumnoCreado={handleAlumnoCreado} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alumno por nombre, email o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      {alumnosFiltrados.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No hay alumnos registrados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumnosFiltrados.map((alumno) => {
            const alumnoId = alumno._id?.toString() ?? alumno.id
            const planActual = alumnoId ? planes[alumnoId] : null
            const pagosAlumno = alumnoId ? pagos[alumnoId] || [] : []
            const pagosPendientes = pagosAlumno.filter((p) => p.estado === "pendiente").length

            return (
              <Card
                key={alumnoId}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setAlumnoSeleccionado(alumno)}
              >
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
                      <AvatarFallback>{alumno.nombre?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base">{alumno.nombre}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-4 w-4" /> {alumno.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> {alumno.telefono}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <UserCircle className="h-4 w-4" /> DNI: {alumno.dni}
                      </p>
                    </div>
                  </div>

                  {alumno.genero && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <UserCircle className="h-4 w-4" /> Género: {alumno.genero}
                    </p>
                  )}

                  {alumno.fechaNacimiento && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Nacimiento:{" "}
                      {new Date(alumno.fechaNacimiento).toLocaleDateString("es-AR")}
                    </p>
                  )}

                  {alumno.lesiones && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Activity className="h-4 w-4" /> Lesiones: {alumno.lesiones}
                    </p>
                  )}

                  {alumno.objetivo && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Target className="h-4 w-4" /> Objetivo: {alumno.objetivo}
                    </p>
                  )}

                  {alumno.objetivoPrincipal && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Target className="h-4 w-4" /> Objetivo principal: {alumno.objetivoPrincipal}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {planActual && (
                      <Badge variant="default" className="text-xs">
                        {planActual.diasCompletados}/{planActual.totalDias} días activos
                      </Badge>
                    )}
                    {pagosPendientes > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {pagosPendientes} pagos pendientes
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {alumnoSeleccionado && (
        <DialogDetalleAlumno
          alumno={alumnoSeleccionado}
          abierto={!!alumnoSeleccionado}
          onCerrar={() => setAlumnoSeleccionado(null)}
        />
      )}
    </div>
  )
}
