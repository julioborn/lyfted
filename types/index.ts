// Tipos principales de la aplicación

export type TipoUsuario = "profesor" | "alumno"

export type ObjetivoAlumno = "fuerza" | "masa_muscular" | "rendimiento" | "salud"

export type PlanSuscripcion = "basico" | "profesional" | "premium"

export interface Usuario {
  id: string
  nombre: string
  dni: string
  telefono: string
  tipo: TipoUsuario
  avatar?: string
}

export interface Alumno extends Usuario {
  tipo: "alumno"
  profesorId: string
  email?: string
  fechaNacimiento?: string
  genero?: "masculino" | "femenino" | "otro"
  objetivo?: ObjetivoAlumno
  lesiones?: string
  peso?: number
  altura?: number
  planActualId?: string
  datosCompletados?: boolean // Para saber si completó el formulario inicial
}

export interface Profesor extends Usuario {
  tipo: "profesor"
  email: string
  nombreGimnasio?: string
  ciudad?: string
  provincia?: string
  fechaAlta: string
  planSuscripcion: PlanSuscripcion
  metodoPago?: string
  limiteAlumnos: number
  logo?: string
}

export interface Ejercicio {
  id: string
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
  id: string
  nombre: string // "Día 1 - Pecho y Tríceps"
  bloques: BloqueEjercicio[]
  completado: boolean
  fechaCompletado?: string
  duracion?: number // en minutos
}

export interface PlanEntrenamiento {
  id: string
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
  id: string
  alumnoId: string
  monto: number
  fecha: string
  concepto: string
  estado: "pendiente" | "pagado" | "vencido"
}

export interface Mensaje {
  id: string
  remitenteId: string
  destinatarioId: string
  contenido: string
  fecha: string
  leido: boolean
}
