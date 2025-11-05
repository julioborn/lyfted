"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dumbbell, LogOut, Menu, Home, DollarSign, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const rutasAlumno = [
  { ruta: "/alumno/dashboard", nombre: "Inicio", icono: Home },
  { ruta: "/alumno/perfil", nombre: "Mi Perfil", icono: User },
  { ruta: "/alumno/pagos", nombre: "Mis Pagos", icono: DollarSign },
  { ruta: "/alumno/mensajes", nombre: "Mensajes", icono: MessageCircle },
]

export function NavbarAlumno() {
  const { usuario, cerrarSesion } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Navegación</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              {rutasAlumno.map((item) => {
                const Icono = item.icono
                const esActiva = pathname.startsWith(item.ruta)

                return (
                  <Link key={item.ruta} href={item.ruta}>
                    <Button
                      variant={esActiva ? "default" : "ghost"}
                      className={cn("w-full justify-start gap-3", esActiva && "bg-primary text-primary-foreground")}
                    >
                      <Icono className="h-5 w-5" />
                      <span>{item.nombre}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/alumno/dashboard" className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">Mi Entrenamiento</span>
        </Link>

        {/* Avatar a la derecha */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={usuario?.avatar || "/placeholder.svg"} alt={usuario?.nombre} />
                <AvatarFallback>{usuario?.nombre.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{usuario?.nombre}</p>
                <p className="text-xs text-muted-foreground">{usuario?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/alumno/perfil">
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={cerrarSesion}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
