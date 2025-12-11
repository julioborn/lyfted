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

                        s3: [
                            {
                                nombre: { type: String, required: true },

                                // 🔥 NUEVO NIVEL s4
                                s4: [
                                    {
                                        nombre: { type: String, required: true },
                                        ej: [String],
                                    }
                                ],

                                // ejercicios dentro de s3
                                ej: [String],
                            },
                        ],

                        // ejercicios dentro de s2
                        ej: [String],
                    },
                ],

                // ejercicios dentro de s1
                ej: [String],
            },
        ],

        // ejercicios directos en la categoria base
        ej: [String],
    },
    { timestamps: true }
);

export default models.CategoriaEjercicio ||
    model("CategoriaEjercicio", CategoriaEjercicioSchema, "categoriasEjercicios");
