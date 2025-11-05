"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, Timer } from "lucide-react"

interface CronometroEntrenamientoProps {
  onIniciar?: () => void
  onPausar?: () => void
  onFinalizar?: (duracion: number) => void
  enSesion: boolean
}

export function CronometroEntrenamiento({ onIniciar, onPausar, onFinalizar, enSesion }: CronometroEntrenamientoProps) {
  const [segundos, setSegundos] = useState(0)
  const [activo, setActivo] = useState(false)
  const intervaloRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => {
        setSegundos((s) => s + 1)
      }, 1000)
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
      }
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
      }
    }
  }, [activo])

  const formatearTiempo = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600)
    const minutos = Math.floor((totalSegundos % 3600) / 60)
    const segs = totalSegundos % 60

    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  const handleIniciar = () => {
    setActivo(true)
    if (onIniciar) onIniciar()
  }

  const handlePausar = () => {
    setActivo(false)
    if (onPausar) onPausar()
  }

  const handleFinalizar = () => {
    setActivo(false)
    const duracionMinutos = Math.floor(segundos / 60)
    if (onFinalizar) onFinalizar(duracionMinutos)
    setSegundos(0)
  }

  if (!enSesion) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mx-auto">
              <Timer className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Listo para entrenar?</h3>
              <p className="text-sm text-muted-foreground">Inicia tu sesión de entrenamiento</p>
            </div>
            <Button size="lg" onClick={handleIniciar} className="w-full">
              <Play className="mr-2 h-5 w-5" />
              Iniciar Entrenamiento
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border-accent">
      <CardHeader>
        <CardTitle className="text-center">Entrenamiento en Progreso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold font-mono">{formatearTiempo(segundos)}</div>
          <p className="text-sm text-muted-foreground mt-2">Tiempo transcurrido</p>
        </div>

        <div className="flex gap-2">
          {activo ? (
            <Button variant="outline" onClick={handlePausar} className="flex-1 bg-transparent">
              <Pause className="mr-2 h-4 w-4" />
              Pausar
            </Button>
          ) : (
            <Button variant="outline" onClick={handleIniciar} className="flex-1 bg-transparent">
              <Play className="mr-2 h-4 w-4" />
              Reanudar
            </Button>
          )}
          <Button variant="default" onClick={handleFinalizar} className="flex-1">
            <Square className="mr-2 h-4 w-4" />
            Finalizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
