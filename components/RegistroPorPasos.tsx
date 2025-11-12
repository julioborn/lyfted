"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"

export default function RegistroPorPasos({
    alumnoEncontrado,
    identificador,
    router,
    tipo,
}: {
    alumnoEncontrado: any
    identificador: string
    router: any
    tipo: "alumno" | "profesor"
}) {
    const [paso, setPaso] = useState(1)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [genero, setGenero] = useState("")
    const [objetivoPrincipal, setObjetivoPrincipal] = useState("")
    const [lesiones, setLesiones] = useState("")
    const [aclaracionObjetivo, setAclaracionObjetivo] = useState("")

    const siguiente = () => setPaso((p) => Math.min(p + 1, 5))
    const anterior = () => setPaso((p) => Math.max(p - 1, 1))

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
            return
        }

        setLoading(true)
        try {
            const url =
                tipo === "profesor"
                    ? `/api/profesores/${alumnoEncontrado._id}/completar-registro`
                    : `/api/alumnos/${alumnoEncontrado._id}/completar-registro`

            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password,
                    email,
                    telefono,
                    fechaNacimiento,
                    genero,
                    objetivoPrincipal,
                    aclaracionObjetivo,
                    lesiones,
                }),
            })

            if (!res.ok) {
                Swal.fire("❌", "Error al completar el registro", "error")
                return
            }

            await signIn("credentials", {
                redirect: false,
                identificador,
                password,
                tipo,
            })

            Swal.fire("✅", "Registro completado correctamente", "success").then(() =>
                router.replace(
                    tipo === "profesor" ? "/profesor/dashboard" : "/alumno/bienvenida"
                )
            )
        } catch {
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
        <div className="flex justify-center px-4 py-6">
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
                        {/* ------------------- PASO 1 ------------------- */}
                        {paso === 1 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="Contanos sobre vos"
                                    descripcion="Queremos conocerte un poco más para planificar tu entrenamiento de manera personalizada y acorde a tus necesidades."
                                />

                                <Label>DNI</Label>
                                <Input
                                    value={alumnoEncontrado.dni}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />

                                <Label>Nombre y Apellido</Label>
                                <Input
                                    value={`${alumnoEncontrado.nombre}`}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />

                                <Label>Fecha de nacimiento</Label>
                                <Input
                                    type="date"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                />

                                <Label>Género</Label>
                                <select
                                    className="border rounded w-full p-2"
                                    value={genero}
                                    onChange={(e) => setGenero(e.target.value)}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>

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

                                <StepButtons paso={paso} anterior={anterior} siguiente={siguiente} />
                            </div>
                        )}

                        {/* ------------------- PASO 2 ------------------- */}
                        {paso === 2 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="¿Cómo podemos mantenernos en contacto?"
                                    descripcion="Dejanos tus datos para poder comunicarnos con vos y acompañarte en tu progreso dentro de la app."
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

                                <StepButtons paso={paso} anterior={anterior} siguiente={siguiente} />
                            </div>
                        )}

                        {/* ------------------- PASOS RESTANTES ------------------- */}
                        {paso === 3 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="¿Qué querés lograr con tu entrenamiento?"
                                    descripcion="Nos gustaría saber cuál es tu principal objetivo para diseñar un plan que te acerque a eso que querés conseguir."
                                />

                                <div className="flex flex-col gap-2">
                                    {[
                                        { label: "🏋️‍♂️ Fuerza", value: "fuerza" },
                                        { label: "💪 Aumento de masa muscular", value: "masa_muscular" },
                                        { label: "⚡ Rendimiento", value: "rendimiento" },
                                        { label: "❤️ Salud", value: "salud" },
                                    ].map((obj) => (
                                        <label
                                            key={obj.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="objetivoPrincipal"
                                                value={obj.value}
                                                checked={objetivoPrincipal === obj.value}
                                                onChange={(e) => setObjetivoPrincipal(e.target.value)}
                                                className="accent-[#1E3A5F] w-4 h-4"
                                            />
                                            <span>{obj.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <StepButtons paso={paso} anterior={anterior} siguiente={siguiente} />
                            </div>
                        )}

                        {paso === 4 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="¿Tenés alguna lesión o limitación?"
                                    descripcion="Es importante conocer si hay algo que debamos tener en cuenta para adaptar los ejercicios y cuidar tu bienestar."
                                />

                                <Input
                                    value={lesiones}
                                    onChange={(e) => setLesiones(e.target.value)}
                                    placeholder="Ej: rodilla, hombro, espalda..."
                                />

                                <StepButtons paso={paso} anterior={anterior} siguiente={siguiente} />
                            </div>
                        )}

                        {paso === 5 && (
                            <div className="space-y-4">
                                <StepTitle
                                    texto="Contanos un poco más sobre tu meta (opcional)"
                                    descripcion="Este espacio es para que desarrolles mejor los objetivos que planteaste antes."
                                />

                                <textarea
                                    value={aclaracionObjetivo}
                                    onChange={(e) => setAclaracionObjetivo(e.target.value)}
                                    className="border rounded w-full p-2 min-h-24"
                                    placeholder="Ej: Quiero ganar fuerza en tren inferior y mejorar mi resistencia."
                                />

                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={anterior}>
                                        ← Volver
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
                                    >
                                        {loading ? "Guardando..." : "Finalizar"}
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
        <div className="flex flex-col items-center text-center mb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-[#1E3A5F] mb-0">
                {texto}
            </h3>

            <button
                type="button"
                onClick={() => setMostrarDescripcion((prev) => !prev)}
                className="text-gray-600 hover:text-[#1E3A5F] mb-0"
            >
                <motion.div
                    animate={{ rotate: mostrarDescripcion ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {mostrarDescripcion && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-1"
                    >
                        {descripcion}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

/* 🔹 Botones de navegación */
function StepButtons({
    paso,
    anterior,
    siguiente,
}: {
    paso: number
    anterior: () => void
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
