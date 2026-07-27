import { Router } from "express"
import { appointmentRoutes } from "./appointment-routes.js"
import { authRoutes } from "./auth-routes.js"
import { customerRoutes } from "./customer-routes.js"
import { dashboardRoutes } from "./dashboard-routes.js"
import { healthRoutes } from "./health-routes.js"
import { serviceRoutes } from "./service-routes.js"

export const apiRoutes = Router()

apiRoutes.use("/health", healthRoutes)
apiRoutes.use("/auth", authRoutes)
apiRoutes.use("/customers", customerRoutes)
apiRoutes.use("/services", serviceRoutes)
apiRoutes.use("/appointments", appointmentRoutes)
apiRoutes.use("/dashboard", dashboardRoutes)
