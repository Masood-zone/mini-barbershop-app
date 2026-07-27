import type { RequestHandler } from "express"
import { dashboardService } from "../../services/dashboard-service.js"
import { successResponse } from "../../utils/api-response.js"

export const getDashboardSummary: RequestHandler = async (
  _request,
  response
) => {
  const summary = await dashboardService.getSummary()

  response.json(
    successResponse("Dashboard summary retrieved successfully.", summary)
  )
}
