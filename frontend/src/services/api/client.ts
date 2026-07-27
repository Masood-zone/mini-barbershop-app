import axios from "axios"

import type { ApiResponse } from "@/types/api"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3400/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.assign("/login")
    }

    return Promise.reject(error)
  }
)

export function unwrapResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data
}
