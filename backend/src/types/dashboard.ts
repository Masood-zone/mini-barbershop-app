import type { Appointment } from "./appointment.js"

export type DashboardSummary = {
  totalCustomers: number
  totalServices: number
  totalAppointments: number
  todaysAppointments: number
  completedAppointments: number
  todayAppointments: Appointment[]
  recentAppointments: Appointment[]
}
