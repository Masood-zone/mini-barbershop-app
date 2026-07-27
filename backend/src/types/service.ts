export type Service = {
  serviceId: number
  serviceName: string
  description: string | null
  price: number
  durationMinutes: number
  createdAt: Date
  updatedAt: Date
}

export type ServiceInput = {
  serviceName: string
  description: string | null
  price: number
  durationMinutes: number
}
