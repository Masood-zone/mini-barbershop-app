import { apiClient, unwrapResponse } from "@/services/api/client"
import type { ApiResponse } from "@/types/api"
import type {
  Appointment,
  AppointmentFilters,
  AppointmentInput,
  AppointmentStatus,
} from "@/types/appointment"

export async function getAppointments(
  filters: AppointmentFilters = {}
): Promise<Appointment[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Appointment[]>>("/appointments", {
      params: {
        date: filters.date || undefined,
        status: filters.status || undefined,
      },
    })
  )
}

export async function getAppointment(
  appointmentId: number
): Promise<Appointment> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}`
    )
  )
}

export async function createAppointment(
  input: AppointmentInput
): Promise<Appointment> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Appointment>>("/appointments", input)
  )
}

export async function updateAppointment({
  appointmentId,
  input,
}: {
  appointmentId: number
  input: AppointmentInput
}): Promise<Appointment> {
  return unwrapResponse(
    await apiClient.put<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}`,
      input
    )
  )
}

export async function updateAppointmentStatus({
  appointmentId,
  status,
}: {
  appointmentId: number
  status: AppointmentStatus
}): Promise<Appointment> {
  return unwrapResponse(
    await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}/status`,
      { status }
    )
  )
}

export async function deleteAppointment(
  appointmentId: number
): Promise<void> {
  await apiClient.delete(`/appointments/${appointmentId}`)
}
