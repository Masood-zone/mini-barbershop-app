import type { RequestHandler } from "express"
import { healthService } from "../../services/health-service.js"
import { successResponse } from "../../utils/api-response.js"

export const getHealth: RequestHandler = async (_request, response) => {
  const status = await healthService.getStatus()

  response.json(
    successResponse("TrimTrack API is healthy.", status)
  )
}
