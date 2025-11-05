import { Schema, model, models } from "mongoose"

const EjercicioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    grupoMuscular: { type: String, required: true },
    subcategoria: { type: String },
    descripcion: { type: String },
    videoUrl: { type: String },
    profesorId: { type: Schema.Types.ObjectId, ref: "Profesor", required: true },
  },
  {
    timestamps: true,
  },
)

export default models.Ejercicio || model("Ejercicio", EjercicioSchema)
