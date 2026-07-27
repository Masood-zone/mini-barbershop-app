import assert from "node:assert/strict"

type ApiBody = {
  success: boolean
  message: string
  data?: unknown
}

const origin = process.env.VERIFY_API_ORIGIN
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!origin || !email || !password) {
  throw new Error("Missing API verification environment.")
}

let sessionCookie: string | undefined

async function apiRequest(
  path: string,
  options: {
    method?: string
    body?: unknown
    expectedStatus: number
    authenticated?: boolean
  }
): Promise<ApiBody> {
  const headers = new Headers()
  headers.set("Accept", "application/json")

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  if (options.authenticated && sessionCookie) {
    headers.set("Cookie", sessionCookie)
  }

  const requestBody =
    options.body === undefined ? undefined : JSON.stringify(options.body)
  const response = await fetch(`${origin}${path}`, {
    method: options.method ?? "GET",
    headers,
    ...(requestBody === undefined ? {} : { body: requestBody }),
  })
  const body = (await response.json()) as ApiBody

  assert.equal(
    response.status,
    options.expectedStatus,
    `${options.method ?? "GET"} ${path}: ${body.message}`
  )

  if (path === "/api/auth/login" && response.ok) {
    const setCookie = response.headers.get("set-cookie")
    assert.ok(setCookie, "Login did not return a session cookie.")
    sessionCookie = setCookie.split(";", 1)[0]
  }

  return body
}

function dataRecord(body: ApiBody): Record<string, unknown> {
  assert.ok(body.data && typeof body.data === "object")
  return body.data as Record<string, unknown>
}

await apiRequest("/api/auth/login", {
  method: "POST",
  body: { email, password: "definitely-incorrect" },
  expectedStatus: 401,
})

const loginBody = await apiRequest("/api/auth/login", {
  method: "POST",
  body: { email: email.toUpperCase(), password },
  expectedStatus: 200,
})
const loginUser = dataRecord(loginBody)
assert.equal(loginUser.email, email)
assert.equal("passwordHash" in loginUser, false)

await apiRequest("/api/auth/me", {
  expectedStatus: 200,
  authenticated: true,
})

const customerSearch = await apiRequest(
  "/api/customers?search=Daniel",
  {
    expectedStatus: 200,
    authenticated: true,
  }
)
assert.ok(Array.isArray(customerSearch.data))
assert.ok(customerSearch.data.length >= 1)

const createdCustomerBody = await apiRequest("/api/customers", {
  method: "POST",
  body: {
    fullName: "Phase Verification Customer",
    phoneNumber: "0240009999",
    email: "phase-customer@example.com",
    gender: "Other",
  },
  expectedStatus: 201,
  authenticated: true,
})
const createdCustomer = dataRecord(createdCustomerBody)
assert.equal(typeof createdCustomer.customerId, "number")
const customerId = createdCustomer.customerId as number

await apiRequest(`/api/customers/${customerId}`, {
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest(`/api/customers/${customerId}`, {
  method: "PUT",
  body: {
    fullName: "Updated Phase Customer",
    phoneNumber: "0240009999",
    email: "",
    gender: null,
  },
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest(`/api/customers/${customerId}`, {
  method: "DELETE",
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest("/api/customers/1", {
  method: "DELETE",
  expectedStatus: 409,
  authenticated: true,
})

const servicesBody = await apiRequest("/api/services", {
  expectedStatus: 200,
  authenticated: true,
})
assert.ok(Array.isArray(servicesBody.data))
assert.equal(servicesBody.data.length, 6)

const createdServiceBody = await apiRequest("/api/services", {
  method: "POST",
  body: {
    serviceName: "Phase Verification Service",
    description: "Created by the disposable API verification.",
    price: 35.5,
    durationMinutes: 25,
  },
  expectedStatus: 201,
  authenticated: true,
})
const createdService = dataRecord(createdServiceBody)
assert.equal(typeof createdService.serviceId, "number")
const serviceId = createdService.serviceId as number

await apiRequest(`/api/services/${serviceId}`, {
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest(`/api/services/${serviceId}`, {
  method: "PUT",
  body: {
    serviceName: "Updated Verification Service",
    description: null,
    price: "40.00",
    durationMinutes: "30",
  },
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest(`/api/services/${serviceId}`, {
  method: "DELETE",
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest("/api/services/1", {
  method: "DELETE",
  expectedStatus: 409,
  authenticated: true,
})
await apiRequest("/api/services", {
  method: "POST",
  body: {
    serviceName: "Invalid Service",
    price: -1,
    durationMinutes: 0,
  },
  expectedStatus: 400,
  authenticated: true,
})

await apiRequest("/api/auth/logout", {
  method: "POST",
  expectedStatus: 200,
  authenticated: true,
})
await apiRequest("/api/customers", {
  expectedStatus: 401,
  authenticated: true,
})

console.info(
  "Phases 5-7 API verification passed: authentication, customer CRUD, and service CRUD."
)
