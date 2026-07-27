import type { ResultSetHeader, RowDataPacket } from "mysql2"
import { db } from "../../config/database.js"
import type { Service, ServiceInput } from "../../types/service.js"

type ServiceRow = RowDataPacket & {
  service_id: number
  service_name: string
  description: string | null
  price: number
  duration_minutes: number
  created_at: Date
  updated_at: Date
}

const serviceSelect = `
  SELECT
    service_id,
    service_name,
    description,
    price,
    duration_minutes,
    created_at,
    updated_at
  FROM services
`

function mapService(row: ServiceRow): Service {
  return {
    serviceId: row.service_id,
    serviceName: row.service_name,
    description: row.description,
    price: row.price,
    durationMinutes: row.duration_minutes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const serviceRepository = {
  async findAll(): Promise<Service[]> {
    const [rows] = await db.execute<ServiceRow[]>(
      `
        ${serviceSelect}
        ORDER BY service_name ASC, service_id ASC
      `
    )

    return rows.map(mapService)
  },

  async findById(serviceId: number): Promise<Service | null> {
    const [rows] = await db.execute<ServiceRow[]>(
      `
        ${serviceSelect}
        WHERE service_id = ?
        LIMIT 1
      `,
      [serviceId]
    )
    const row = rows[0]

    return row ? mapService(row) : null
  },

  async create(input: ServiceInput): Promise<Service> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO services (
          service_name,
          description,
          price,
          duration_minutes
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        input.serviceName,
        input.description,
        input.price,
        input.durationMinutes,
      ]
    )
    const service = await this.findById(result.insertId)

    if (!service) {
      throw new Error("Created service could not be loaded.")
    }

    return service
  },

  async update(
    serviceId: number,
    input: ServiceInput
  ): Promise<Service | null> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE services
        SET
          service_name = ?,
          description = ?,
          price = ?,
          duration_minutes = ?
        WHERE service_id = ?
      `,
      [
        input.serviceName,
        input.description,
        input.price,
        input.durationMinutes,
        serviceId,
      ]
    )

    if (result.affectedRows === 0) {
      return null
    }

    return this.findById(serviceId)
  },

  async delete(serviceId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM services WHERE service_id = ?",
      [serviceId]
    )

    return result.affectedRows > 0
  },
}
