export const customerGenders = ["Male", "Female", "Other"] as const

export type CustomerGender = (typeof customerGenders)[number]

export type Customer = {
  customerId: number
  fullName: string
  phoneNumber: string
  email: string | null
  gender: CustomerGender | null
  createdAt: Date
  updatedAt: Date
}

export type CustomerInput = {
  fullName: string
  phoneNumber: string
  email: string | null
  gender: CustomerGender | null
}
