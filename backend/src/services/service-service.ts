import { z } from "zod"
import { serviceRepository } from "../db/repositories/service-repository.js"
import type { Service, ServiceInput } from "../types/service.js"
import { ApiError } from "../utils/api-error.js"
import { isReferencedRowError } from "../utils/database-error.js"
import { parseWithSchema } from "../utils/validation.js"

const optionalDescriptionSchema = z
  .union([z.string().trim().max(255), z.null()])
  .optional()
  .transform((value) => value || null)

const serviceInputSchema = z.object({
  serviceName: z.string().trim().min(2).max(100),
  description: optionalDescriptionSchema,
  price: z.coerce.number().finite().min(0).max(99_999_999.99),
  durationMinutes: z.coerce.number().int().min(1).max(65_535),
})

function parseServiceInput(input: unknown): ServiceInput {
  return parseWithSchema(serviceInputSchema, input, "Invalid service data.")
}

export const serviceService = {
  async list(): Promise<Service[]> {
    return serviceRepository.findAll()
  },

  async getById(serviceId: number): Promise<Service> {
    const service = await serviceRepository.findById(serviceId)

    if (!service) {
      throw new ApiError(404, "Service not found.")
    }

    return service
  },

  async create(input: unknown): Promise<Service> {
    return serviceRepository.create(parseServiceInput(input))
  },

  async update(serviceId: number, input: unknown): Promise<Service> {
    const service = await serviceRepository.update(
      serviceId,
      parseServiceInput(input)
    )

    if (!service) {
      throw new ApiError(404, "Service not found.")
    }

    return service
  },

  async delete(serviceId: number): Promise<void> {
    try {
      const deleted = await serviceRepository.delete(serviceId)

      if (!deleted) {
        throw new ApiError(404, "Service not found.")
      }
    } catch (error) {
      if (isReferencedRowError(error)) {
        throw new ApiError(
          409,
          "Service cannot be deleted because appointments reference it."
        )
      }

      throw error
    }
  },
}
