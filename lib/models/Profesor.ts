import { Schema, model, models, deleteModel } from "mongoose"

// 💥 eliminar modelo viejo si ya existe (para evitar errores en desarrollo con hot reload)
if (models.Profesor) {
  deleteModel("Profesor")
}

const ProfesorSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    fechaNacimiento: { type: String },
    genero: { type: String },

    // 🔐 Seguridad
    password: { type: String, required: true },

    // 🏋️‍♂️ Datos del gimnasio o configuración
    nombreGimnasio: { type: String },
    ciudad: { type: String },
    provincia: { type: String },

    // 💳 Suscripción y límites
    planSuscripcion: { type: String, default: "unico" },
    metodoPago: { type: String, default: "ninguno" },
    limiteAlumnos: { type: Number, default: 10 },

    // ⚙️ Configuración adicional
    avatar: { type: String },
    activo: { type: Boolean, default: true },
    registroCompleto: { type: Boolean, default: true },
    tipo: { type: String, default: "profesor" },

    // 🕒 Fechas
    fechaAlta: { type: Date, default: Date.now },
    creadoEn: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default models.Profesor || model("Profesor", ProfesorSchema)
