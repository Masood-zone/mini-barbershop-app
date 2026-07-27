import { z } from "zod"
import { ApiError } from "./api-error.js"

export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  value: unknown,
  message: string
): T {
  const result = schema.safeParse(value)

  if (!result.success) {
    throw new ApiError(400, message, result.error.flatten().fieldErrors)
  }

  return result.data
}
