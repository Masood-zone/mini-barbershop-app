export const appointmentStatuses = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
] as const

export type AppointmentStatus = (typeof appointmentStatuses)[number]

export type Appointment = {
  appointmentId: number
  customer: {
    customerId: number
    fullName: string
    phoneNumber: string
    email: string | null
  }
  service: {
    serviceId: number
    serviceName: string
    price: number
    durationMinutes: number
  }
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type AppointmentInput = {
  customerId: number
  serviceId: number
  appointmentDate: string
  appointmentTime: string
  status?: AppointmentStatus
  notes: string | null
}

export type AppointmentFilters = {
  date?: string
  status?: AppointmentStatus | ""
}
