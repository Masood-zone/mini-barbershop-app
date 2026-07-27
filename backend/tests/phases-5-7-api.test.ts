import bcrypt from "bcrypt"
import request from "supertest"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

const repositoryMocks = vi.hoisted(() => ({
  auth: {
    findByEmail: vi.fn(),
    findPublicById: vi.fn(),
  },
  customer: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  health: {
    checkConnection: vi.fn(),
  },
  service: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock("../src/db/repositories/auth-repository.js", () => ({
  authRepository: repositoryMocks.auth,
}))
vi.mock("../src/db/repositories/customer-repository.js", () => ({
  customerRepository: repositoryMocks.customer,
}))
vi.mock("../src/db/repositories/health-repository.js", () => ({
  healthRepository: repositoryMocks.health,
}))
vi.mock("../src/db/repositories/service-repository.js", () => ({
  serviceRepository: repositoryMocks.service,
}))

import { app } from "../src/app.js"

const publicUser = {
  userId: 1,
  fullName: "TrimTrack Administrator",
  email: "admin@example.com",
}

const customer = {
  customerId: 20,
  fullName: "Daniel Mensah",
  phoneNumber: "0241112233",
  email: "daniel@example.com",
  gender: "Male" as const,
  createdAt: new Date("2026-07-27T10:00:00.000Z"),
  updatedAt: new Date("2026-07-27T10:00:00.000Z"),
}

const service = {
  serviceId: 30,
  serviceName: "Standard Haircut",
  description: "A clean haircut.",
  price: 30,
  durationMinutes: 30,
  createdAt: new Date("2026-07-27T10:00:00.000Z"),
  updatedAt: new Date("2026-07-27T10:00:00.000Z"),
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
  repositoryMocks.customer.findAll.mockResolvedValue([customer])
  repositoryMocks.customer.findById.mockResolvedValue(customer)
  repositoryMocks.customer.create.mockResolvedValue(customer)
  repositoryMocks.customer.update.mockResolvedValue(customer)
  repositoryMocks.customer.delete.mockResolvedValue(true)
  repositoryMocks.health.checkConnection.mockResolvedValue(undefined)
  repositoryMocks.service.findAll.mockResolvedValue([service])
  repositoryMocks.service.findById.mockResolvedValue(service)
  repositoryMocks.service.create.mockResolvedValue(service)
  repositoryMocks.service.update.mockResolvedValue(service)
  repositoryMocks.service.delete.mockResolvedValue(true)
})

async function loginAgent() {
  const agent = request.agent(app)

  await agent
    .post("/api/auth/login")
    .send({
      email: "ADMIN@EXAMPLE.COM",
      password: "correct-password",
    })
    .expect(200)

  return agent
}

describe("Phase 5 authentication", () => {
  it("rejects protected requests without a session", async () => {
    const response = await request(app).get("/api/customers").expect(401)

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required.",
    })
  })

  it("returns one general message for incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "incorrect-password",
      })
      .expect(401)

    expect(response.body).toEqual({
      success: false,
      message: "Invalid email or password.",
    })
  })

  it("creates, reads, and destroys an HTTP-only session", async () => {
    const agent = request.agent(app)
    const loginResponse = await agent
      .post("/api/auth/login")
      .send({
        email: "ADMIN@EXAMPLE.COM",
        password: "correct-password",
      })
      .expect(200)

    expect(loginResponse.body.data).toEqual(publicUser)
    expect(loginResponse.body.data).not.toHaveProperty("passwordHash")
    expect(loginResponse.headers["set-cookie"]?.[0]).toContain("HttpOnly")
    expect(loginResponse.headers["set-cookie"]?.[0]).toContain("SameSite=Lax")
    expect(repositoryMocks.auth.findByEmail).toHaveBeenCalledWith(
      "admin@example.com"
    )

    const meResponse = await agent.get("/api/auth/me").expect(200)
    expect(meResponse.body.data).toEqual(publicUser)

    await agent.post("/api/auth/logout").expect(200)
    await agent.get("/api/auth/me").expect(401)
  })

  it("validates login input before querying MySQL", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid", password: "" })
      .expect(400)

    expect(response.body.message).toBe("Enter a valid email and password.")
    expect(repositoryMocks.auth.findByEmail).not.toHaveBeenCalled()
  })
})

describe("Phase 6 customer CRUD", () => {
  it("lists and searches customers through the protected route", async () => {
    const agent = await loginAgent()
    const response = await agent
      .get("/api/customers")
      .query({ search: "Daniel" })
      .expect(200)

    expect(response.body.data).toHaveLength(1)
    expect(repositoryMocks.customer.findAll).toHaveBeenCalledWith("Daniel")
  })

  it("creates, reads, updates, and deletes a customer", async () => {
    const agent = await loginAgent()
    const input = {
      fullName: "Daniel Mensah",
      phoneNumber: "0241112233",
      email: "daniel@example.com",
      gender: "Male",
    }

    await agent.post("/api/customers").send(input).expect(201)
    await agent.get("/api/customers/20").expect(200)
    await agent.put("/api/customers/20").send(input).expect(200)
    const deleteResponse = await agent.delete("/api/customers/20").expect(200)

    expect(deleteResponse.body.data).toEqual({ customerId: 20 })
    expect(repositoryMocks.customer.create).toHaveBeenCalledWith(input)
    expect(repositoryMocks.customer.update).toHaveBeenCalledWith(20, input)
    expect(repositoryMocks.customer.delete).toHaveBeenCalledWith(20)
  })

  it("returns useful validation errors without calling the repository", async () => {
    const agent = await loginAgent()
    const response = await agent
      .post("/api/customers")
      .send({ fullName: "A", phoneNumber: "bad" })
      .expect(400)

    expect(response.body.message).toBe("Invalid customer data.")
    expect(response.body.data).toHaveProperty("fullName")
    expect(response.body.data).toHaveProperty("phoneNumber")
    expect(repositoryMocks.customer.create).not.toHaveBeenCalled()
  })

  it("returns 404 and referenced-record conflicts consistently", async () => {
    const agent = await loginAgent()
    repositoryMocks.customer.findById.mockResolvedValueOnce(null)

    await agent.get("/api/customers/999").expect(404)

    repositoryMocks.customer.delete.mockRejectedValueOnce({
      code: "ER_ROW_IS_REFERENCED_2",
    })
    const response = await agent.delete("/api/customers/1").expect(409)

    expect(response.body.message).toContain("appointments reference it")
  })
})

describe("Phase 7 service CRUD", () => {
  it("creates, lists, reads, updates, and deletes a service", async () => {
    const agent = await loginAgent()
    const input = {
      serviceName: "Standard Haircut",
      description: "A clean haircut.",
      price: 30,
      durationMinutes: 30,
    }

    await agent.get("/api/services").expect(200)
    await agent.post("/api/services").send(input).expect(201)
    await agent.get("/api/services/30").expect(200)
    await agent.put("/api/services/30").send(input).expect(200)
    const deleteResponse = await agent.delete("/api/services/30").expect(200)

    expect(deleteResponse.body.data).toEqual({ serviceId: 30 })
    expect(repositoryMocks.service.create).toHaveBeenCalledWith(input)
    expect(repositoryMocks.service.update).toHaveBeenCalledWith(30, input)
    expect(repositoryMocks.service.delete).toHaveBeenCalledWith(30)
  })

  it("rejects invalid prices and durations", async () => {
    const agent = await loginAgent()
    const response = await agent
      .post("/api/services")
      .send({
        serviceName: "Invalid Service",
        price: -1,
        durationMinutes: 0,
      })
      .expect(400)

    expect(response.body.message).toBe("Invalid service data.")
    expect(response.body.data).toHaveProperty("price")
    expect(response.body.data).toHaveProperty("durationMinutes")
    expect(repositoryMocks.service.create).not.toHaveBeenCalled()
  })

  it("returns a conflict when appointments reference a service", async () => {
    const agent = await loginAgent()
    repositoryMocks.service.delete.mockRejectedValueOnce({
      errno: 1451,
    })

    const response = await agent.delete("/api/services/1").expect(409)

    expect(response.body.message).toContain("appointments reference it")
  })
})
