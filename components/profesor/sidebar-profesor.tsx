"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Dumbbell, Calendar, DollarSign, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"

const menuItems = [
  {
    titulo: "Dashboard",
    href: "/profesor/dashboard",
    icon: LayoutDashboard,
  },
  {
    titulo: "Alumnos",
    href: "/profesor/alumnos",
    icon: Users,
  },
  {
    titulo: "Ejercicios",
    href: "/profesor/ejercicios",
    icon: Dumbbell,
  },
  {
    titulo: "Planes",
    href: "/profesor/planes",
    icon: Calendar,
  },
  {
    titulo: "Pagos",
    href: "/profesor/pagos",
    icon: DollarSign,
  },
  {
    titulo: "Mensajes",
    href: "/profesor/mensajes",
    icon: MessageSquare,
  },
]

export function SidebarProfesor() {
  const pathname = usePathname()
  const { usuario } = useAuth()
  const mensajesNoLeidos = usuario
    ? dataStore.getMensajes(usuario.id).filter((m) => m.destinatarioId === usuario.id && !m.leido).length
    : 0

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-57px)] p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.titulo}</span>
              </div>
              {item.href === "/profesor/mensajes" && mensajesNoLeidos > 0 && (
                <Badge variant={isActive ? "secondary" : "default"} className="h-5 min-w-5 px-1">
                  {mensajesNoLeidos}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
