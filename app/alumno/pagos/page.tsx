// "use client"

// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { dataStore } from "@/lib/data-store"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
// import type { Pago, Alumno } from "@/types"

// export default function PagosAlumnoPage() {
//   const { data: session, status } = useSession()
// const usuario = session?.user
//   const alumno = usuario as Alumno
//   const [pagos, setPagos] = useState<Pago[]>([])

//   useEffect(() => {
//     if (alumno) {
//       const pagosCargados = dataStore.getPagos(alumno.id)
//       setPagos(pagosCargados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()))
//     }
//   }, [alumno])

//   const totalPagado = pagos.filter((p) => p.estado === "pagado").reduce((sum, p) => sum + p.monto, 0)
//   const totalPendiente = pagos.filter((p) => p.estado === "pendiente").reduce((sum, p) => sum + p.monto, 0)
//   const totalVencido = pagos.filter((p) => p.estado === "vencido").reduce((sum, p) => sum + p.monto, 0)

//   const getEstadoBadge = (estado: string) => {
//     switch (estado) {
//       case "pagado":
//         return (
//           <Badge variant="default" className="gap-1">
//             <CheckCircle2 className="h-3 w-3" />
//             Pagado
//           </Badge>
//         )
//       case "pendiente":
//         return (
//           <Badge variant="secondary" className="gap-1">
//             <Clock className="h-3 w-3" />
//             Pendiente
//           </Badge>
//         )
//       case "vencido":
//         return (
//           <Badge variant="destructive" className="gap-1">
//             <AlertCircle className="h-3 w-3" />
//             Vencido
//           </Badge>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Mis Pagos</h1>

//       {/* Estadísticas */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <CheckCircle2 className="h-4 w-4 text-foreground" />
//               Total Pagado
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">${totalPagado.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground mt-1">Pagos completados</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <Clock className="h-4 w-4 text-primary" />
//               Pendiente
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-primary">${totalPendiente.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground mt-1">Por pagar</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium flex items-center gap-2">
//               <AlertCircle className="h-4 w-4 text-destructive" />
//               Vencido
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-destructive">${totalVencido.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground mt-1">Pagos vencidos</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Historial de pagos */}
//       {pagos.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center text-muted-foreground">
//             <p>No hay pagos registrados</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-2">
//           {pagos.map((pago) => {
//             const fecha = new Date(pago.fecha)

//             return (
//               <Card key={pago.id}>
//                 <CardContent className="pt-4">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h3 className="font-semibold text-sm">{pago.concepto}</h3>
//                         {getEstadoBadge(pago.estado)}
//                       </div>
//                       <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                         <span>{fecha.toLocaleDateString()}</span>
//                         <span>•</span>
//                         <span className="font-semibold text-foreground">${pago.monto.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

export default function Page() {
  return <div>Pagos</div>;
}
