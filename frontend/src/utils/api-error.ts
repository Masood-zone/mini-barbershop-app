import axios from "axios"

import type { ApiErrorData } from "@/types/api"

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function getFieldErrors(
  error: unknown
): Record<string, string[] | undefined> {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    return error.response?.data?.data ?? {}
  }

  return {}
}
