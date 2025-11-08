import { Schema, model, models, deleteModel } from "mongoose"

// 💥 eliminar modelo viejo si ya existe en memoria (para hot reload)
if (models.Profesor) {
  deleteModel("Profesor")
}

const ProfesorSchema = new Schema(
  {
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    telefono: { type: String },
    password: { type: String, required: true },
    nombreGimnasio: { type: String },
    email: { type: String, required: true, unique: true },
    ciudad: { type: String },
    provincia: { type: String },
    fechaAlta: { type: Date, default: Date.now },
    planSuscripcion: { type: String, default: "unico" },
    metodoPago: { type: String, default: "ninguno" },
    limiteAlumnos: { type: Number, default: 10 },
    avatar: { type: String },
    activo: { type: Boolean, default: true },
    registroCompleto: { type: Boolean, default: true },
    tipo: { type: String, default: "profesor" },
  },
  { timestamps: true }
)

export default model("Profesor", ProfesorSchema)
