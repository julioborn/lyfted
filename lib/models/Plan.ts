import { Schema, model, models } from "mongoose"

const EjercicioPlanSchema = new Schema(
  {
    ejercicioId: { type: Schema.Types.ObjectId, ref: "Ejercicio", required: true },
    series: { type: Number, required: true },
    repeticiones: { type: String, required: true },
    descanso: { type: String },
    notas: { type: String },
  },
  { _id: false },
)

const DiaPlanSchema = new Schema(
  {
    nombre: { type: String, required: true },
    ejercicios: [EjercicioPlanSchema],
    completado: { type: Boolean, default: false },
    fechaCompletado: { type: Date },
  },
  { _id: true },
)

const PlanSchema = new Schema(
  {
    nombre: { type: String, required: true },
    alumnoId: { type: Schema.Types.ObjectId, ref: "Alumno", required: true },
    profesorId: { type: Schema.Types.ObjectId, ref: "Profesor", required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    dias: [DiaPlanSchema],
    activo: { type: Boolean, default: true },
    completado: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default models.Plan || model("Plan", PlanSchema)
