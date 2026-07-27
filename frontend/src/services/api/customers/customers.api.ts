import { apiClient, unwrapResponse } from "@/services/api/client"
import type { ApiResponse } from "@/types/api"
import type { Customer, CustomerInput } from "@/types/customer"

export async function getCustomers(search = ""): Promise<Customer[]> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Customer[]>>("/customers", {
      params: search ? { search } : undefined,
    })
  )
}

export async function getCustomer(customerId: number): Promise<Customer> {
  return unwrapResponse(
    await apiClient.get<ApiResponse<Customer>>(`/customers/${customerId}`)
  )
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  return unwrapResponse(
    await apiClient.post<ApiResponse<Customer>>("/customers", input)
  )
}

export async function updateCustomer({
  customerId,
  input,
}: {
  customerId: number
  input: CustomerInput
}): Promise<Customer> {
  return unwrapResponse(
    await apiClient.put<ApiResponse<Customer>>(
      `/customers/${customerId}`,
      input
    )
  )
}

export async function deleteCustomer(customerId: number): Promise<void> {
  await apiClient.delete(`/customers/${customerId}`)
}
