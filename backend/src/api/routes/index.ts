import { Router } from "express"
import { authRoutes } from "./auth-routes.js"
import { customerRoutes } from "./customer-routes.js"
import { healthRoutes } from "./health-routes.js"
import { serviceRoutes } from "./service-routes.js"

export const apiRoutes = Router()

apiRoutes.use("/health", healthRoutes)
apiRoutes.use("/auth", authRoutes)
apiRoutes.use("/customers", customerRoutes)
apiRoutes.use("/services", serviceRoutes)
