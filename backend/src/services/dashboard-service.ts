import { dashboardRepository } from "../db/repositories/dashboard-repository.js"
import type { DashboardSummary } from "../types/dashboard.js"

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    return dashboardRepository.getSummary()
  },
}
