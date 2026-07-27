import { ApiError } from "./api-error.js"

export function parseId(value: unknown, resource: string): number {
  if (typeof value !== "string") {
    throw new ApiError(400, `Invalid ${resource} ID.`)
  }

  const id = Number(value)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new ApiError(400, `Invalid ${resource} ID.`)
  }

  return id
}
