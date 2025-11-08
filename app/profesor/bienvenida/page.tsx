"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

export default function BienvenidaProfesor() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-white text-center p-6 pt-24 overflow-hidden">
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl font-semibold text-[#1E3A5F] mb-4"
            >
                Bienvenido a
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="mb-8"
            >
                <Image
                    src="/logorecortado.png"
                    alt="Lyfted Logo Completo"
                    width={280}
                    height={80}
                    priority
                    className="mx-auto"
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-gray-600 max-w-md mb-8 text-lg leading-relaxed"
            >
                Tu gimnasio, tus alumnos y tu marca en un solo lugar.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <Button
                    className="bg-[#1E3A5F] text-white px-8 py-3 rounded-lg text-lg hover:bg-[#1E3A5F]/90 transition"
                    onClick={() => router.push("/profesor/dashboard")}
                >
                    Empezar
                </Button>
            </motion.div>
        </div>
    )
}
