"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface LoaderGlobalProps {
    minDuration?: number // milisegundos
}

export default function LoaderGlobal({ minDuration = 900 }: LoaderGlobalProps) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
        }, minDuration)

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
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}