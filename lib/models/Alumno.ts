import { Schema, model, models } from "mongoose"
import "@/lib/models/Plan"

const AlumnoSchema = new Schema(
  {
    nombre: { type: String, required: true },     // nombre de pila
    apellido: { type: String, required: true },   // nuevo campo

    dni: { type: String, required: true, unique: true },
    telefono: { type: String },

    // 📍 NUEVOS CAMPOS
    ciudad: { type: String },
    provincia: { type: String },
    pais: { type: String },

    password: { type: String },
    email: { type: String },
    fechaNacimiento: { type: Date },
    genero: {
      type: String,
      enum: ["masculino", "femenino", "otro", null],
      default: null
    },
    objetivoPrincipal: {
      type: String,
      enum: ["fuerza", "masa muscular", "rendimiento", "salud"],
      default: null,
    },

    lesiones: { type: String },

    profesorId: { type: Schema.Types.ObjectId, ref: "Profesor", required: true },

    peso: { type: Number },
    altura: { type: Number },
    avatar: { type: String },

    nivel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado"],
      default: "principiante",
    },

    estadoPlan: {
      type: String,
      enum: ["sin_plan", "vencido", "por_vencer", "activo"],
      default: "sin_plan",
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
