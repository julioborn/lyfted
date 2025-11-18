import { Schema, model, models } from "mongoose"

const AlumnoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    telefono: { type: String },
    password: { type: String },
    email: { type: String },
    fechaNacimiento: { type: Date },
    genero: { type: String, enum: ["masculino", "femenino", "otro"] },

    objetivoPrincipal: {
      type: String,
      enum: ["fuerza", "masa muscular", "rendimiento", "salud"],
    },

    lesiones: { type: String },

    profesorId: { type: Schema.Types.ObjectId, ref: "Profesor", required: true },

    peso: { type: Number },
    altura: { type: Number },
    avatar: { type: String },

    // 🔥 Nivel del alumno
    nivel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado"],
      default: "principiante",
    },

    // 🔥 Estado del plan del alumno
    // Sin asignar | Vencido | Por vencer | Activo
    estadoPlan: {
      type: String,
      enum: ["sin_plan", "vencido", "por_vencer", "activo"],
      default: "sin_plan", // 👉 como pediste
    },

    planActualId: { type: Schema.Types.ObjectId, ref: "Plan" },

    registroCompleto: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default models.Alumno || model("Alumno", AlumnoSchema)
