import bcrypt from "bcrypt"
import { ZodError } from "zod"
import { db } from "../config/database.js"
import { parseAdminSeedConfig } from "./admin-seed-config.js"

async function seedAdministrator() {
  const config = parseAdminSeedConfig(process.env)
  const passwordHash = await bcrypt.hash(config.ADMIN_PASSWORD, 12)

  await db.execute(
    `
      INSERT INTO users (full_name, email, password_hash)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = ?,
        password_hash = ?
    `,
    [
      config.ADMIN_FULL_NAME,
      config.ADMIN_EMAIL,
      passwordHash,
      config.ADMIN_FULL_NAME,
      passwordHash,
    ]
  )

  console.info(`Administrator ${config.ADMIN_EMAIL} seeded successfully.`)
}

try {
  await seedAdministrator()
} catch (error) {
  if (error instanceof ZodError) {
    console.error(
      "Invalid administrator seed configuration.",
      error.flatten().fieldErrors
    )
  } else {
    console.error("Unable to seed the administrator.", error)
  }

  process.exitCode = 1
} finally {
  await db.end()
}
