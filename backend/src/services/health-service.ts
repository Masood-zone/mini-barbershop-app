import { healthRepository } from "../db/repositories/health-repository.js"

export type HealthStatus = {
  status: "ok"
  database: "connected"
  timestamp: string
}

export const healthService = {
  async getStatus(): Promise<HealthStatus> {
    await healthRepository.checkConnection()

    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    }
  },
}
