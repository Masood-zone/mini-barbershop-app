import type { ResultSetHeader, RowDataPacket } from "mysql2"
import { db } from "../../config/database.js"
import type {
  Appointment,
  AppointmentFilters,
  AppointmentInput,
  AppointmentStatus,
} from "../../types/appointment.js"

export type AppointmentRow = RowDataPacket & {
  appointment_id: number
  customer_id: number
  customer_name: string
  customer_phone_number: string
  customer_email: string | null
  service_id: number
  service_name: string
  service_price: number
  service_duration_minutes: number
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  notes: string | null
  created_at: Date
  updated_at: Date
}

export const appointmentSelect = `
  SELECT
    appointments.appointment_id,
    customers.customer_id,
    customers.full_name AS customer_name,
    customers.phone_number AS customer_phone_number,
    customers.email AS customer_email,
    services.service_id,
    services.service_name,
    services.price AS service_price,
    services.duration_minutes AS service_duration_minutes,
    DATE_FORMAT(appointments.appointment_date, '%Y-%m-%d') AS appointment_date,
    TIME_FORMAT(appointments.appointment_time, '%H:%i:%s') AS appointment_time,
    appointments.status,
    appointments.notes,
    appointments.created_at,
    appointments.updated_at
  FROM appointments
  INNER JOIN customers
    ON customers.customer_id = appointments.customer_id
  INNER JOIN services
    ON services.service_id = appointments.service_id
`

export function mapAppointment(row: AppointmentRow): Appointment {
  return {
    appointmentId: row.appointment_id,
    customer: {
      customerId: row.customer_id,
      fullName: row.customer_name,
      phoneNumber: row.customer_phone_number,
      email: row.customer_email,
    },
    service: {
      serviceId: row.service_id,
      serviceName: row.service_name,
      price: row.service_price,
      durationMinutes: row.service_duration_minutes,
    },
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const appointmentRepository = {
  async findAll(filters: AppointmentFilters): Promise<Appointment[]> {
    const conditions: string[] = []
    const values: Array<string> = []

    if (filters.date) {
      conditions.push("appointments.appointment_date = ?")
      values.push(filters.date)
    }

    if (filters.status) {
      conditions.push("appointments.status = ?")
      values.push(filters.status)
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
    const [rows] = await db.execute<AppointmentRow[]>(
      `
        ${appointmentSelect}
        ${whereClause}
        ORDER BY
          appointments.appointment_date DESC,
          appointments.appointment_time DESC,
          appointments.appointment_id DESC
      `,
      values
    )

    return rows.map(mapAppointment)
  },

  async findById(appointmentId: number): Promise<Appointment | null> {
    const [rows] = await db.execute<AppointmentRow[]>(
      `
        ${appointmentSelect}
        WHERE appointments.appointment_id = ?
        LIMIT 1
      `,
      [appointmentId]
    )
    const row = rows[0]

    return row ? mapAppointment(row) : null
  },

  async customerExists(customerId: number): Promise<boolean> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT customer_id FROM customers WHERE customer_id = ? LIMIT 1",
      [customerId]
    )

    return rows.length > 0
  },

  async serviceExists(serviceId: number): Promise<boolean> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT service_id FROM services WHERE service_id = ? LIMIT 1",
      [serviceId]
    )

    return rows.length > 0
  },

  async create(input: AppointmentInput): Promise<Appointment> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO appointments (
          customer_id,
          service_id,
          appointment_date,
          appointment_time,
          status,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        input.customerId,
        input.serviceId,
        input.appointmentDate,
        input.appointmentTime,
        input.status,
        input.notes,
      ]
    )
    const appointment = await this.findById(result.insertId)

    if (!appointment) {
      throw new Error("Created appointment could not be loaded.")
    }

    return appointment
  },

  async update(
    appointmentId: number,
    input: AppointmentInput
  ): Promise<Appointment | null> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE appointments
        SET
          customer_id = ?,
          service_id = ?,
          appointment_date = ?,
          appointment_time = ?,
          status = ?,
          notes = ?
        WHERE appointment_id = ?
      `,
      [
        input.customerId,
        input.serviceId,
        input.appointmentDate,
        input.appointmentTime,
        input.status,
        input.notes,
        appointmentId,
      ]
    )

    if (result.affectedRows === 0) {
      return null
    }

    return this.findById(appointmentId)
  },

  async updateStatus(
    appointmentId: number,
    status: AppointmentStatus
  ): Promise<Appointment | null> {
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE appointments SET status = ? WHERE appointment_id = ?",
      [status, appointmentId]
    )

    if (result.affectedRows === 0) {
      return null
    }

    return this.findById(appointmentId)
  },

  async delete(appointmentId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM appointments WHERE appointment_id = ?",
      [appointmentId]
    )

    return result.affectedRows > 0
  },
}
