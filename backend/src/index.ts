import type { Server } from "node:http"
import { db } from "./config/database.js"
import { closeServer, startServer } from "./server.js"

let server: Server | undefined
let isShuttingDown = false

async function shutdown(signal: string) {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true
  console.info(`${signal} received. Closing TrimTrack API.`)

  try {
    if (server) {
      await closeServer(server)
    }
  } finally {
    await db.end()
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"))
process.on("SIGTERM", () => void shutdown("SIGTERM"))

try {
  server = await startServer()
} catch (error) {
  console.error("Unable to start TrimTrack API.", error)
  await db.end()
  process.exitCode = 1
}
