import cors from "cors"
import express from "express"
import session from "express-session"
import { apiRoutes } from "./api/routes/index.js"
import { env } from "./config/env.js"
import { errorHandler } from "./middlewares/error-handler.js"
import { notFound } from "./middlewares/not-found.js"

export const app = express()

app.disable("x-powered-by")
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  })
)
app.use(express.json({ limit: "1mb" }))
app.use(
  session({
    name: "trimtrack.sid",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

app.use("/api", apiRoutes)
app.use(notFound)
app.use(errorHandler)

