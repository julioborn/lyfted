"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface LoaderGlobalProps {
    minDuration?: number // ms
}

export default function LoaderGlobal({ minDuration = 900 }: LoaderGlobalProps) {
    const [visible, setVisible] = useState(true)

    // ⏱ duración de una vuelta completa
    const rotationDuration = 2000 // 2 segundos = 1 giro completo

    useEffect(() => {
        // ✅ asegura que el loader dure al menos una vuelta
        const tiempoReal = Math.max(minDuration, rotationDuration)

        const timer = setTimeout(() => {
            setVisible(false)
        }, tiempoReal)

        return () => clearTimeout(timer)
    }, [minDuration])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md bg-white/80"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    <motion.img
                        src="/favicon.ico"
                        alt="Cargando..."
                        className="w-20 h-20"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.8, 1, 0.8],
                            rotate: 360,
                        }}
                        transition={{
                            scale: {
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                            opacity: {
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                            rotate: {
                                duration: rotationDuration / 1000,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
