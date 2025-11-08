"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"

interface RegistroProfesorPorPasosProps {
    profesorEncontrado: {
        _id: string
        dni: string
        nombre?: string
        registroCompleto?: boolean
    }
    identificador: string
    router: any
}

export default function RegistroProfesorPorPasos({
    profesorEncontrado,
    identificador,
    router,
}: RegistroProfesorPorPasosProps) {

    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        email: "",
        nombreGimnasio: "",
        ciudad: "",
        provincia: "",
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) {
            Swal.fire("⚠️", "Las contraseñas no coinciden", "warning")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/profesores/${profesorEncontrado._id}/completar-registro`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!res.ok) {
                Swal.fire("❌", "Error al completar el registro", "error")
                return
            }

            // ✅ Iniciar sesión automáticamente
            await signIn("credentials", {
                redirect: false,
                identificador,
                password: form.password,
                tipo: "profesor",
            })

            Swal.fire("✅", "Registro completado con éxito", "success").then(() => {
                router.replace("/profesor/dashboard")
            })
        } catch (err) {
            Swal.fire("❌", "Error interno del servidor", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Nombre y Apellido</Label>
            <Input name="nombre" value={form.nombre} onChange={handleChange} required />

            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} required />

            <Label>Correo electrónico</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />

            <Label>Nombre del gimnasio o marca personal</Label>
            <Input name="nombreGimnasio" value={form.nombreGimnasio} onChange={handleChange} />

            <Label>Ciudad</Label>
            <Input name="ciudad" value={form.ciudad} onChange={handleChange} />

            <Label>Provincia</Label>
            <Input name="provincia" value={form.provincia} onChange={handleChange} />

            <Label>Contraseña</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} required />

            <Label>Confirmar contraseña</Label>
            <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
            >
                {loading ? "Guardando..." : "Finalizar registro"}
            </Button>
        </form>
    )
}
