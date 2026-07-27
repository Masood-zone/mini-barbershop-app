import express from "express"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const healthRepositoryMock = vi.hoisted(() => ({
  checkConnection: vi.fn<() => Promise<void>>(),
}))

vi.mock("../src/db/repositories/health-repository.js", () => ({
  healthRepository: healthRepositoryMock,
}))

import { app } from "../src/app.js"
import { env } from "../src/config/env.js"
import { errorHandler } from "../src/middlewares/error-handler.js"
import { closeServer, startServer } from "../src/server.js"

describe("backend foundation", () => {
  beforeEach(() => {
    healthRepositoryMock.checkConnection.mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns API and database readiness from the health endpoint", async () => {
    const response = await request(app).get("/api/health").expect(200)

    expect(response.body).toMatchObject({
      success: true,
      message: "TrimTrack API is healthy.",
      data: {
        status: "ok",
        database: "connected",
      },
    })
    expect(response.body.data.timestamp).toEqual(expect.any(String))
    expect(healthRepositoryMock.checkConnection).toHaveBeenCalledOnce()
  })

  it("allows the configured frontend origin with credentials", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", env.FRONTEND_ORIGIN)
      .expect(200)

    expect(response.headers["access-control-allow-origin"]).toBe(
      env.FRONTEND_ORIGIN
    )
    expect(response.headers["access-control-allow-credentials"]).toBe("true")
    expect(response.headers["x-powered-by"]).toBeUndefined()
  })

  it("returns the shared envelope for unknown routes", async () => {
    const response = await request(app).get("/api/missing").expect(404)

    expect(response.body).toEqual({
      success: false,
      message: "Route GET /api/missing not found.",
    })
  })

  it("returns a 400 envelope for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send('{"invalid"')
      .expect(400)

    expect(response.body).toEqual({
      success: false,
      message: "Invalid JSON payload.",
    })
  })

  it("forwards rejected async handlers to JSON error middleware", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const testApp = express()

    testApp.get("/failure", async () => {
      throw new Error("Test failure")
    })
    testApp.use(errorHandler)

    const response = await request(testApp).get("/failure").expect(500)

    expect(response.body).toEqual({
      success: false,
      message: "Internal server error.",
    })
  })

  it("checks the database before opening the HTTP listener", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined)
    const verifyDatabase = vi.fn<() => Promise<void>>().mockResolvedValue()
    const server = await startServer({ port: 0, verifyDatabase })

    try {
      expect(verifyDatabase).toHaveBeenCalledOnce()
      expect(server.listening).toBe(true)
    } finally {
      await closeServer(server)
    }
  })

  it("does not open a listener when the database check fails", async () => {
    const failure = new Error("Database unavailable")
    const verifyDatabase = vi
      .fn<() => Promise<void>>()
      .mockRejectedValue(failure)

    await expect(startServer({ port: 0, verifyDatabase })).rejects.toBe(failure)
  })
})
