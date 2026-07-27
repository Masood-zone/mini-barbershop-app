import type { RowDataPacket } from "mysql2"
import { db } from "../../config/database.js"
import type { AuthenticatedUser } from "../../types/auth.js"

type UserRow = RowDataPacket & {
  user_id: number
  full_name: string
  email: string
  password_hash: string
}

export type AuthenticationUserRecord = AuthenticatedUser & {
  passwordHash: string
}

function mapUser(row: UserRow): AuthenticatedUser {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
  }
}

export const authRepository = {
  async findByEmail(email: string): Promise<AuthenticationUserRecord | null> {
    const [rows] = await db.execute<UserRow[]>(
      `
        SELECT user_id, full_name, email, password_hash
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    )
    const row = rows[0]

    if (!row) {
      return null
    }

    return {
      ...mapUser(row),
      passwordHash: row.password_hash,
    }
  },

  async findPublicById(userId: number): Promise<AuthenticatedUser | null> {
    const [rows] = await db.execute<UserRow[]>(
      `
        SELECT user_id, full_name, email, password_hash
        FROM users
        WHERE user_id = ?
        LIMIT 1
      `,
      [userId]
    )
    const row = rows[0]

    return row ? mapUser(row) : null
  },
}
