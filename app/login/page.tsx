"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dumbbell, ClipboardList } from "lucide-react"

export default function LoginSelectorPage() {
    const router = useRouter()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center space-y-8"
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="shadow-md shadow-[#1E3A5F]/30 rounded-full overflow-hidden">
                        <Image
                            src="/logo-lyfted.png"
                            alt="Lyfted Logo"
                            width={110}
                            height={110}
                            className="object-cover object-center scale-125 rounded-full"
                            priority
                        />
                    </div>
                </div>

                {/* Título */}
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold text-[#1E3A5F]"
                >
                    LYFTED
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 max-w-sm text-lg leading-relaxed"
                >
                    Entrená mejor, planificá simple
                </motion.p>

                {/* Botones en línea */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-row justify-center items-center gap-5 flex-wrap mt-6"
                >
                    {/* Botón Entrenador */}
                    <div className="relative flex flex-col items-center">
                        <div className="absolute -top-7 flex items-center justify-center bg-[#1E3A5F] text-white p-2.5 rounded-full shadow-lg shadow-[#1E3A5F]/30">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <Button
                            size="sm"
                            className="cursor-pointer w-36 h-12 text-base font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                            onClick={() => router.push("/login/profesor")}
                        >
                            Entrenador
                        </Button>
                    </div>

                    {/* Botón Alumno */}
                    <div className="relative flex flex-col items-center">
                        <div className="absolute -top-7 flex items-center justify-center bg-[#1E3A5F] text-white p-2.5 rounded-full shadow-lg shadow-[#1E3A5F]/30">
                            <Dumbbell className="h-5 w-5" />
                        </div>
                        <Button
                            size="sm"
                            className="cursor-pointer w-36 h-12 text-base font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                            onClick={() => router.push("/login/alumno")}
                        >
                            Alumno
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
