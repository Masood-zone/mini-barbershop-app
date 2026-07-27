import type { Server } from "node:http"
import { app } from "./app.js"
import { verifyDatabaseConnection } from "./config/database.js"
import { env } from "./config/env.js"

export type StartServerOptions = {
  port?: number
  verifyDatabase?: () => Promise<void>
}

export async function startServer(
  options: StartServerOptions = {}
): Promise<Server> {
  const port = options.port ?? env.PORT
  const verifyDatabase = options.verifyDatabase ?? verifyDatabaseConnection

  await verifyDatabase()

  return new Promise((resolve, reject) => {
    const server = app.listen(port)

    const handleError = (error: Error) => {
      server.off("listening", handleListening)
      reject(error)
    }

    const handleListening = () => {
      server.off("error", handleError)
      const address = server.address()
      const listeningPort =
        typeof address === "object" && address !== null ? address.port : port

      console.info(
        `TrimTrack API listening on http://localhost:${listeningPort}`
      )
      resolve(server)
    }

    server.once("error", handleError)
    server.once("listening", handleListening)
  })
}

export function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
