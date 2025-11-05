import { Schema, model, models } from "mongoose"

const PagoSchema = new Schema(
  {
    alumnoId: { type: Schema.Types.ObjectId, ref: "Alumno", required: true },
    profesorId: { type: Schema.Types.ObjectId, ref: "Profesor", required: true },
    monto: { type: Number, required: true },
    concepto: { type: String, required: true },
    fechaVencimiento: { type: Date, required: true },
    fechaPago: { type: Date },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "vencido"],
      default: "pendiente",
    },
    metodoPago: { type: String },
  },
  {
    timestamps: true,
  },
)

export default models.Pago || model("Pago", PagoSchema)
