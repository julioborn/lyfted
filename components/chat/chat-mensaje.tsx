"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Mensaje, Usuario } from "@/types"

interface ChatMensajeProps {
  mensaje: Mensaje
  remitente: Usuario | undefined
  esPropio: boolean
}

export function ChatMensaje({ mensaje, remitente, esPropio }: ChatMensajeProps) {
  const fecha = new Date(mensaje.fecha)
  const horaFormateada = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={cn("flex gap-3 mb-4", esPropio && "flex-row-reverse")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={remitente?.avatar || "/placeholder.svg"} alt={remitente?.nombre} />
        <AvatarFallback>{remitente?.nombre.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col max-w-[70%]", esPropio && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            esPropio ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          <p className="text-sm">{mensaje.contenido}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{horaFormateada}</span>
      </div>
    </div>
  )
}
