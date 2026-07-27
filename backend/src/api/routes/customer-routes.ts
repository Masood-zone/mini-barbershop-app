import { Router } from "express"
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from "../controllers/customer-controller.js"
import { authenticate } from "../../middlewares/authenticate.js"

export const customerRoutes = Router()

customerRoutes.use(authenticate)
customerRoutes.get("/", listCustomers)
customerRoutes.get("/:id", getCustomer)
customerRoutes.post("/", createCustomer)
customerRoutes.put("/:id", updateCustomer)
customerRoutes.delete("/:id", deleteCustomer)
