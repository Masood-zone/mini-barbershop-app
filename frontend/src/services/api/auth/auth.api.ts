import { apiClient, unwrapResponse } from "@/services/api/client"
import type { AuthenticatedUser, LoginInput } from "@/types/auth"

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  return unwrapResponse(
    await apiClient.get<{
      success: boolean
      message: string
      data: AuthenticatedUser
    }>("/auth/me")
  )
}

export async function login(input: LoginInput): Promise<AuthenticatedUser> {
  return unwrapResponse(
    await apiClient.post<{
      success: boolean
      message: string
      data: AuthenticatedUser
    }>("/auth/login", input)
  )
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout")
}
