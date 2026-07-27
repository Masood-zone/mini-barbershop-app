import type { RowDataPacket } from "mysql2"
import { db } from "../../config/database.js"
import type { DashboardSummary } from "../../types/dashboard.js"
import {
  appointmentSelect,
  mapAppointment,
  type AppointmentRow,
} from "./appointment-repository.js"

type DashboardCountRow = RowDataPacket & {
  total_customers: number
  total_services: number
  total_appointments: number
  todays_appointments: number
  completed_appointments: number
}

export const dashboardRepository = {
  async getSummary(): Promise<DashboardSummary> {
    const [countRows] = await db.execute<DashboardCountRow[]>(`
      SELECT
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM services) AS total_services,
        (SELECT COUNT(*) FROM appointments) AS total_appointments,
        (
          SELECT COUNT(*)
          FROM appointments
          WHERE appointment_date = CURRENT_DATE()
        ) AS todays_appointments,
        (
          SELECT COUNT(*)
          FROM appointments
          WHERE status = 'Completed'
        ) AS completed_appointments
    `)
    const [todayRows] = await db.execute<AppointmentRow[]>(`
      ${appointmentSelect}
      WHERE appointments.appointment_date = CURRENT_DATE()
      ORDER BY appointments.appointment_time ASC, appointments.appointment_id ASC
    `)
    const [recentRows] = await db.execute<AppointmentRow[]>(`
      ${appointmentSelect}
      ORDER BY
        appointments.appointment_date DESC,
        appointments.appointment_time DESC,
        appointments.appointment_id DESC
      LIMIT 5
    `)
    const counts = countRows[0]

    if (!counts) {
      throw new Error("Dashboard summary could not be loaded.")
    }

    return {
      totalCustomers: Number(counts.total_customers),
      totalServices: Number(counts.total_services),
      totalAppointments: Number(counts.total_appointments),
      todaysAppointments: Number(counts.todays_appointments),
      completedAppointments: Number(counts.completed_appointments),
      todayAppointments: todayRows.map(mapAppointment),
      recentAppointments: recentRows.map(mapAppointment),
    }
  },
}
