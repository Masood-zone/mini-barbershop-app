import { describe, expect, it } from "vitest"
import { parseAdminSeedConfig } from "../src/scripts/admin-seed-config.js"

const validEnvironment = {
  ADMIN_FULL_NAME: "TrimTrack Administrator",
  ADMIN_EMAIL: "ADMIN@EXAMPLE.COM",
  ADMIN_PASSWORD: "a-secure-local-password",
}

describe("parseAdminSeedConfig", () => {
  it("normalizes valid administrator input", () => {
    expect(parseAdminSeedConfig(validEnvironment)).toEqual({
      ...validEnvironment,
      ADMIN_EMAIL: "admin@example.com",
    })
  })

  it("rejects a short password", () => {
    expect(() =>
      parseAdminSeedConfig({
        ...validEnvironment,
        ADMIN_PASSWORD: "too-short",
      })
    ).toThrow()
  })

  it("rejects passwords longer than bcrypt's UTF-8 byte limit", () => {
    expect(() =>
      parseAdminSeedConfig({
        ...validEnvironment,
        ADMIN_PASSWORD: "é".repeat(37),
      })
    ).toThrow()
  })
})
