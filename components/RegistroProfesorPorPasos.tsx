"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"

export default function RegistroProfesorPorPasos({ router }: { router: any }) {
    const [paso, setPaso] = useState(1)
    const [loading, setLoading] = useState(false)

    // 📋 Campos del formulario
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [dni, setDni] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [provincia, setProvincia] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [nombreGimnasio, setNombreGimnasio] = useState("")
    const [avatar, setAvatar] = useState<File | null>(null)
    const [metodoPago, setMetodoPago] = useState("ninguno")

    const siguiente = () => setPaso((p) => Math.min(p + 1, 3))
    const anterior = () => setPaso((p) => Math.max(p - 1, 1))

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/profesores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    dni,
                    nombre,
                    apellido,
                    email,
                    telefono,
                    password
                })
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                Swal.fire("❌", data.error || "Error al registrar el profesor", "error")
                return
            }

            // Auto-login
            const result = await signIn("credentials", {
                redirect: false,
                identificador: dni,
                password,
                tipo: "profesor",
            })

            if (result?.error) {
                Swal.fire("❌", "Error al iniciar sesión automáticamente", "error")
                return
            }

            Swal.fire("✅", "Registro completado correctamente", "success").then(() =>
                router.replace("/profesor/bienvenida")
            )
        } catch (err) {
            Swal.fire("❌", "Error interno del servidor", "error")
        } finally {
            setLoading(false)
        }
    }

    const variants = {
        enter: { opacity: 0, x: 40 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    }

    return (
        <div className="flex justify-center px-4 py-4">
            <div className="relative bg-white w-full max-w-md sm:max-w-3xl lg:max-w-4xl transition-all">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={paso}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                    >
                        {/* 📋 PANTALLA 1 */}
                        {paso === 1 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="Comencemos con tus datos principales"
                                    descripcion="Estos datos se usarán para crear tu cuenta y garantizar la seguridad de tu acceso."
                                />

                                <Label>Nombre y Apellido</Label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Apellido"
                                        value={apellido}
                                        onChange={(e) => setApellido(e.target.value)}
                                    />
                                </div>

                                <Label>DNI</Label>
                                <Input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                />

                                <Label>Ciudad</Label>
                                <Input
                                    type="text"
                                    value={ciudad}
                                    onChange={(e) => setCiudad(e.target.value)}
                                />

                                <Label>Provincia</Label>
                                <Input
                                    type="text"
                                    value={provincia}
                                    onChange={(e) => setProvincia(e.target.value)}
                                />

                                <Label>Contraseña</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Label>Confirmar contraseña</Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                <StepButtons paso={paso} siguiente={siguiente} />
                            </div>
                        )}

                        {/* 📞 PANTALLA 2 */}
                        {paso === 2 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="Queremos saber cómo contactarte"
                                    descripcion="Estos datos nos ayudan a personalizar tu perfil y que tus alumnos te reconozcan fácilmente."
                                />

                                <Label>Teléfono</Label>
                                <Input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />

                                <Label>Correo electrónico</Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Label>Nombre del gimnasio o marca personal</Label>
                                <Input
                                    type="text"
                                    value={nombreGimnasio}
                                    onChange={(e) => setNombreGimnasio(e.target.value)}
                                />

                                <Label>Logo o foto de perfil</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                                />

                                <StepButtons paso={paso} anterior={anterior} siguiente={siguiente} />
                            </div>
                        )}

                        {/* 🚀 PANTALLA 3 */}
                        {paso === 3 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="Tu cuenta está casi lista…"
                                    descripcion="Solo falta un último paso para empezar a usar LYFTED. Confirmá tu método de pago y activá tu suscripción para acceder a todas las herramientas de la plataforma."
                                />

                                <Label>Método de pago</Label>
                                <select
                                    className="border rounded w-full p-2"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <option value="ninguno">Seleccionar</option>
                                    <option value="tarjeta">Tarjeta de crédito</option>
                                    <option value="transferencia">Transferencia bancaria</option>
                                    <option value="otro">Otro</option>
                                </select>

                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={anterior}>
                                        ← Volver
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
                                    >
                                        {loading ? "Guardando..." : "Activar mi cuenta"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

/* 🔹 Título con descripción desplegable */
function StepTitle({ texto, descripcion }: { texto: string; descripcion: string }) {
    const [mostrarDescripcion, setMostrarDescripcion] = useState(false)

    return (
        <div className="flex flex-col items-center text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E3A5F] mb-1">
                {texto}
            </h3>

            <button
                type="button"
                onClick={() => setMostrarDescripcion((prev) => !prev)}
                className="text-gray-600 hover:text-[#1E3A5F]"
            >
                <motion.div
                    animate={{ rotate: mostrarDescripcion ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>

            <AnimatePresence>
                {mostrarDescripcion && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1"
                    >
                        {descripcion}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

/* 🔹 Botones siguiente / volver */
function StepButtons({
    paso,
    anterior,
    siguiente,
}: {
    paso: number
    anterior?: () => void
    siguiente: () => void
}) {
    return (
        <div className="flex justify-between mt-6">
            {paso > 1 ? (
                <Button variant="outline" onClick={anterior}>
                    ← Volver
                </Button>
            ) : (
                <div />
            )}
            <Button
                onClick={siguiente}
                className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
                Siguiente →
            </Button>
        </div>
    )
}
