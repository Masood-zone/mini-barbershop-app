import type { ErrorRequestHandler } from "express"
import { ApiError } from "../utils/api-error.js"
import { errorResponse } from "../utils/api-response.js"

function isInvalidJsonError(error: unknown): boolean {
  return (
    error instanceof SyntaxError &&
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 400 &&
    "body" in error
  )
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next
) => {
  if (isInvalidJsonError(error)) {
    response.status(400).json(errorResponse("Invalid JSON payload."))
    return
  }

  if (error instanceof ApiError) {
    response
      .status(error.statusCode)
      .json(errorResponse(error.message, error.details))
    return
  }

  console.error(error)

  response.status(500).json(errorResponse("Internal server error."))
}
