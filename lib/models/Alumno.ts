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
    planActualId: { type: Schema.Types.ObjectId, ref: "Plan" },
    registroCompleto: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default models.Alumno || model("Alumno", AlumnoSchema)
