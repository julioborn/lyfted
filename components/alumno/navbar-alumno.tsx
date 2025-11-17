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
import { Dumbbell, LogOut, Menu, Home, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const rutasAlumno = [
  { ruta: "/alumno/dashboard", nombre: "Inicio", icono: Home },
  { ruta: "/alumno/planes", nombre: "Mis Planes", icono: Dumbbell },
  { ruta: "/alumno/pagos", nombre: "Pagos", icono: DollarSign },
  { ruta: "/alumno/asistencias", nombre: "Asistencias", icono: Calendar },
]

export function NavbarAlumno() {
  const { data: session } = useSession()
  const usuario = session?.user
  const pathname = usePathname()

  return (
    <nav className="bg-[#1E3A5F] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Menú lateral */}
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
              {rutasAlumno.map((item) => {
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
                      {item.nombre}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo central */}
        <Link
          href="/alumno/dashboard"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center"
        >
          {/* MOBILE */}
          <img
            src="/lyftedblanco.png"
            alt="Lyfted Logo"
            className="h-30 w-auto object-contain sm:hidden"
          />
          {/* DESKTOP */}
          <img
            src="/lyftedblanco.png"
            alt="Lyfted Logo"
            className="h-35 w-auto object-contain hidden sm:block"
          />
        </Link>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full text-white">
              <Avatar>
                <AvatarImage src={usuario?.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {usuario?.nombre?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{usuario?.nombre}</p>
              <p className="text-xs text-muted-foreground">{usuario?.email}</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  )
}
