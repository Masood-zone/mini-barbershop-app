import type { RequestHandler } from "express"
import { appointmentService } from "../../services/appointment-service.js"
import { successResponse } from "../../utils/api-response.js"
import { parseId } from "../../utils/parse-id.js"

export const listAppointments: RequestHandler = async (request, response) => {
  const appointments = await appointmentService.list({
    date: typeof request.query.date === "string" ? request.query.date : undefined,
    status:
      typeof request.query.status === "string"
        ? request.query.status
        : undefined,
  })

  response.json(
    successResponse("Appointments retrieved successfully.", appointments)
  )
}

export const getAppointment: RequestHandler = async (request, response) => {
  const appointmentId = parseId(request.params.id, "appointment")
  const appointment = await appointmentService.getById(appointmentId)

  response.json(
    successResponse("Appointment retrieved successfully.", appointment)
  )
}

export const createAppointment: RequestHandler = async (request, response) => {
  const appointment = await appointmentService.create(request.body)

  response
    .status(201)
    .json(successResponse("Appointment created successfully.", appointment))
}

export const updateAppointment: RequestHandler = async (request, response) => {
  const appointmentId = parseId(request.params.id, "appointment")
  const appointment = await appointmentService.update(
    appointmentId,
    request.body
  )

  response.json(
    successResponse("Appointment updated successfully.", appointment)
  )
}

export const updateAppointmentStatus: RequestHandler = async (
  request,
  response
) => {
  const appointmentId = parseId(request.params.id, "appointment")
  const appointment = await appointmentService.updateStatus(
    appointmentId,
    request.body
  )

  response.json(
    successResponse("Appointment status updated successfully.", appointment)
  )
}

export const deleteAppointment: RequestHandler = async (request, response) => {
  const appointmentId = parseId(request.params.id, "appointment")
  await appointmentService.delete(appointmentId)

  response.json(
    successResponse("Appointment deleted successfully.", { appointmentId })
  )
}
