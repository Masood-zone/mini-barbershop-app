import type { RequestHandler } from "express"
import { ApiError } from "../utils/api-error.js"

export const notFound: RequestHandler = (request, _response, next) => {
  next(
    new ApiError(
      404,
      `Route ${request.method} ${request.originalUrl} not found.`
    )
  )
}
