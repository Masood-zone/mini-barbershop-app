import cors from "cors"
import express from "express"
import session from "express-session"
import { apiRoutes } from "./api/routes/index.js"
import { env } from "./config/env.js"
import { sessionOptions } from "./config/session.js"
import { errorHandler } from "./middlewares/error-handler.js"
import { notFound } from "./middlewares/not-found.js"

export const app = express()

app.disable("x-powered-by")
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  })
)
app.use(express.json({ limit: "1mb" }))
app.use(session(sessionOptions))

app.use("/api", apiRoutes)
app.use(notFound)
app.use(errorHandler)
