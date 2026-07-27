import { Router } from "express"
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "../controllers/service-controller.js"
import { authenticate } from "../../middlewares/authenticate.js"

export const serviceRoutes = Router()

serviceRoutes.use(authenticate)
serviceRoutes.get("/", listServices)
serviceRoutes.get("/:id", getService)
serviceRoutes.post("/", createService)
serviceRoutes.put("/:id", updateService)
serviceRoutes.delete("/:id", deleteService)
