import Profesor from "@/lib/models/Profesor"
import conectarDB from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

/* ------------------------- 🔹 GET: Buscar profesor por DNI ------------------------- */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const dni = searchParams.get("dni")

    if (!dni)
        return NextResponse.json({ error: "DNI requerido" }, { status: 400 })

    await conectarDB()
    const profesor = await Profesor.findOne({ dni })

    if (!profesor)
        return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 })

    return NextResponse.json({ profesor })
}

/* ------------------------- 🔹 POST: Crear nuevo profesor ------------------------- */
export async function POST(req: Request) {
    try {
        await conectarDB()
        const body = await req.json()
        const { dni, nombre, apellido, email, telefono, fechaNacimiento, genero, password } = body

        // Validar campos obligatorios
        if (!dni || !nombre || !apellido || !email || !password) {
            return NextResponse.json(
                { error: "Todos los campos obligatorios deben completarse." },
                { status: 400 }
            )
        }

        // Verificar si ya existe
        const profesorExistente = await Profesor.findOne({ dni })
        if (profesorExistente) {
            return NextResponse.json(
                { error: "Ya existe un profesor registrado con ese DNI." },
                { status: 400 }
            )
        }

        const emailExistente = await Profesor.findOne({ email })
        if (emailExistente) {
            return NextResponse.json(
                { error: "Ya existe un profesor con ese correo electrónico." },
                { status: 400 }
            )
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear nuevo profesor
        const nuevoProfesor = await Profesor.create({
            dni,
            nombre,
            apellido,
            email,
            telefono,
            fechaNacimiento,
            genero,
            password: hashedPassword,
            creadoEn: new Date(),
        })

        return NextResponse.json(
            { message: "Profesor registrado correctamente", profesor: nuevoProfesor },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error al registrar profesor:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
