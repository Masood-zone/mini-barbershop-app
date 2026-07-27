import type { RequestHandler } from "express"
import { serviceService } from "../../services/service-service.js"
import { successResponse } from "../../utils/api-response.js"
import { parseId } from "../../utils/parse-id.js"

export const listServices: RequestHandler = async (_request, response) => {
  const services = await serviceService.list()

  response.json(successResponse("Services retrieved successfully.", services))
}

export const getService: RequestHandler = async (request, response) => {
  const serviceId = parseId(request.params.id, "service")
  const service = await serviceService.getById(serviceId)

  response.json(successResponse("Service retrieved successfully.", service))
}

export const createService: RequestHandler = async (request, response) => {
  const service = await serviceService.create(request.body)

  response
    .status(201)
    .json(successResponse("Service created successfully.", service))
}

export const updateService: RequestHandler = async (request, response) => {
  const serviceId = parseId(request.params.id, "service")
  const service = await serviceService.update(serviceId, request.body)

  response.json(successResponse("Service updated successfully.", service))
}

export const deleteService: RequestHandler = async (request, response) => {
  const serviceId = parseId(request.params.id, "service")
  await serviceService.delete(serviceId)

  response.json(successResponse("Service deleted successfully.", { serviceId }))
}
