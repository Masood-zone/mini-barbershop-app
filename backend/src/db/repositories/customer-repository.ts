import type { ResultSetHeader, RowDataPacket } from "mysql2"
import { db } from "../../config/database.js"
import type {
  Customer,
  CustomerGender,
  CustomerInput,
} from "../../types/customer.js"

type CustomerRow = RowDataPacket & {
  customer_id: number
  full_name: string
  phone_number: string
  email: string | null
  gender: CustomerGender | null
  created_at: Date
  updated_at: Date
}

const customerSelect = `
  SELECT
    customer_id,
    full_name,
    phone_number,
    email,
    gender,
    created_at,
    updated_at
  FROM customers
`

function mapCustomer(row: CustomerRow): Customer {
  return {
    customerId: row.customer_id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    email: row.email,
    gender: row.gender,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const customerRepository = {
  async findAll(search?: string): Promise<Customer[]> {
    if (search) {
      const searchTerm = `%${search}%`
      const [rows] = await db.execute<CustomerRow[]>(
        `
          ${customerSelect}
          WHERE full_name LIKE ? OR phone_number LIKE ?
          ORDER BY full_name ASC, customer_id ASC
        `,
        [searchTerm, searchTerm]
      )

      return rows.map(mapCustomer)
    }

    const [rows] = await db.execute<CustomerRow[]>(
      `
        ${customerSelect}
        ORDER BY full_name ASC, customer_id ASC
      `
    )

    return rows.map(mapCustomer)
  },

  async findById(customerId: number): Promise<Customer | null> {
    const [rows] = await db.execute<CustomerRow[]>(
      `
        ${customerSelect}
        WHERE customer_id = ?
        LIMIT 1
      `,
      [customerId]
    )
    const row = rows[0]

    return row ? mapCustomer(row) : null
  },

  async create(input: CustomerInput): Promise<Customer> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO customers (full_name, phone_number, email, gender)
        VALUES (?, ?, ?, ?)
      `,
      [input.fullName, input.phoneNumber, input.email, input.gender]
    )
    const customer = await this.findById(result.insertId)

    if (!customer) {
      throw new Error("Created customer could not be loaded.")
    }

    return customer
  },

  async update(
    customerId: number,
    input: CustomerInput
  ): Promise<Customer | null> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE customers
        SET full_name = ?, phone_number = ?, email = ?, gender = ?
        WHERE customer_id = ?
      `,
      [
        input.fullName,
        input.phoneNumber,
        input.email,
        input.gender,
        customerId,
      ]
    )

    if (result.affectedRows === 0) {
      return null
    }

    return this.findById(customerId)
  },

  async delete(customerId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM customers WHERE customer_id = ?",
      [customerId]
    )

    return result.affectedRows > 0
  },
}
