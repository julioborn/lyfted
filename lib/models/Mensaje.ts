import { Schema, model, models } from "mongoose"

const MensajeSchema = new Schema(
  {
    remitenteId: { type: Schema.Types.ObjectId, required: true },
    destinatarioId: { type: Schema.Types.ObjectId, required: true },
    tipoRemitente: { type: String, enum: ["profesor", "alumno"], required: true },
    mensaje: { type: String, required: true },
    leido: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default models.Mensaje || model("Mensaje", MensajeSchema)
