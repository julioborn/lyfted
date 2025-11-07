// "use client"

// import { useEffect, useState } from "react"
// import { useSession } from "next-auth/react"
// import { dataStore } from "@/lib/data-store"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Search, Mail, Target } from "lucide-react"
// import { DialogNuevoAlumno } from "@/components/profesor/dialog-nuevo-alumno"
// import { DialogDetalleAlumno } from "@/components/profesor/dialog-detalle-alumno"
// import type { Alumno, PlanEntrenamiento, Pago } from "@/types"

// export default function AlumnosPage() {
//   const { data: session, status } = useSession()
//   const usuario = session?.user
//   const [busqueda, setBusqueda] = useState("")
//   const [alumnos, setAlumnos] = useState<Alumno[]>([])
//   const [pagos, setPagos] = useState<Record<string, Pago[]>>({})
//   const [planes, setPlanes] = useState<Record<string, PlanEntrenamiento | null>>({})
//   const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null)
//   const [cargando, setCargando] = useState(true)
//   const [actualizacion, setActualizacion] = useState(0)

//   // 🧩 Cargar todos los datos desde el backend
//   useEffect(() => {
//     if (!usuario?.id) return

//     const fetchData = async () => {
//       try {
//         const alumnosData = await dataStore.getAlumnos(usuario.id)
//         const listaAlumnos = Array.isArray(alumnosData) ? alumnosData : []
//         setAlumnos(listaAlumnos)

//         const pagosMap: Record<string, Pago[]> = {}
//         const planesMap: Record<string, PlanEntrenamiento | null> = {}

//         for (const alumno of listaAlumnos) {
//           const alumnoId = alumno._id?.toString() ?? alumno.id
//           if (!alumnoId) continue // 👈 defensa: si no hay ID, salteamos

//           const pagosAlumno = await dataStore.getPagos(alumnoId)
//           pagosMap[alumnoId] = Array.isArray(pagosAlumno) ? pagosAlumno : []

//           const plan = alumno.planActualId ? await dataStore.getPlan(alumno.planActualId) : null
//           planesMap[alumnoId] = plan ?? null
//         }

//         setPagos(pagosMap)
//         setPlanes(planesMap)
//       } catch (error) {
//         console.error("❌ Error al cargar alumnos:", error)
//         setAlumnos([])
//       } finally {
//         setCargando(false)
//       }
//     }

//     fetchData()
//   }, [usuario, actualizacion])

//   const handleAlumnoCreado = () => {
//     setActualizacion((prev) => prev + 1)
//   }

//   if (cargando) return <p className="text-center text-muted-foreground">Cargando alumnos...</p>

//   const alumnosFiltrados = alumnos.filter(
//     (alumno) =>
//       alumno.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
//       alumno.email?.toLowerCase().includes(busqueda.toLowerCase())
//   )

//   console.log({
//     tipoNuevoAlumno: typeof DialogNuevoAlumno,
//     tipoDetalleAlumno: typeof DialogDetalleAlumno
//   })

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <h1 className="text-xl md:text-2xl font-bold">Mis Alumnos</h1>

//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar alumno..."
//             value={busqueda}
//             onChange={(e) => setBusqueda(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <DialogNuevoAlumno onAlumnoCreado={handleAlumnoCreado} />
//       </div>

//       {alumnosFiltrados.length === 0 ? (
//         <p className="text-center text-muted-foreground">No hay alumnos registrados.</p>
//       ) : (
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           {alumnosFiltrados.map((alumno) => {
//             const alumnoId = alumno._id?.toString() ?? alumno.id
//             const planActual = alumnoId ? planes[alumnoId] : null
//             const pagosAlumno = alumnoId ? pagos[alumnoId] || [] : []
//             const pagosPendientes = pagosAlumno.filter((p) => p.estado === "pendiente").length

//             return (
//               <Card
//                 key={alumnoId}
//                 className="hover:shadow-md transition-shadow cursor-pointer"
//                 onClick={() => setAlumnoSeleccionado(alumno)}
//               >
//                 <CardContent className="pt-4 md:pt-6">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <Avatar className="h-12 w-12 md:h-14 md:w-14 shrink-0">
//                       <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
//                       <AvatarFallback>{alumno.nombre?.charAt(0).toUpperCase()}</AvatarFallback>
//                     </Avatar>

//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-sm md:text-base truncate">{alumno.nombre}</h3>
//                       <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 truncate">
//                         <Mail className="h-3 w-3 shrink-0" />
//                         <span className="truncate">{alumno.email}</span>
//                       </p>

//                       {alumno.objetivo && (
//                         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                           <Target className="h-3 w-3 shrink-0" />
//                           <span className="line-clamp-1">{alumno.objetivo}</span>
//                         </p>
//                       )}

//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {planActual && (
//                           <Badge variant="default" className="text-xs">
//                             {planActual.diasCompletados}/{planActual.totalDias} días
//                           </Badge>
//                         )}
//                         {pagosPendientes > 0 && (
//                           <Badge variant="destructive" className="text-xs">
//                             {pagosPendientes} pagos
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div>
//       )}

//       {alumnoSeleccionado && (
//         <DialogDetalleAlumno
//           alumno={alumnoSeleccionado}
//           abierto={!!alumnoSeleccionado}
//           onCerrar={() => setAlumnoSeleccionado(null)}
//         />
//       )}
//     </div>
//   )
// }

"use client"

export default function AlumnosPage() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      <h1 className="text-xl font-semibold">Alumnos</h1>
      <p className="mt-2">⚙️ Sección temporalmente desactivada.</p>
    </div>
  )
}

