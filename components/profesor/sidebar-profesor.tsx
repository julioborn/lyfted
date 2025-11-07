"use client"

import Link from "next/link"
import { Dumbbell, Users, DollarSign, LogOut } from "lucide-react"

export function SidebarProfesor() {
    return (
        <aside className="w-60 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Panel Profesor</h2>
            <nav className="flex flex-col gap-3">
                <Link href="/profesor/dashboard" className="flex items-center gap-2 hover:text-blue-600">
                    <Dumbbell className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/profesor/alumnos" className="flex items-center gap-2 hover:text-blue-600">
                    <Users className="w-4 h-4" /> Alumnos
                </Link>
                <Link href="/profesor/pagos" className="flex items-center gap-2 hover:text-blue-600">
                    <DollarSign className="w-4 h-4" /> Pagos
                </Link>
                <Link href="/login" className="flex items-center gap-2 mt-auto text-red-500 hover:text-red-600">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                </Link>
            </nav>
        </aside>
    )
}
