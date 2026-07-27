import { db } from "../../config/database.js"

export const healthRepository = {
  async checkConnection(): Promise<void> {
    await db.execute("SELECT 1")
  },
}
