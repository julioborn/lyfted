"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dumbbell, ClipboardList } from "lucide-react"

export default function LoginSelectorPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
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
                            width={120}
                            height={120}
                            className="object-cover object-center scale-125 rounded-full"
                            priority
                        />
                    </div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl font-bold text-[#1E3A5F]"
                >
                    LYFTED
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 max-w-sm text-xl"
                >
                    Entrená mejor, planificá simple
                </motion.p>

                {/* Botones con íconos animados */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-8 mt-10" 
                >
                    {/* Botón Entrenador */}
                    <div className="relative flex flex-col items-center">
                        <div className="absolute -top-8 flex items-center justify-center bg-[#1E3A5F] text-white p-3 rounded-full shadow-lg shadow-[#1E3A5F]/30">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <Button
                            size="lg"
                            className="cursor-pointer w-40 h-14 sm:w-48 sm:h-16 text-lg font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
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
                            className="cursor-pointer w-40 h-14 sm:w-48 sm:h-16 text-lg font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
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
