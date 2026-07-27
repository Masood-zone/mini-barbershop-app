import type { RequestHandler } from "express"
import { sessionCookieName } from "../../config/session.js"
import { authService } from "../../services/auth-service.js"
import { successResponse } from "../../utils/api-response.js"
import {
  destroySession,
  regenerateSession,
  saveSession,
} from "../../utils/session.js"

export const login: RequestHandler = async (request, response) => {
  const user = await authService.authenticate(request.body)

  await regenerateSession(request)
  request.session.userId = user.userId
  await saveSession(request)

  response.json(successResponse("Login successful.", user))
}

export const getCurrentUser: RequestHandler = async (request, response) => {
  const user = await authService.getCurrentUser(request.session.userId!)

  response.json(successResponse("Current session retrieved.", user))
}

export const logout: RequestHandler = async (request, response) => {
  await destroySession(request)
  response.clearCookie(sessionCookieName, { path: "/" })
  response.json(successResponse("Logout successful.", null))
}
