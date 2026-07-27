import type { SessionOptions } from "express-session"
import { env } from "./env.js"

export const sessionCookieName = "trimtrack.sid"

export const sessionOptions: SessionOptions = {
  name: sessionCookieName,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
}
