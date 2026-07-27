import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from "@/services/api/appointments/appointments.api"
import { appointmentKeys } from "@/services/api/appointments/appointments.keys"
import { dashboardKeys } from "@/services/api/dashboard/dashboard.keys"
import type { AppointmentFilters } from "@/types/appointment"

export function appointmentsQueryOptions(filters: AppointmentFilters = {}) {
  return queryOptions({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => getAppointments(filters),
  })
}

export function appointmentQueryOptions(appointmentId: number) {
  return queryOptions({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => getAppointment(appointmentId),
  })
}

export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery(appointmentsQueryOptions(filters))
}

export function useAppointment(appointmentId: number) {
  return useQuery({
    ...appointmentQueryOptions(appointmentId),
    enabled: Number.isInteger(appointmentId) && appointmentId > 0,
  })
}

function useAppointmentMutationInvalidation() {
  const client = useQueryClient()

  return async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: appointmentKeys.all }),
      client.invalidateQueries({ queryKey: dashboardKeys.all }),
    ])
  }
}

export function useCreateAppointment() {
  const invalidate = useAppointmentMutationInvalidation()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: invalidate,
  })
}

export function useUpdateAppointment() {
  const invalidate = useAppointmentMutationInvalidation()

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: invalidate,
  })
}

export function useUpdateAppointmentStatus() {
  const invalidate = useAppointmentMutationInvalidation()

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: invalidate,
  })
}

export function useDeleteAppointment() {
  const invalidate = useAppointmentMutationInvalidation()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: invalidate,
  })
}
