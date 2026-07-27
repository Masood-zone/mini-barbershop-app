import type { RequestHandler } from "express"
import { successResponse } from "../../utils/api-response.js"

export const getHealth: RequestHandler = (_request, response) => {
  response.json(
    successResponse("TrimTrack API is healthy.", {
      timestamp: new Date().toISOString(),
    })
  )
}

