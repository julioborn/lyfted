"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dumbbell, ClipboardList } from "lucide-react"

export default function LoginSelectorPage() {
    const router = useRouter()

    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white text-[#1E3A5F]">
            {/* 🔵 Halos dinámicos según tamaño de pantalla */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Desktop: halos laterales */}
                <div className="hidden sm:block absolute left-[-20%] top-0 w-[55%] h-full bg-linear-to-r from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>
                <div className="hidden sm:block absolute right-[-20%] top-0 w-[55%] h-full bg-linear-to-l from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>

                {/* Mobile: halos arriba y abajo */}
                <div className="block sm:hidden absolute top-[-20%] left-0 w-full h-[50%] bg-linear-to-b from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
                <div className="block sm:hidden absolute bottom-[-20%] left-0 w-full h-[50%] bg-linear-to-t from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
            </div>

            {/* 🌟 Contenedor general (imagen + contenido centrado) */}
            <div className="relative z-10 flex flex-col sm:flex-row-reverse items-center justify-center gap-6 px-6 sm:px-16 text-center sm:text-left">
                {/* 🖼️ Imagen izquierda */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden sm:block shrink-0"
                >
                    <Image
                        src="/Acopladosazul.png"
                        alt="Acoplados"
                        width={280}
                        height={280}
                        className="object-contain opacity-90 mix-blend-multiply mt-2"
                        priority
                    />
                </motion.div>

                {/* 💙 Contenido principal centrado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center"
                    >
                        <div className="relative flex justify-center items-center">
                            <Image
                                src="/logosinfondoazul.png"
                                alt="Lyfted Logo"
                                width={300}
                                height={300}
                                className="object-contain mb-2"
                                priority
                            />
                            <div className="absolute -bottom-0.5 w-[95%] mr-1 h-[3px] bg-black shadow-[0_5px_8px_rgba(30,58,95,0.9)] rounded"></div>
                        </div>

                    </motion.div>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-700 max-w-sm text-lg leading-relaxed -mt-5 mr-1.5"
                    >
                        Entrená mejor, planificá simple
                    </motion.p>


                    {/* Botones */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-row justify-center items-center gap-6 flex-wrap mt-6"
                    >
                        {/* Botón Entrenador */}
                        <div className="relative flex flex-col items-center">
                            <div className="absolute -top-7 flex items-center justify-center bg-[#1E3A5F] text-white p-2.5 rounded-full shadow-lg shadow-blue-900/20">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <Button
                                size="lg"
                                className="cursor-pointer w-36 h-12 text-base font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                                onClick={() => router.push("/login/profesor")}
                            >
                                Entrenador
                            </Button>
                        </div>

                        {/* Botón Alumno */}
                        <div className="relative flex flex-col items-center">
                            <div className="absolute -top-7 flex items-center justify-center bg-[#1E3A5F] text-white p-2.5 rounded-full shadow-lg shadow-blue-900/20">
                                <Dumbbell className="h-5 w-5" />
                            </div>
                            <Button
                                size="lg"
                                className="cursor-pointer w-36 h-12 text-base font-semibold flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 rounded-xl shadow-md hover:shadow-lg transition-all"
                                onClick={() => router.push("/login/alumno")}
                            >
                                Alumno
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
