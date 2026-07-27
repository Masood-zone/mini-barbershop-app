import bcrypt from "bcrypt"
import request from "supertest"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

const repositoryMocks = vi.hoisted(() => ({
  auth: {
    findByEmail: vi.fn(),
    findPublicById: vi.fn(),
  },
  appointment: {
    findAll: vi.fn(),
    findById: vi.fn(),
    customerExists: vi.fn(),
    serviceExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
  dashboard: {
    getSummary: vi.fn(),
  },
}))

vi.mock("../src/db/repositories/auth-repository.js", () => ({
  authRepository: repositoryMocks.auth,
}))
vi.mock("../src/db/repositories/appointment-repository.js", () => ({
  appointmentRepository: repositoryMocks.appointment,
}))
vi.mock("../src/db/repositories/dashboard-repository.js", () => ({
  dashboardRepository: repositoryMocks.dashboard,
}))

import { app } from "../src/app.js"

const publicUser = {
  userId: 1,
  fullName: "TrimTrack Administrator",
  email: "admin@example.com",
}

const appointment = {
  appointmentId: 41,
  customer: {
    customerId: 20,
    fullName: "Daniel Mensah",
    phoneNumber: "0241112233",
    email: "daniel@example.com",
  },
  service: {
    serviceId: 30,
    serviceName: "Standard Haircut",
    price: 30,
    durationMinutes: 30,
  },
  appointmentDate: "2026-07-27",
  appointmentTime: "09:30:00",
  status: "Scheduled" as const,
  notes: "Low fade.",
  createdAt: new Date("2026-07-27T08:00:00.000Z"),
  updatedAt: new Date("2026-07-27T08:00:00.000Z"),
}

let passwordHash: string

beforeAll(async () => {
  passwordHash = await bcrypt.hash("correct-password", 4)
})

beforeEach(() => {
  vi.clearAllMocks()
  repositoryMocks.auth.findByEmail.mockResolvedValue({
    ...publicUser,
    passwordHash,
  })
  repositoryMocks.auth.findPublicById.mockResolvedValue(publicUser)
  repositoryMocks.appointment.findAll.mockResolvedValue([appointment])
  repositoryMocks.appointment.findById.mockResolvedValue(appointment)
  repositoryMocks.appointment.customerExists.mockResolvedValue(true)
  repositoryMocks.appointment.serviceExists.mockResolvedValue(true)
  repositoryMocks.appointment.create.mockResolvedValue(appointment)
  repositoryMocks.appointment.update.mockResolvedValue(appointment)
  repositoryMocks.appointment.updateStatus.mockResolvedValue({
    ...appointment,
    status: "Completed",
  })
  repositoryMocks.appointment.delete.mockResolvedValue(true)
  repositoryMocks.dashboard.getSummary.mockResolvedValue({
    totalCustomers: 1,
    totalServices: 1,
    totalAppointments: 1,
    todaysAppointments: 1,
    completedAppointments: 0,
    todayAppointments: [appointment],
    recentAppointments: [appointment],
  })
})

async function loginAgent() {
  const agent = request.agent(app)

  await agent
    .post("/api/auth/login")
    .send({
      email: "admin@example.com",
      password: "correct-password",
    })
    .expect(200)

  return agent
}

describe("Phase 8 appointment CRUD", () => {
  it("lists joined appointments with validated date and status filters", async () => {
    const agent = await loginAgent()
    const response = await agent
      .get("/api/appointments")
      .query({ date: "2026-07-27", status: "Scheduled" })
      .expect(200)

    expect(response.body.data[0]).toMatchObject({
      customer: { fullName: "Daniel Mensah" },
      service: { serviceName: "Standard Haircut" },
    })
    expect(repositoryMocks.appointment.findAll).toHaveBeenCalledWith({
      date: "2026-07-27",
      status: "Scheduled",
    })
  })

  it("creates, reads, updates, changes status, and deletes an appointment", async () => {
    const agent = await loginAgent()
    const input = {
      customerId: 20,
      serviceId: 30,
      appointmentDate: "2026-07-27",
      appointmentTime: "09:30",
      notes: "Low fade.",
    }

    await agent.post("/api/appointments").send(input).expect(201)
    await agent.get("/api/appointments/41").expect(200)
    await agent
      .put("/api/appointments/41")
      .send({ ...input, status: "Scheduled" })
      .expect(200)
    const statusResponse = await agent
      .patch("/api/appointments/41/status")
      .send({ status: "Completed" })
      .expect(200)
    const deleteResponse = await agent
      .delete("/api/appointments/41")
      .expect(200)

    expect(repositoryMocks.appointment.create).toHaveBeenCalledWith({
      ...input,
      appointmentTime: "09:30:00",
      status: "Scheduled",
    })
    expect(statusResponse.body.data.status).toBe("Completed")
    expect(deleteResponse.body.data).toEqual({ appointmentId: 41 })
  })

  it("rejects invalid dates, times, statuses, and foreign keys", async () => {
    const agent = await loginAgent()

    const invalidResponse = await agent
      .post("/api/appointments")
      .send({
        customerId: 20,
        serviceId: 30,
        appointmentDate: "2026-02-30",
        appointmentTime: "25:00",
        status: "Pending",
      })
      .expect(400)

    expect(invalidResponse.body.message).toBe("Invalid appointment data.")
    expect(repositoryMocks.appointment.create).not.toHaveBeenCalled()

    repositoryMocks.appointment.customerExists.mockResolvedValueOnce(false)
    const foreignKeyResponse = await agent
      .post("/api/appointments")
      .send({
        customerId: 999,
        serviceId: 30,
        appointmentDate: "2026-07-27",
        appointmentTime: "09:30",
      })
      .expect(400)

    expect(foreignKeyResponse.body.message).toContain(
      "customer does not exist"
    )
    expect(repositoryMocks.appointment.create).not.toHaveBeenCalled()
  })

  it("returns not found responses for missing appointment mutations", async () => {
    const agent = await loginAgent()
    repositoryMocks.appointment.updateStatus.mockResolvedValueOnce(null)
    repositoryMocks.appointment.delete.mockResolvedValueOnce(false)

    await agent
      .patch("/api/appointments/999/status")
      .send({ status: "Cancelled" })
      .expect(404)
    await agent.delete("/api/appointments/999").expect(404)
  })
})

describe("Phase 9 dashboard summary", () => {
  it("returns protected totals plus joined today and recent appointments", async () => {
    const agent = await loginAgent()
    const response = await agent.get("/api/dashboard/summary").expect(200)

    expect(response.body.data).toMatchObject({
      totalCustomers: 1,
      totalServices: 1,
      totalAppointments: 1,
      todaysAppointments: 1,
      completedAppointments: 0,
    })
    expect(response.body.data.todayAppointments[0].customer.fullName).toBe(
      "Daniel Mensah"
    )
    expect(response.body.data.recentAppointments[0].service.serviceName).toBe(
      "Standard Haircut"
    )
  })
})
