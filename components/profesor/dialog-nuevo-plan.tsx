"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  children: React.ReactNode
  onPlanCreado?: () => void | Promise<void>
}

export function DialogNuevoPlan({ children, onPlanCreado }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(false)

  const crearPlan = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/planes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      })

      if (!res.ok) throw new Error("Error creando plan")

      setLoading(false)
      setOpen(false)
      setNombre("")

      onPlanCreado?.()
    } catch (e) {
      console.error("❌ Error al crear plan:", e)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Crear plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre del plan"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Button
            onClick={crearPlan}
            disabled={loading || !nombre}
            className="w-full bg-[#1E3A5F] text-white"
          >
            {loading ? "Creando..." : "Crear plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
