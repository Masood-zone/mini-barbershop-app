import type { RequestHandler } from "express"
import { ApiError } from "../utils/api-error.js"

export const authenticate: RequestHandler = (request, _response, next) => {
  if (!request.session.userId) {
    next(new ApiError(401, "Authentication required."))
    return
  }

  next()
}
