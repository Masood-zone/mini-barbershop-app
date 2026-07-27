export type Service = {
  serviceId: number
  serviceName: string
  description: string | null
  price: number
  durationMinutes: number
  createdAt: string
  updatedAt: string
}

export type ServiceInput = {
  serviceName: string
  description: string | null
  price: number
  durationMinutes: number
}
