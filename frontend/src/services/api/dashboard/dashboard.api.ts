import { apiClient, unwrapResponse } from "@/services/api/client"
import type { ApiResponse } from "@/types/api"
import type { DashboardSummary } from "@/types/dashboard"

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary")
  )
}
