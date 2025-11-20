import { Schema, model, models } from "mongoose"

const EjercicioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    grupoMuscular: { type: String, required: true },
    subcategoria: { type: String },
    descripcion: { type: String },
    videoUrl: { type: String },

    // ✅ Nuevo sistema
    origen: {
      type: String,
      enum: ["base", "profesor"],
      default: "base"
    },

    // Solo si es personalizado
    profesorId: {
      type: Schema.Types.ObjectId,
      ref: "Profesor",
      required: function () {
        return this.origen === "profesor"
      }
    },

    // Si proviene de un ejercicio base
    ejercicioBaseId: {
      type: Schema.Types.ObjectId,
      ref: "Ejercicio",
      default: null
    }
  },
  { timestamps: true }
)

export default models.Ejercicio || model("Ejercicio", EjercicioSchema)
