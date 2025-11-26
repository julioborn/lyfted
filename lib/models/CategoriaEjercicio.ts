import { Schema, model, models } from "mongoose"

const CategoriaEjercicioSchema = new Schema(
    {
        cp: { type: String, required: true, unique: true },

        s1: [
            {
                nombre: { type: String, required: true },
                s2: [
                    {
                        nombre: { type: String, required: true },
                        ej: [String],
                    },
                ],
                ej: [String],
            },
        ],

        ej: [String],
    },
    { timestamps: true }
)

// 👇 ESTE NOMBRE ES LA CLAVE
export default models.CategoriaEjercicio ||
    model("CategoriaEjercicio", CategoriaEjercicioSchema, "categoriasEjercicios")
