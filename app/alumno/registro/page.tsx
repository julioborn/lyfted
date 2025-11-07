"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegistroAlumnoPage() {
    const router = useRouter()
    const [dni, setDni] = useState("")
    const [alumno, setAlumno] = useState<any>(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [genero, setGenero] = useState("")
    const [objetivoPrincipal, setObjetivoPrincipal] = useState("")
    const [lesiones, setLesiones] = useState("")
    const [enviando, setEnviando] = useState(false)

    const handleBuscarAlumno = async () => {
        if (!dni) {
            Swal.fire("⚠️", "Por favor ingresá tu DNI", "warning")
            return
        }

        try {
            const res = await fetch(`/api/alumnos/by-dni?dni=${dni}`)
            const data = await res.json()

            if (!res.ok) {
                Swal.fire("❌", data.error || "Alumno no encontrado", "error")
                return
            }

            if (data.alumno.registroCompleto) {
                Swal.fire("ℹ️", "Tu registro ya está completo. Te redirigimos...", "info")
                router.replace("/alumno/bienvenida")
                return
            }

            setAlumno(data.alumno)
            Swal.fire("✅", "Alumno encontrado, completá tus datos.", "success")
        } catch (error) {
            Swal.fire("❌", "Error al buscar el alumno", "error")
        }
    }

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!alumno) return

        if (password !== confirmPassword) {
            Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
            return
        }

        setEnviando(true)
        try {
            const res = await fetch(`/api/alumnos/${alumno._id}/completar-registro`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password,
                    email,
                    telefono,
                    fechaNacimiento,
                    genero,
                    objetivoPrincipal,
                    lesiones,
                }),
            })

            if (!res.ok) {
                Swal.fire("❌", "Error al completar el registro", "error")
                return
            }

            // ✅ Inicia sesión automáticamente recién ahora
            await signIn("credentials", {
                redirect: false,
                identificador: dni,
                password,
                tipo: "alumno",
            })

            Swal.fire("✅", "Registro completado correctamente.", "success").then(() => {
                router.replace("/alumno/bienvenida")
            })
        } catch (error) {
            Swal.fire("❌", "Error interno del servidor", "error")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            {!alumno ? (
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4 text-center">Ingresá tu DNI</h2>
                    <Input
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        placeholder="Ej: 43844409"
                    />
                    <Button onClick={handleBuscarAlumno} className="w-full mt-4 bg-blue-600 text-white">
                        Buscar Alumno
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleRegistro} className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-xl font-bold text-center mb-2">
                        Completá tu registro
                    </h2>

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
                        <Label>Confirmar Contraseña</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

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
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Fecha de Nacimiento</Label>
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

                    <div>
                        <Label>Objetivo Principal</Label>
                        <select
                            className="border rounded w-full p-2"
                            value={objetivoPrincipal}
                            onChange={(e) => setObjetivoPrincipal(e.target.value)}
                        >
                            <option value="">Seleccionar</option>
                            <option value="fuerza">Fuerza</option>
                            <option value="masa_muscular">Masa muscular</option>
                            <option value="rendimiento">Rendimiento</option>
                            <option value="salud">Salud</option>
                        </select>
                    </div>

                    <div>
                        <Label>Lesiones o limitaciones</Label>
                        <Input
                            value={lesiones}
                            onChange={(e) => setLesiones(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white"
                        disabled={enviando}
                    >
                        {enviando ? "Registrando..." : "Finalizar Registro"}
                    </Button>
                </form>
            )}
        </div>
    )
}
