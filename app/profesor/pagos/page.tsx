"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Clock, CheckCircle } from "lucide-react"
import { DialogNuevoPago } from "@/components/profesor/dialog-nuevo-pago"
import type { Pago } from "@/types"

export default function PagosPage() {
  const { data: session } = useSession()
  const usuario = session?.user

  const [pagos, setPagos] = useState<Pago[]>([])
  const [cargando, setCargando] = useState(true)

  const cargarPagos = async () => {
    try {
      const pagosBD = await dataStore.getPagos()
      setPagos(Array.isArray(pagosBD) ? pagosBD : [])
    } catch (error) {
      console.error("❌ Error al cargar pagos:", error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPagos()
  }, [])

  // ✅ Clasificación lógica
  const hoy = new Date()

  const pendientes = pagos.filter(p => p.estado === "pendiente")

  const realizados = pagos.filter(p => p.estado === "pagado")

  const porVencer = pagos.filter(p => {
    if (p.estado !== "pendiente") return false
    const fecha = new Date(p.fecha)
    const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / 86400000)
    return diff <= 5 && diff >= 0
  })

  return (
    <div
      className="
        space-y-6
        p-6
        w-full
        sm:w-[95%]
        lg:w-[90%]
        flex flex-col
        justify-start
        mx-auto
      "
    >
      <h1 className="text-3xl font-semibold text-[#1E3A5F] text-center lg:text-left">
        Pagos
      </h1>

      {/* 🔹 BOTONES DE ESTADO */}
      <div className="grid grid-cols-3 gap-4">

        {/* PENDIENTES */}
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Pendientes</span>
          <Badge className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-1">
            {pendientes.length}
          </Badge>
        </Card>

        {/* POR VENCER */}
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Por vencer</span>
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full text-xs px-2 py-1">
            {porVencer.length}
          </Badge>
        </Card>

        {/* REALIZADOS */}
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-xl h-28 flex flex-col items-center justify-center relative hover:scale-[1.02] transition-all cursor-pointer">
          <span className="text-[#1E3A5F] font-semibold">Realizados</span>
          <Badge className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs px-2 py-1">
            {realizados.length}
          </Badge>
        </Card>

      </div>

      <DialogNuevoPago onPagoCreado={cargarPagos}>
        <Card className="bg-[#E8F1FF] border border-[#1E3A5F]/20 shadow-md rounded-2xl h-32 flex items-center justify-center hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
          <div className="flex flex-col items-center text-[#1E3A5F]">
            <Plus className="h-8 w-8 mb-1" />
            <span className="font-semibold text-lg">Registrar Pago</span>
          </div>
        </Card>
      </DialogNuevoPago>

    </div>
  )
}
