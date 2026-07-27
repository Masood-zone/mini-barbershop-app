import { Router } from "express"
import {
  getCurrentUser,
  login,
  logout,
} from "../controllers/auth-controller.js"
import { authenticate } from "../../middlewares/authenticate.js"

export const authRoutes = Router()

authRoutes.post("/login", login)
authRoutes.get("/me", authenticate, getCurrentUser)
authRoutes.post("/logout", authenticate, logout)
