type DatabaseError = {
  code?: unknown
  errno?: unknown
}

export function isReferencedRowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false
  }

  const databaseError = error as DatabaseError

  return (
    databaseError.code === "ER_ROW_IS_REFERENCED_2" ||
    databaseError.errno === 1451
  )
}
