export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type ApiErrorData = {
  success: false
  message: string
  data?: Record<string, string[] | undefined>
}
