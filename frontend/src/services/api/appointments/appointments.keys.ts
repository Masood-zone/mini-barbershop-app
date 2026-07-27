import type { AppointmentFilters } from "@/types/appointment"

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: AppointmentFilters) =>
    [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (appointmentId: number) =>
    [...appointmentKeys.details(), appointmentId] as const,
}
