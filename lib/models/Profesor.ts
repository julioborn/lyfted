import { Schema, model, models } from "mongoose"

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
    planSuscripcion: {
      type: String,
      enum: ["basico", "profesional", "premium"],
      default: "basico",
    },
    metodoPago: { type: String },
    limiteAlumnos: { type: Number, default: 10 },
    avatar: { type: String },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default models.Profesor || model("Profesor", ProfesorSchema)
