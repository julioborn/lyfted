"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare } from "lucide-react"
import { ChatMensaje } from "@/components/chat/chat-mensaje"
import type { Alumno, Mensaje } from "@/types"

export default function MensajesProfesorPage() {
  const { data: session, status } = useSession()
const usuario = session?.user
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  const cargarAlumnos = () => {
    const alumnosCargados = dataStore.getAlumnos(usuario?.id)
    setAlumnos(alumnosCargados)
    if (alumnosCargados.length > 0 && !alumnoSeleccionado) {
      setAlumnoSeleccionado(alumnosCargados[0])
    }
  }

  const cargarMensajes = () => {
    if (usuario && alumnoSeleccionado) {
      const todosMensajes = dataStore.getMensajes(usuario.id)
      const mensajesConAlumno = todosMensajes.filter(
        (m) =>
          (m.remitenteId === usuario.id && m.destinatarioId === alumnoSeleccionado.id) ||
          (m.remitenteId === alumnoSeleccionado.id && m.destinatarioId === usuario.id),
      )
      setMensajes(mensajesConAlumno.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()))

      // Marcar mensajes como leídos
      mensajesConAlumno.forEach((m) => {
        if (m.destinatarioId === usuario.id && !m.leido) {
          dataStore.marcarMensajeLeido(m.id)
        }
      })
    }
  }

  useEffect(() => {
    cargarAlumnos()
  }, [usuario])

  useEffect(() => {
    if (alumnoSeleccionado) {
      cargarMensajes()
    }
  }, [alumnoSeleccionado, usuario])

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes])

  const handleEnviarMensaje = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !usuario || !alumnoSeleccionado) return

    const mensaje: Mensaje = {
      id: `msg${Date.now()}`,
      remitenteId: usuario.id,
      destinatarioId: alumnoSeleccionado.id,
      contenido: nuevoMensaje,
      fecha: new Date().toISOString(),
      leido: false,
    }

    dataStore.agregarMensaje(mensaje)
    setNuevoMensaje("")
    cargarMensajes()
  }

  const obtenerMensajesNoLeidos = (alumnoId: string) => {
    const todosMensajes = dataStore.getMensajes(usuario?.id || "")
    return todosMensajes.filter((m) => m.remitenteId === alumnoId && m.destinatarioId === usuario?.id && !m.leido)
      .length
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mensajes</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-3 h-[calc(100vh-180px)]">
        {/* Lista de alumnos */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">Alumnos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              {alumnos.map((alumno) => {
                const noLeidos = obtenerMensajesNoLeidos(alumno.id)

                return (
                  <button
                    key={alumno.id}
                    onClick={() => setAlumnoSeleccionado(alumno)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
                      alumnoSeleccionado?.id === alumno.id ? "bg-accent" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={alumno.avatar || "/placeholder.svg"} alt={alumno.nombre} />
                      <AvatarFallback>{alumno.nombre.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{alumno.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">{alumno.email}</p>
                    </div>
                    {noLeidos > 0 && (
                      <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {noLeidos}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex flex-col overflow-hidden">
          {alumnoSeleccionado ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={alumnoSeleccionado.avatar || "/placeholder.svg"}
                      alt={alumnoSeleccionado.nombre}
                    />
                    <AvatarFallback>{alumnoSeleccionado.nombre.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{alumnoSeleccionado.nombre}</CardTitle>
                    <p className="text-xs text-muted-foreground">{alumnoSeleccionado.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {mensajes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay mensajes aún</p>
                      <p className="text-sm">Envía el primer mensaje</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {mensajes.map((mensaje) => (
                      <ChatMensaje
                        key={mensaje.id}
                        mensaje={mensaje}
                        remitente={mensaje.remitenteId === usuario?.id ? usuario : alumnoSeleccionado}
                        esPropio={mensaje.remitenteId === usuario?.id}
                      />
                    ))}
                    <div ref={mensajesEndRef} />
                  </div>
                )}
              </CardContent>
              <div className="border-t p-4">
                <form onSubmit={handleEnviarMensaje} className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                  />
                  <Button type="submit" disabled={!nuevoMensaje.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Selecciona un alumno para comenzar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
