import type { Appointment } from "@/types/appointment"

export type DashboardSummary = {
  totalCustomers: number
  totalServices: number
  totalAppointments: number
  todaysAppointments: number
  completedAppointments: number
  todayAppointments: Appointment[]
  recentAppointments: Appointment[]
}
