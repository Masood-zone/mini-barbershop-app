import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const databaseDirectory = resolve(import.meta.dirname, "../database")
const schema = readFileSync(resolve(databaseDirectory, "schema.sql"), "utf8")
const seed = readFileSync(resolve(databaseDirectory, "seed.sql"), "utf8")
const queries = readFileSync(resolve(databaseDirectory, "queries.sql"), "utf8")

describe("database contract", () => {
  it("creates tables in dependency order", () => {
    const tablePositions = [
      "CREATE TABLE IF NOT EXISTS users",
      "CREATE TABLE IF NOT EXISTS customers",
      "CREATE TABLE IF NOT EXISTS services",
      "CREATE TABLE IF NOT EXISTS appointments",
    ].map((statement) => schema.indexOf(statement))

    expect(tablePositions.every((position) => position >= 0)).toBe(true)
    expect(tablePositions).toEqual([...tablePositions].sort((a, b) => a - b))
  })

  it("stores only a password hash and the approved appointment statuses", () => {
    expect(schema).toContain("password_hash VARCHAR(255)")
    expect(schema).not.toMatch(/\bpassword VARCHAR/)

    for (const status of [
      "Scheduled",
      "In Progress",
      "Completed",
      "Cancelled",
    ]) {
      expect(schema).toContain(`'${status}'`)
    }
  })

  it("excludes unsupported service concepts", () => {
    expect(schema).not.toMatch(/\bis_active\b|\bcategory\b|\bvisibility\b/i)
  })

  it("enforces service checks and restrictive appointment relationships", () => {
    expect(schema).toContain("CHECK (price >= 0)")
    expect(schema).toContain("CHECK (duration_minutes > 0)")
    expect(schema.match(/ON DELETE RESTRICT/g)).toHaveLength(2)
  })

  it("keeps local sample data repeatable and excludes administrator secrets", () => {
    expect(seed.match(/ON DUPLICATE KEY UPDATE/g)).toHaveLength(3)
    expect(seed).not.toMatch(/password_hash|ADMIN_PASSWORD/i)
  })

  it("includes search, joins, dashboard totals, and safe mutation practice", () => {
    expect(queries).toContain("LIKE CONCAT")
    expect(queries).toContain("INNER JOIN customers")
    expect(queries).toContain("total_appointments")
    expect(queries.match(/ROLLBACK;/g)).toHaveLength(2)
  })
})
