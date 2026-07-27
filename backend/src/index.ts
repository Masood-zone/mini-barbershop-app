import { app } from "./app.js"
import { db } from "./config/database.js"
import { env } from "./config/env.js"

const server = app.listen(env.PORT, () => {
  console.info(`TrimTrack API listening on http://localhost:${env.PORT}`)
})

async function shutdown(signal: string) {
  console.info(`${signal} received. Closing TrimTrack API.`)
  server.close(async () => {
    await db.end()
    process.exit(0)
  })
}

process.on("SIGINT", () => void shutdown("SIGINT"))
process.on("SIGTERM", () => void shutdown("SIGTERM"))

