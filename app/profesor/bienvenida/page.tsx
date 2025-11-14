"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

export default function BienvenidaProfesor() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white text-center text-[#1E3A5F]">
            {/* 🔵 Halos laterales (degradé azul como las otras páginas) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Desktop halos */}
                <div className="hidden sm:block absolute left-[-20%] top-0 w-[55%] h-full bg-gradient-to-r from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>
                <div className="hidden sm:block absolute right-[-20%] top-0 w-[55%] h-full bg-gradient-to-l from-blue-300 via-blue-100 to-transparent blur-2xl opacity-90"></div>

                {/* Mobile halos */}
                <div className="block sm:hidden absolute top-[-20%] left-0 w-full h-[50%] bg-gradient-to-b from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
                <div className="block sm:hidden absolute bottom-[-20%] left-0 w-full h-[50%] bg-gradient-to-t from-blue-200 via-blue-100 to-transparent blur-2xl opacity-90"></div>
            </div>

            {/* 💨 Efecto de polvo */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 2], opacity: [0, 0.5, 0] }}
                transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
                className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[90vw] sm:w-[420px] h-[100px] sm:h-[140px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.2)_0%,transparent_70%)] blur-2xl"
            />

            {/* 🏋️ Barra cayendo con rebote */}
            <motion.div
                initial={{ y: -400, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    mass: 1.6,
                    restDelta: 0.001,
                }}
                // 🔹 Controlás la posición vertical solo para mobile
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 will-change-transform 
                           top-[47%] sm:top-[45%]"
            >
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-6, 0, -3, 0] }}
                    transition={{
                        delay: 0.6,
                        duration: 1.1,
                        ease: "easeOut",
                    }}
                >
                    <Image
                        src="/barra silueta.png"
                        alt="Barra silueta"
                        width={700}
                        height={170}
                        priority
                        // 🔹 Controlás escala y ancho para mobile
                        className="select-none mx-auto h-auto 
                                   w-[300vw] scale-[2]   // mobile
                                   sm:w-[600px] sm:scale-100 md:w-[620px]" // desktop intacto
                        draggable={false}
                    />
                </motion.div>
            </motion.div>

            {/* 🧠 Texto + logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 
                           top-[18%] sm:top-[15%]" // 🔹 Ajustá esta posición en mobile
            >
                <p
                    className="font-bold leading-tight 
                               text-[30px] mb-[2px]   // mobile
                               sm:text-4xl sm:mb-0"  // desktop igual
                >
                    Bienvenido a
                </p>
                <Image
                    src="/logorecortado.png"
                    alt="Lyfted Logo"
                    width={280}
                    height={80}
                    className="mx-auto select-none 
                               w-[70vw] h-auto      // mobile
                               sm:w-[260px]"       // desktop igual
                    draggable={false}
                />
            </motion.div>

            {/* 📄 Subtexto */}
            <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="
        absolute left-1/2 -translate-x-1/2 text-gray-700 text-center font-medium leading-tight whitespace-normal

        /* 📱 Mobile */
        top-[36%] text-[14px] max-w-[210px] leading-snug

        /* 💻 Desktop */
        sm:top-[34%] sm:text-lg sm:max-w-[320px]
    "
            >
                ¿Listo para llevar tus <br /> planificaciones al siguiente nivel?
            </motion.p>

            {/* 🔘 Botón */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.0, duration: 1.2, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 
                           top-[52%] sm:top-[50%]" // 🔹 Ajustá la altura del botón en mobile
            >
                <Button
                    className="bg-[#1E3A5F] text-white 
                               px-8 py-3 text-base   // mobile
                               sm:px-12 sm:py-5 sm:text-xl // desktop igual
                               rounded-lg font-semibold hover:bg-[#1E3A5F]/90 transition shadow-md"
                    onClick={() => router.push("/profesor/dashboard")}
                >
                    Empezar
                </Button>
            </motion.div>
        </div>
    )
}
