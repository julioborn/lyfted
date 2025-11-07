"use client"

import { useSession, signOut } from "next-auth/react"
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
import { Dumbbell, LogOut, Menu, Home, Users, Calendar, DollarSign, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const rutasProfesor = [
  { ruta: "/profesor/dashboard", nombre: "Inicio", icono: Home },
  { ruta: "/profesor/alumnos", nombre: "Mis Alumnos", icono: Users },
  { ruta: "/profesor/planes", nombre: "Planes", icono: Calendar },
  { ruta: "/profesor/ejercicios", nombre: "Ejercicios", icono: Dumbbell },
  { ruta: "/profesor/pagos", nombre: "Pagos", icono: DollarSign },
  // { ruta: "/profesor/mensajes", nombre: "Mensajes", icono: MessageCircle },
]

export function NavbarProfesor() {
  const { data: session } = useSession()
  const usuario = session?.user
  const pathname = usePathname()

  return (
    <nav className="bg-[#1E3A5F] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Navegación</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              {rutasProfesor.map((item) => {
                const Icono = item.icono
                const esActiva = pathname.startsWith(item.ruta)
                return (
                  <Link key={item.ruta} href={item.ruta}>
                    <Button
                      variant={esActiva ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        esActiva
                          ? "bg-[#1E3A5F] text-white"
                          : "hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F]"
                      )}
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

        <Link
          href="/profesor/dashboard"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2"
        >
          <span className="font-bold text-lg tracking-wide">Lyfted</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full text-white">
              <Avatar>
                <AvatarImage src={usuario?.image || "/placeholder.svg"} alt={usuario?.nombre || "Profesor"} />
                <AvatarFallback>{usuario?.nombre?.charAt(0).toUpperCase() || "P"}</AvatarFallback>
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
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
