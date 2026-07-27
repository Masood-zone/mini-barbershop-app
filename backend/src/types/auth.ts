export type AuthenticatedUser = {
  userId: number
  fullName: string
  email: string
}

export type LoginInput = {
  email: string
  password: string
}
