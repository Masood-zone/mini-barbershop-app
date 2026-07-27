export const appointmentStatuses = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
] as const

export type AppointmentStatus = (typeof appointmentStatuses)[number]

export type AppointmentCustomer = {
  customerId: number
  fullName: string
  phoneNumber: string
  email: string | null
}

export type AppointmentService = {
  serviceId: number
  serviceName: string
  price: number
  durationMinutes: number
}

export type Appointment = {
  appointmentId: number
  customer: AppointmentCustomer
  service: AppointmentService
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type AppointmentInput = {
  customerId: number
  serviceId: number
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  notes: string | null
}

export type AppointmentFilters = {
  date?: string | undefined
  status?: AppointmentStatus | undefined
}
