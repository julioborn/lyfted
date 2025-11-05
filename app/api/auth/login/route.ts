import { type NextRequest, NextResponse } from "next/server";
import conectarDB from "@/lib/mongodb";
import Profesor from "@/lib/models/Profesor";
import Alumno from "@/lib/models/Alumno";
import * as bcrypt from "bcryptjs"; // 👈 importante, *as bcrypt (no default)

export async function POST(request: NextRequest) {
  try {
    await conectarDB();

    const { identificador, password, tipo } = await request.json();

    console.log("[Lyfted] Intento de login:", { identificador, tipo });

    if (tipo === "profesor") {
      // 🔹 Buscar profesor por email
      const profesor = await Profesor.findOne({ email: identificador });

      if (!profesor) {
        console.log("❌ Profesor no encontrado");
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
      }

      // 🔐 Comparar contraseña cifrada
      const passwordValida = await bcrypt.compare(password, profesor.password);
      console.log("🔍 Comparando contraseñas:", passwordValida ? "OK" : "Falla");

      if (!passwordValida) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
      }

      return NextResponse.json({
        usuario: {
          id: profesor._id.toString(),
          nombre: profesor.nombre,
          email: profesor.email,
          dni: profesor.dni,
          tipo: "profesor",
          nombreGimnasio: profesor.nombreGimnasio,
          avatar: profesor.avatar,
        },
      });
    }

    // 🔹 Login para alumnos
    const alumno = await Alumno.findOne({ dni: identificador });

    if (!alumno) {
      console.log("❌ Alumno no encontrado");
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    if (!alumno.password) {
      console.log("⚠️ Alumno sin contraseña registrada");
      return NextResponse.json({ requiereRegistro: true }, { status: 200 });
    }

    const passwordValida = await bcrypt.compare(password, alumno.password);
    console.log("🔍 Comparando contraseñas (alumno):", passwordValida ? "OK" : "Falla");

    if (!passwordValida) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    return NextResponse.json({
      usuario: {
        id: alumno._id.toString(),
        nombre: alumno.nombre,
        email: alumno.email,
        dni: alumno.dni,
        tipo: "alumno",
        profesorId: alumno.profesorId?.toString(),
        planActualId: alumno.planActualId?.toString(),
        registroCompleto: alumno.registroCompleto,
        avatar: alumno.avatar,
      },
    });
  } catch (error) {
    console.error("[Lyfted] ❌ Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
