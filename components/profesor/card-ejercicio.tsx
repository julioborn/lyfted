"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Edit, Trash2 } from "lucide-react"
import type { Ejercicio } from "@/types"
import { DialogEditarEjercicio } from "./dialog-editar-ejercicio"

interface CardEjercicioProps {
  ejercicio: Ejercicio
  onEliminar?: (id: string) => void
  onEditar?: () => void
}

export function CardEjercicio({ ejercicio, onEliminar, onEditar }: CardEjercicioProps) {
  const [dialogVideoAbierto, setDialogVideoAbierto] = useState(false)
  const [dialogEditarAbierto, setDialogEditarAbierto] = useState(false)

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base md:text-lg truncate">{ejercicio.nombre}</CardTitle>
              <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {ejercicio.grupoMuscular}
                </Badge>
                {ejercicio.subcategoria && (
                  <Badge variant="outline" className="text-xs">
                    {ejercicio.subcategoria}
                  </Badge>
                )}
              </div>
            </div>
            {ejercicio.videoUrl && (
              <Button size="icon" variant="ghost" onClick={() => setDialogVideoAbierto(true)} className="shrink-0">
                <Play className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {ejercicio.descripcion && (
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{ejercicio.descripcion}</p>
          )}

          {ejercicio.instrucciones && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-1">Instrucciones:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{ejercicio.instrucciones}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent text-xs md:text-sm"
              onClick={() => setDialogEditarAbierto(true)}
            >
              <Edit className="mr-1 md:mr-2 h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              onClick={() => {
                const id = ejercicio.id || ejercicio._id?.toString();
                if (!id) {
                  console.warn("❌ No se encontró ID del ejercicio:", ejercicio);
                  return;
                }
                onEliminar?.(id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver video */}
      <Dialog open={dialogVideoAbierto} onOpenChange={setDialogVideoAbierto}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">{ejercicio.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {ejercicio.videoUrl && (
              <div className="flex justify-center bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  className="max-h-[80vh] w-auto rounded-lg object-contain"
                >
                  <source src={ejercicio.videoUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            )}
            {ejercicio.instrucciones && (
              <div>
                <h4 className="font-semibold mb-2 text-sm md:text-base">Instrucciones:</h4>
                <p className="text-xs md:text-sm text-muted-foreground">{ejercicio.instrucciones}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DialogEditarEjercicio
        ejercicio={ejercicio}
        abierto={dialogEditarAbierto}
        onOpenChange={setDialogEditarAbierto}
        onEjercicioEditado={onEditar}
      />
    </>
  )
}
