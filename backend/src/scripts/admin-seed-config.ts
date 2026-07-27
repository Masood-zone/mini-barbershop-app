import { z } from "zod"

const adminPasswordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Use at most 72 UTF-8 bytes because bcrypt ignores additional bytes."
  )

export const adminSeedEnvSchema = z.object({
  ADMIN_FULL_NAME: z.string().trim().min(2).max(100),
  ADMIN_EMAIL: z.string().trim().toLowerCase().email().max(100),
  ADMIN_PASSWORD: adminPasswordSchema,
})

export type AdminSeedConfig = z.infer<typeof adminSeedEnvSchema>

export function parseAdminSeedConfig(
  environment: NodeJS.ProcessEnv
): AdminSeedConfig {
  return adminSeedEnvSchema.parse(environment)
}
