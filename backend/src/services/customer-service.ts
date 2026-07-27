import { z } from "zod"
import { customerRepository } from "../db/repositories/customer-repository.js"
import {
  customerGenders,
  type Customer,
  type CustomerInput,
} from "../types/customer.js"
import { ApiError } from "../utils/api-error.js"
import { isReferencedRowError } from "../utils/database-error.js"
import { parseWithSchema } from "../utils/validation.js"

const optionalEmailSchema = z
  .union([z.string().trim().toLowerCase().email().max(100), z.literal(""), z.null()])
  .optional()
  .transform((value) => value || null)

const customerInputSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phoneNumber: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+() -]+$/, "Use a valid phone number."),
  email: optionalEmailSchema,
  gender: z
    .enum(customerGenders)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
})

function parseCustomerInput(input: unknown): CustomerInput {
  return parseWithSchema(
    customerInputSchema,
    input,
    "Invalid customer data."
  )
}

export const customerService = {
  async list(search?: string): Promise<Customer[]> {
    const normalizedSearch = search?.trim()
    return customerRepository.findAll(normalizedSearch || undefined)
  },

  async getById(customerId: number): Promise<Customer> {
    const customer = await customerRepository.findById(customerId)

    if (!customer) {
      throw new ApiError(404, "Customer not found.")
    }

    return customer
  },

  async create(input: unknown): Promise<Customer> {
    return customerRepository.create(parseCustomerInput(input))
  },

  async update(customerId: number, input: unknown): Promise<Customer> {
    const customer = await customerRepository.update(
      customerId,
      parseCustomerInput(input)
    )

    if (!customer) {
      throw new ApiError(404, "Customer not found.")
    }

    return customer
  },

  async delete(customerId: number): Promise<void> {
    try {
      const deleted = await customerRepository.delete(customerId)

      if (!deleted) {
        throw new ApiError(404, "Customer not found.")
      }
    } catch (error) {
      if (isReferencedRowError(error)) {
        throw new ApiError(
          409,
          "Customer cannot be deleted because appointments reference it."
        )
      }

      throw error
    }
  },
}
