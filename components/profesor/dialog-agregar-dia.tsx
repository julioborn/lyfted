// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Trash2 } from "lucide-react"
// import { dataStore } from "@/lib/data-store"
// import { useSession } from "next-auth/react"
// import type { DiaEntrenamiento, BloqueEjercicio } from "@/types"
// import { Card, CardContent } from "@/components/ui/card"

// interface DialogAgregarDiaProps {
//   planId: string
//   onDiaAgregado?: () => void
// }

// export function DialogAgregarDia({ planId, onDiaAgregado }: DialogAgregarDiaProps) {
//   const { data: session, status } = useSession()
// const usuario = session?.user
//   const [abierto, setAbierto] = useState(false)
//   const [cargando, setCargando] = useState(false)

//   const ejercicios = dataStore.getEjercicios(usuario?.id)

//   const [nombreDia, setNombreDia] = useState("")
//   const [bloques, setBloques] = useState<BloqueEjercicio[]>([])

//   const agregarBloque = () => {
//     setBloques([
//       ...bloques,
//       {
//         ejercicioId: "",
//         series: 3,
//         repeticiones: "12",
//         descanso: "60 seg",
//         notas: "",
//       },
//     ])
//   }

//   const actualizarBloque = (index: number, campo: keyof BloqueEjercicio, valor: string | number) => {
//     const nuevosBloques = [...bloques]
//     nuevosBloques[index] = { ...nuevosBloques[index], [campo]: valor }
//     setBloques(nuevosBloques)
//   }

//   const eliminarBloque = (index: number) => {
//     setBloques(bloques.filter((_, i) => i !== index))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setCargando(true)

//     const plan = dataStore.getPlan(planId)
//     if (!plan) return

//     const nuevoDia: DiaEntrenamiento = {
//       id: `dia${Date.now()}`,
//       nombre: nombreDia,
//       bloques: bloques.filter((b) => b.ejercicioId !== ""),
//       completado: false,
//     }

//     plan.dias.push(nuevoDia)
//     dataStore.actualizarPlan(planId, { dias: plan.dias })

//     // Resetear formulario
//     setNombreDia("")
//     setBloques([])
//     setCargando(false)
//     setAbierto(false)

//     if (onDiaAgregado) {
//       onDiaAgregado()
//     }
//   }

//   return (
//     <Dialog open={abierto} onOpenChange={setAbierto}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Plus className="mr-2 h-4 w-4" />
//           Agregar Día
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Agregar Día de Entrenamiento</DialogTitle>
//           <DialogDescription>Configura los ejercicios, series y repeticiones para este día</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="nombreDia">Nombre del Día *</Label>
//               <Input
//                 id="nombreDia"
//                 placeholder="Ej: Día 1 - Pecho y Tríceps"
//                 value={nombreDia}
//                 onChange={(e) => setNombreDia(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <Label>Ejercicios</Label>
//                 <Button type="button" variant="outline" size="sm" onClick={agregarBloque}>
//                   <Plus className="mr-2 h-3 w-3" />
//                   Agregar Ejercicio
//                 </Button>
//               </div>

//               {bloques.length === 0 ? (
//                 <Card>
//                   <CardContent className="py-8 text-center text-muted-foreground">
//                     <p>No hay ejercicios agregados</p>
//                     <p className="text-sm">Haz clic en "Agregar Ejercicio" para comenzar</p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-3">
//                   {bloques.map((bloque, index) => (
//                     <Card key={index}>
//                       <CardContent className="pt-4">
//                         <div className="grid gap-3">
//                           <div className="flex items-start gap-2">
//                             <div className="flex-1 space-y-3">
//                               <div className="space-y-2">
//                                 <Label>Ejercicio</Label>
//                                 <Select
//                                   value={bloque.ejercicioId}
//                                   onValueChange={(value) => actualizarBloque(index, "ejercicioId", value)}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Selecciona un ejercicio" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {ejercicios.map((ejercicio) => (
//                                       <SelectItem key={ejercicio.id} value={ejercicio.id}>
//                                         {ejercicio.nombre} - {ejercicio.grupoMuscular}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <div className="grid grid-cols-3 gap-2">
//                                 <div className="space-y-2">
//                                   <Label>Series</Label>
//                                   <Input
//                                     type="number"
//                                     min="1"
//                                     value={bloque.series}
//                                     onChange={(e) => actualizarBloque(index, "series", Number.parseInt(e.target.value))}
//                                   />
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label>Repeticiones</Label>
//                                   <Input
//                                     placeholder="12 o 12-15"
//                                     value={bloque.repeticiones}
//                                     onChange={(e) => actualizarBloque(index, "repeticiones", e.target.value)}
//                                   />
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label>Descanso</Label>
//                                   <Input
//                                     placeholder="60 seg"
//                                     value={bloque.descanso}
//                                     onChange={(e) => actualizarBloque(index, "descanso", e.target.value)}
//                                   />
//                                 </div>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label>Notas (opcional)</Label>
//                                 <Input
//                                   placeholder="Instrucciones adicionales..."
//                                   value={bloque.notas}
//                                   onChange={(e) => actualizarBloque(index, "notas", e.target.value)}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               className="text-destructive"
//                               onClick={() => eliminarBloque(index)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
//               Cancelar
//             </Button>
//             <Button type="submit" disabled={cargando || !nombreDia || bloques.length === 0}>
//               {cargando ? "Guardando..." : "Guardar Día"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
