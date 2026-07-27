import { Router } from "express"
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment-controller.js"
import { authenticate } from "../../middlewares/authenticate.js"

export const appointmentRoutes = Router()

appointmentRoutes.use(authenticate)
appointmentRoutes.get("/", listAppointments)
appointmentRoutes.get("/:id", getAppointment)
appointmentRoutes.post("/", createAppointment)
appointmentRoutes.put("/:id", updateAppointment)
appointmentRoutes.patch("/:id/status", updateAppointmentStatus)
appointmentRoutes.delete("/:id", deleteAppointment)
