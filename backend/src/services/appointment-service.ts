import { z } from "zod"
import { appointmentRepository } from "../db/repositories/appointment-repository.js"
import {
  appointmentStatuses,
  type Appointment,
  type AppointmentFilters,
  type AppointmentInput,
  type AppointmentStatus,
} from "../types/appointment.js"
import { ApiError } from "../utils/api-error.js"
import { parseWithSchema } from "../utils/validation.js"

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number)
    const date = new Date(Date.UTC(year!, month! - 1, day))

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month! - 1 &&
      date.getUTCDate() === day
    )
  }, "Use a valid calendar date.")

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/,
    "Use a valid 24-hour time."
  )
  .transform((value) => (value.length === 5 ? `${value}:00` : value))

const optionalNotesSchema = z
  .union([z.string().trim().max(2000), z.null()])
  .optional()
  .transform((value) => value || null)

const appointmentInputSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  serviceId: z.coerce.number().int().positive(),
  appointmentDate: dateSchema,
  appointmentTime: timeSchema,
  status: z.enum(appointmentStatuses).optional().default("Scheduled"),
  notes: optionalNotesSchema,
})

const appointmentFilterSchema = z.object({
  date: dateSchema.optional(),
  status: z.enum(appointmentStatuses).optional(),
})

const appointmentStatusSchema = z.object({
  status: z.enum(appointmentStatuses),
})

async function assertReferences(input: AppointmentInput): Promise<void> {
  const [customerExists, serviceExists] = await Promise.all([
    appointmentRepository.customerExists(input.customerId),
    appointmentRepository.serviceExists(input.serviceId),
  ])

  if (!customerExists) {
    throw new ApiError(400, "Selected customer does not exist.")
  }

  if (!serviceExists) {
    throw new ApiError(400, "Selected service does not exist.")
  }
}

export const appointmentService = {
  async list(input: unknown): Promise<Appointment[]> {
    const filters = parseWithSchema<AppointmentFilters>(
      appointmentFilterSchema,
      input,
      "Invalid appointment filters."
    )

    return appointmentRepository.findAll(filters)
  },

  async getById(appointmentId: number): Promise<Appointment> {
    const appointment = await appointmentRepository.findById(appointmentId)

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.")
    }

    return appointment
  },

  async create(input: unknown): Promise<Appointment> {
    const appointmentInput = parseWithSchema<AppointmentInput>(
      appointmentInputSchema,
      input,
      "Invalid appointment data."
    )
    await assertReferences(appointmentInput)

    return appointmentRepository.create(appointmentInput)
  },

  async update(appointmentId: number, input: unknown): Promise<Appointment> {
    const appointmentInput = parseWithSchema<AppointmentInput>(
      appointmentInputSchema,
      input,
      "Invalid appointment data."
    )
    await assertReferences(appointmentInput)
    const appointment = await appointmentRepository.update(
      appointmentId,
      appointmentInput
    )

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.")
    }

    return appointment
  },

  async updateStatus(
    appointmentId: number,
    input: unknown
  ): Promise<Appointment> {
    const { status } = parseWithSchema<{ status: AppointmentStatus }>(
      appointmentStatusSchema,
      input,
      "Invalid appointment status."
    )
    const appointment = await appointmentRepository.updateStatus(
      appointmentId,
      status
    )

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.")
    }

    return appointment
  },

  async delete(appointmentId: number): Promise<void> {
    const deleted = await appointmentRepository.delete(appointmentId)

    if (!deleted) {
      throw new ApiError(404, "Appointment not found.")
    }
  },
}
