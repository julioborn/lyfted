// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { useSession } from "next-auth/react"
// import { dataStore } from "@/lib/data-store"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Send, MessageSquare } from "lucide-react"
// import { ChatMensaje } from "@/components/chat/chat-mensaje"
// import type { Alumno, Mensaje, Profesor } from "@/types"

// export default function MensajesAlumnoPage() {
//   const { data: session, status } = useSession()
// const usuario = session?.user
//   const alumno = usuario as Alumno
//   const [profesor, setProfesor] = useState<Profesor | null>(null)
//   const [mensajes, setMensajes] = useState<Mensaje[]>([])
//   const [nuevoMensaje, setNuevoMensaje] = useState("")
//   const mensajesEndRef = useRef<HTMLDivElement>(null)

//   const cargarMensajes = () => {
//     if (usuario && alumno.profesorId) {
//       const todosMensajes = dataStore.getMensajes(usuario.id)
//       const mensajesConProfesor = todosMensajes.filter(
//         (m) =>
//           (m.remitenteId === usuario.id && m.destinatarioId === alumno.profesorId) ||
//           (m.remitenteId === alumno.profesorId && m.destinatarioId === usuario.id),
//       )
//       setMensajes(mensajesConProfesor.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()))

//       // Marcar mensajes como leídos
//       mensajesConProfesor.forEach((m) => {
//         if (m.destinatarioId === usuario.id && !m.leido) {
//           dataStore.marcarMensajeLeido(m.id)
//         }
//       })
//     }
//   }

//   useEffect(() => {
//     if (alumno.profesorId) {
//       // Cargar información del profesor (en un caso real vendría de la base de datos)
//       setProfesor({
//         id: alumno.profesorId,
//         nombre: "Carlos Rodríguez",
//         email: "profesor@gym.com",
//         tipo: "profesor",
//         avatar: "/placeholder.svg?key=0c56y",
//       })
//       cargarMensajes()
//     }
//   }, [usuario])

//   useEffect(() => {
//     mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [mensajes])

//   const handleEnviarMensaje = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!nuevoMensaje.trim() || !usuario || !alumno.profesorId) return

//     const mensaje: Mensaje = {
//       id: `msg${Date.now()}`,
//       remitenteId: usuario.id,
//       destinatarioId: alumno.profesorId,
//       contenido: nuevoMensaje,
//       fecha: new Date().toISOString(),
//       leido: false,
//     }

//     dataStore.agregarMensaje(mensaje)
//     setNuevoMensaje("")
//     cargarMensajes()
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Mensajes</h1>
//       <p className="text-muted-foreground">Comunícate con tu profesor</p>

//       <Card className="h-[calc(100vh-180px)] flex flex-col overflow-hidden">
//         {profesor ? (
//           <>
//             <CardHeader className="border-b">
//               <div className="flex items-center gap-3">
//                 <Avatar>
//                   <AvatarImage src={profesor.avatar || "/placeholder.svg"} alt={profesor.nombre} />
//                   <AvatarFallback>{profesor.nombre.charAt(0).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle className="text-base">{profesor.nombre}</CardTitle>
//                   <p className="text-xs text-muted-foreground">Tu profesor</p>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="flex-1 overflow-y-auto p-4">
//               {mensajes.length === 0 ? (
//                 <div className="flex items-center justify-center h-full text-muted-foreground">
//                   <div className="text-center">
//                     <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                     <p>No hay mensajes aún</p>
//                     <p className="text-sm">Envía el primer mensaje a tu profesor</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   {mensajes.map((mensaje) => (
//                     <ChatMensaje
//                       key={mensaje.id}
//                       mensaje={mensaje}
//                       remitente={mensaje.remitenteId === usuario?.id ? usuario : profesor}
//                       esPropio={mensaje.remitenteId === usuario?.id}
//                     />
//                   ))}
//                   <div ref={mensajesEndRef} />
//                 </div>
//               )}
//             </CardContent>
//             <div className="border-t p-4">
//               <form onSubmit={handleEnviarMensaje} className="flex gap-2">
//                 <Input
//                   placeholder="Escribe un mensaje..."
//                   value={nuevoMensaje}
//                   onChange={(e) => setNuevoMensaje(e.target.value)}
//                 />
//                 <Button type="submit" disabled={!nuevoMensaje.trim()}>
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <CardContent className="flex items-center justify-center h-full">
//             <div className="text-center text-muted-foreground">
//               <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
//               <p>No tienes un profesor asignado</p>
//             </div>
//           </CardContent>
//         )}
//       </Card>
//     </div>
//   )
// }


export default function Page() {
    return <div>Mensajes</div>;
}
