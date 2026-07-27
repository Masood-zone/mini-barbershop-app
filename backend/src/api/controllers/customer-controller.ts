import type { RequestHandler } from "express"
import { customerService } from "../../services/customer-service.js"
import { successResponse } from "../../utils/api-response.js"
import { parseId } from "../../utils/parse-id.js"

export const listCustomers: RequestHandler = async (request, response) => {
  const search =
    typeof request.query.search === "string" ? request.query.search : undefined
  const customers = await customerService.list(search)

  response.json(successResponse("Customers retrieved successfully.", customers))
}

export const getCustomer: RequestHandler = async (request, response) => {
  const customerId = parseId(request.params.id, "customer")
  const customer = await customerService.getById(customerId)

  response.json(successResponse("Customer retrieved successfully.", customer))
}

export const createCustomer: RequestHandler = async (request, response) => {
  const customer = await customerService.create(request.body)

  response
    .status(201)
    .json(successResponse("Customer created successfully.", customer))
}

export const updateCustomer: RequestHandler = async (request, response) => {
  const customerId = parseId(request.params.id, "customer")
  const customer = await customerService.update(customerId, request.body)

  response.json(successResponse("Customer updated successfully.", customer))
}

export const deleteCustomer: RequestHandler = async (request, response) => {
  const customerId = parseId(request.params.id, "customer")
  await customerService.delete(customerId)

  response.json(
    successResponse("Customer deleted successfully.", { customerId })
  )
}
