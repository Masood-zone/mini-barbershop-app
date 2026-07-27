import type { ApiResponse } from "../types/api.js"

export function successResponse<T>(
  message: string,
  data: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(
  message: string,
  details?: unknown
): ApiResponse<unknown> {
  return {
    success: false,
    message,
    ...(details === undefined ? {} : { data: details }),
  }
}

