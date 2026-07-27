import { queryOptions, useQuery } from "@tanstack/react-query"

import { getDashboardSummary } from "@/services/api/dashboard/dashboard.api"
import { dashboardKeys } from "@/services/api/dashboard/dashboard.keys"

export function dashboardSummaryQueryOptions() {
  return queryOptions({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  })
}

export function useDashboardSummary() {
  return useQuery(dashboardSummaryQueryOptions())
}
