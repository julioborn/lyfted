"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"

export default function RegistroPorPasos({
    alumnoEncontrado,
    identificador,
    router,
}: {
    alumnoEncontrado: any
    identificador: string
    router: any
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
    const [aclaracionObjetivo, setAclaracionObjetivo] = useState("")
    const [lesiones, setLesiones] = useState("")

    const pasos = [
        {
            titulo: "Datos de acceso",
            descripcion: "Creá tu contraseña para tu cuenta.",
            contenido: (
                <div className="space-y-4">
                    <div>
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label>Confirmar contraseña</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
            ),
        },
        {
            titulo: "Información personal",
            descripcion: "Queremos conocerte mejor para adaptar tu plan.",
            contenido: (
                <div className="space-y-4">
                    <div>
                        <Label>Fecha de nacimiento</Label>
                        <Input
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                    </div>

                    <div>
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
                    </div>
                </div>
            ),
        },
        {
            titulo: "Contacto",
            descripcion: "Dejános tu mail y teléfono para mantenernos en contacto.",
            contenido: (
                <div className="space-y-4">
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                </div>
            ),
        },
        {
            titulo: "Objetivo principal",
            descripcion:
                "Elegí tu meta principal para adaptar el entrenamiento a tus objetivos.",
            contenido: (
                <div className="space-y-3">
                    <Label>Elegí tu objetivo principal</Label>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "🏋️‍♂️ Fuerza", value: "fuerza" },
                            { label: "💪 Masa muscular", value: "masa_muscular" },
                            { label: "⚡ Rendimiento", value: "rendimiento" },
                            { label: "❤️ Salud", value: "salud" },
                        ].map((obj) => (
                            <label key={obj.value} className="flex items-center gap-2 cursor-pointer">
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

                    <div className="mt-2">
                        <Label>Detalle adicional (opcional)</Label>
                        <Input
                            value={aclaracionObjetivo}
                            onChange={(e) => setAclaracionObjetivo(e.target.value)}
                            placeholder="Ej: fuerza y tonificación"
                        />
                    </div>
                </div>
            ),
        },
        {
            titulo: "Lesiones o limitaciones",
            descripcion:
                "Contanos si tenés alguna lesión o molestia para adaptar los ejercicios.",
            contenido: (
                <div className="space-y-4">
                    <Label>Lesiones o limitaciones</Label>
                    <Input
                        value={lesiones}
                        onChange={(e) => setLesiones(e.target.value)}
                        placeholder="Ej: rodilla, hombro, espalda..."
                    />
                </div>
            ),
        },
    ]

    const pasoActual = pasos[paso - 1]

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/alumnos/${alumnoEncontrado._id}/completar-registro`, {
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
                tipo: "alumno",
            })

            Swal.fire("✅", "Registro completado correctamente", "success").then(() =>
                router.replace("/alumno/bienvenida")
            )
        } catch (err) {
            Swal.fire("❌", "Error interno del servidor", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <motion.div
                key={paso}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                <h2 className="text-xl font-semibold text-center text-[#1E3A5F]">
                    {pasoActual.titulo}
                </h2>
                <p className="text-center text-gray-600 text-sm mb-3">{pasoActual.descripcion}</p>
                {pasoActual.contenido}

                <div className="flex justify-between mt-6">
                    {paso > 1 ? (
                        <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                            ← Volver
                        </Button>
                    ) : (
                        <div />
                    )}

                    {paso < pasos.length ? (
                        <Button
                            onClick={() => setPaso(paso + 1)}
                            className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
                        >
                            Siguiente →
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
                        >
                            {loading ? "Guardando..." : "Finalizar"}
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
