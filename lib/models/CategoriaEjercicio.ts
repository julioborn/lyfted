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

                        // 🔥 Ahora soporta sub-subcategorías
                        s3: [
                            {
                                nombre: { type: String, required: true },
                                ej: [String],  // ejercicios dentro de s3
                            },
                        ],

                        // También permite ejercicios en s2 sin s3
                        ej: [String],
                    },
                ],

                // También permite ejercicios directos en s1
                ej: [String],
            },
        ],

        // Ejercicios directos en categoría base
        ej: [String],
    },
    { timestamps: true }
);

// 👇 ESTE NOMBRE ES LA CLAVE
export default models.CategoriaEjercicio ||
    model("CategoriaEjercicio", CategoriaEjercicioSchema, "categoriasEjercicios")
