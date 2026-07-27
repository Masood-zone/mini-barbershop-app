import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3400),
  FRONTEND_ORIGIN: z.url().default("http://localhost:5173"),
  DB_HOST: z.string().min(1).default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().min(1).default("trimtrack_db"),
  DB_USER: z.string().min(1).default("trimtrack"),
  DB_PASSWORD: z.string().default(""),
  SESSION_SECRET: z
    .string()
    .min(32)
    .default("development-only-change-this-secret"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten())
  process.exit(1)
}

export const env = parsed.data
