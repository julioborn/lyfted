import { Schema, model, models } from "mongoose"

const EntrenamientoSchema = new Schema(
  {
    alumnoId: { type: Schema.Types.ObjectId, ref: "Alumno", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    diaId: { type: Schema.Types.ObjectId, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date },
    duracion: { type: Number }, // en minutos
    completado: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default models.Entrenamiento || model("Entrenamiento", EntrenamientoSchema)
