import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repositoryDirectory = resolve(
  import.meta.dirname,
  "../src/db/repositories"
)

const repositorySources = [
  "auth-repository.ts",
  "customer-repository.ts",
  "service-repository.ts",
].map((fileName) => ({
  fileName,
  source: readFileSync(resolve(repositoryDirectory, fileName), "utf8"),
}))

describe("prepared repository statements", () => {
  it.each(repositorySources)(
    "$fileName uses execute and never query for domain SQL",
    ({ source }) => {
      expect(source).toContain("db.execute")
      expect(source).not.toContain("db.query")
    }
  )

  it("keeps authentication lookups parameterized", () => {
    const source = repositorySources[0]!.source

    expect(source.match(/WHERE (email|user_id) = \?/g)).toHaveLength(2)
  })

  it("keeps customer search and mutations parameterized", () => {
    const source = repositorySources[1]!.source

    expect(source).toContain("WHERE full_name LIKE ? OR phone_number LIKE ?")
    expect(source).toContain("VALUES (?, ?, ?, ?)")
    expect(source).toContain("WHERE customer_id = ?")
  })

  it("keeps service mutations parameterized", () => {
    const source = repositorySources[2]!.source

    expect(source).toContain("VALUES (?, ?, ?, ?)")
    expect(source).toContain("WHERE service_id = ?")
  })
})
