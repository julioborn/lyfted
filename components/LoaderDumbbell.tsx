"use client"

import { Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import clsx from "clsx"

type LoaderProps = {
    /** tamaño del ícono en px */
    size?: number
    /** color del ícono (clase tailwind) */
    colorClass?: string
    /** si true, muestra overlay de pantalla completa */
    overlay?: boolean
    /** texto accesible / subtítulo */
    label?: string
}

export default function LoaderDumbbell({
    size = 48,
    colorClass = "text-white",          // cambialo si querés otro color
    overlay = false,
    label = "Cargando...",
}: LoaderProps) {
    const icon = (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
                className={clsx(colorClass)}
            >
                <Dumbbell width={size} height={size} />
            </motion.div>
            {label && <span className="text-sm text-white/80">{label}</span>}
        </div>
    )

    if (!overlay) return icon

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            {icon}
        </div>
    )
}
