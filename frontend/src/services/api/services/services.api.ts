import { apiClient, unwrapResponse } from "@/services/api/client"
import type { ApiResponse } from "@/types/api"
import type { Service, ServiceInput } from "@/types/service"

export async function getServices(): Promise<Service[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Service[]>>("/services")
  )
}

export async function getService(serviceId: number): Promise<Service> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Service>>(`/services/${serviceId}`)
  )
}

export async function createService(input: ServiceInput): Promise<Service> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Service>>("/services", input)
  )
}

export async function updateService({
  serviceId,
  input,
}: {
  serviceId: number
  input: ServiceInput
}): Promise<Service> {
  return unwrapResponse(
    await apiClient.put<ApiResponse<Service>>(`/services/${serviceId}`, input)
  )
}

export async function deleteService(serviceId: number): Promise<void> {
  await apiClient.delete(`/services/${serviceId}`)
}
