import type { ErrorRequestHandler } from "express"
import { ApiError } from "../utils/api-error.js"
import { errorResponse } from "../utils/api-response.js"
import { env } from "../config/env.js"

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next
) => {
  if (error instanceof ApiError) {
    response
      .status(error.statusCode)
      .json(errorResponse(error.message, error.details))
    return
  }

  console.error(error)

  response
    .status(500)
    .json(
      errorResponse(
        "Internal server error.",
        env.NODE_ENV === "development" ? error : undefined
      )
    )
}

