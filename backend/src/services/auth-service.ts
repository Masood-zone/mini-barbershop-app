import bcrypt from "bcrypt"
import { z } from "zod"
import { authRepository } from "../db/repositories/auth-repository.js"
import type { AuthenticatedUser, LoginInput } from "../types/auth.js"
import { ApiError } from "../utils/api-error.js"
import { parseWithSchema } from "../utils/validation.js"

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(100),
  password: z.string().min(1).max(200),
})

export const authService = {
  async authenticate(input: unknown): Promise<AuthenticatedUser> {
    const credentials = parseWithSchema<LoginInput>(
      loginSchema,
      input,
      "Enter a valid email and password."
    )
    const user = await authRepository.findByEmail(credentials.email)

    if (!user) {
      throw new ApiError(401, "Invalid email or password.")
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    )

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid email or password.")
    }

    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
    }
  },

  async getCurrentUser(userId: number): Promise<AuthenticatedUser> {
    const user = await authRepository.findPublicById(userId)

    if (!user) {
      throw new ApiError(401, "Authentication required.")
    }

    return user
  },
}
