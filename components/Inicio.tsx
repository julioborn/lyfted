"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ClipboardList, Dumbbell } from "lucide-react"

export function Inicio() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-center p-6">

            {/* Logo y título */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center space-y-4 mb-16"
            >
                <div className="shadow-md shadow-[#1E3A5F]/30 rounded-full overflow-hidden w-[130px] h-[130px] flex items-center justify-center">
                    <Image
                        src="/logo-lyfted.png"
                        alt="Lyfted Logo"
                        width={130}
                        height={130}
                        className="object-cover object-center scale-125 rounded-full"
                        priority
                    />
                </div>

                <h1 className="text-5xl font-semibold tracking-tight text-[#1E3A5F] dark:text-white">
                    LYFTED
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">
                    Entrena mejor, planifica simple
                </p>
            </motion.div>

            {/* Botones */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-8"
            >
                {/* Botón Entrenador */}
                <div className="relative flex flex-col items-center">
                    <div className="absolute -top-8 flex items-center justify-center bg-[#1E3A5F] text-white p-3 rounded-full shadow-lg shadow-[#1E3A5F]/30">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                    <Button
                        size="lg"
                        className="w-38 h-14 sm:w-34 sm:h-12 text-lg font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F] cursor-pointer rounded-xl shadow-md hover:shadow-lg transition-all"
                        onClick={() => router.push("/login/profesor")}
                    >
                        Entrenador
                    </Button>
                </div>

                {/* Botón Alumno */}
                <div className="relative flex flex-col items-center">
                    <div className="absolute -top-8 flex items-center justify-center bg-[#1E3A5F] text-white p-3 rounded-full shadow-lg shadow-[#1E3A5F]/30">
                        <Dumbbell className="h-6 w-6" />
                    </div>
                    <Button
                        size="lg"
                        className="w-38 h-14 sm:w-34 sm:h-12 text-lg font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F] cursor-pointer rounded-xl shadow-md hover:shadow-lg transition-all"
                        onClick={() => router.push("/login/alumno")}
                    >
                        Alumno
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
