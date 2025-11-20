// Tipos principales de la aplicación

export type TipoUsuario = "profesor" | "alumno"
export type ObjetivoAlumno = "fuerza" | "masa_muscular" | "rendimiento" | "salud"
export type PlanSuscripcion = "unico"

export interface Usuario {
  _id?: string
  id?: string
  nombre: string
  apellido: string        // 👈 nuevo
  dni: string
  telefono: string
  tipo: TipoUsuario
  avatar?: string
}

export interface Alumno extends Usuario {
  nivel: string
  estadoPlan: string
  tipo: "alumno"
  profesorId: string
  email?: string
  fechaNacimiento?: string | null
  genero?: "masculino" | "femenino" | "otro" | null
  objetivo?: ObjetivoAlumno
  objetivoPrincipal?: string | null
  lesiones?: string
  peso?: number | null
  altura?: number | null
  planActualId?: string | null
  registroCompleto: boolean
  activo?: boolean
  ciudad?: string
  provincia?: string
  pais?: string
}

export interface Profesor extends Usuario {
  tipo: "profesor"
  email: string
  nombreGimnasio?: string
  ciudad?: string
  provincia?: string
  fechaAlta?: string                // 👉 opcional, se autocompleta al registrar
  planSuscripcion?: PlanSuscripcion // 👉 opcional para el primer registro
  metodoPago?: string               // 👉 por ahora vacío
  limiteAlumnos?: number            // 👉 opcional (definí luego según plan)
  logo?: string                     // 👉 para subir foto o logo
  registroCompleto: boolean         // 👈 agregado para igualar comportamiento con Alumno
  activo?: boolean                  // 👈 opcional por si querés habilitar/deshabilitar cuentas
}

export interface Ejercicio {
  _id?: string // 👈 agregado
  id?: string
  nombre: string
  descripcion: string
  grupoMuscular: string
  subcategoria?: string
  videoUrl?: string
  instrucciones?: string
  profesorId: string
}

export interface BloqueEjercicio {
  ejercicioId: string
  series: number
  repeticiones: string // Puede ser "12" o "12-15" o "30 seg"
  descanso?: string
  notas?: string
}

export interface DiaEntrenamiento {
  _id?: string // 👈 agregado
  id?: string
  nombre: string
  bloques: BloqueEjercicio[]
  completado: boolean
  fechaCompletado?: string
  duracion?: number
}

export interface PlanEntrenamiento {
  _id?: string // 👈 agregado
  id?: string
  alumnoId: string
  nombre: string
  descripcion?: string
  fechaInicio: string
  fechaFin: string
  dias: DiaEntrenamiento[]
  diasCompletados: number
  totalDias: number
}

export interface Pago {
  _id?: string // 👈 agregado
  id?: string
  alumnoId: string
  monto: number
  fecha: string
  concepto: string
  estado: "pendiente" | "pagado" | "vencido"
}

export interface Mensaje {
  _id?: string // 👈 agregado
  id?: string
  remitenteId: string
  destinatarioId: string
  contenido: string
  fecha: string
  leido: boolean
}
