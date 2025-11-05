"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import type { Ejercicio } from "@/types"

interface VideoEjercicioPreviewProps {
  ejercicio: Ejercicio
  trigger?: React.ReactNode
}

export function VideoEjercicioPreview({ ejercicio, trigger }: VideoEjercicioPreviewProps) {
  const [abierto, setAbierto] = useState(false)

  if (!ejercicio.videoUrl) {
    return null
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Ver Video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{ejercicio.nombre}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video controls className="w-full h-full" src={ejercicio.videoUrl} autoPlay>
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          {ejercicio.instrucciones && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Instrucciones:</h4>
              <p className="text-sm text-muted-foreground">{ejercicio.instrucciones}</p>
            </div>
          )}
          {ejercicio.descripcion && (
            <div>
              <p className="text-sm text-muted-foreground">{ejercicio.descripcion}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
