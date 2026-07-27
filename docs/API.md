# TrimTrack API

## Conventions

The local base URL is `http://localhost:3400/api`. JSON responses use:

```json
{
  "success": true,
  "message": "Operation completed.",
  "data": {}
}
```

Errors set `success` to `false`. Validation errors may include field details in
`data`. Dates are serialized as ISO 8601 strings, prices are JSON numbers, and
request/response fields use camelCase.

Authentication uses the HTTP-only `trimtrack.sid` session cookie. Browser
clients must send requests with credentials enabled. The health and login
endpoints are public; all other endpoints below require an authenticated
session.

## Authentication

### `POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "local-password"
}
```

Returns `200` with:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "userId": 1,
    "fullName": "TrimTrack Administrator",
    "email": "admin@example.com"
  }
}
```

Invalid credentials return `401` with the general message
`Invalid email or password.` Password hashes are never returned.

### `GET /auth/me`

Returns the current safe user object. Missing or expired sessions return `401`.

### `POST /auth/logout`

Destroys the server-side session, clears the cookie, and returns `200`.

## Customers

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/customers` | List customers |
| `GET` | `/customers?search=term` | Search name or phone |
| `GET` | `/customers/:id` | Fetch one customer |
| `POST` | `/customers` | Create and return a customer |
| `PUT` | `/customers/:id` | Replace editable customer fields |
| `DELETE` | `/customers/:id` | Delete an unreferenced customer |

Create and update body:

```json
{
  "fullName": "Daniel Mensah",
  "phoneNumber": "0241112233",
  "email": "daniel@example.com",
  "gender": "Male"
}
```

`fullName` and `phoneNumber` are required. `email` and `gender` may be omitted
or `null`; gender accepts `Male`, `Female`, or `Other`. Invalid IDs and bodies
return `400`, missing customers return `404`, and customers referenced by
appointments return `409` on deletion.

## Services

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/services` | List services |
| `GET` | `/services/:id` | Fetch one service |
| `POST` | `/services` | Create and return a service |
| `PUT` | `/services/:id` | Replace editable service fields |
| `DELETE` | `/services/:id` | Delete an unreferenced service |

Create and update body:

```json
{
  "serviceName": "Standard Haircut",
  "description": "A clean and professional haircut.",
  "price": 30,
  "durationMinutes": 30
}
```

`serviceName`, non-negative `price`, and positive integer `durationMinutes` are
required. `description` may be omitted or `null`. Missing services return `404`;
services referenced by appointments return `409` on deletion.

## Foundation

`GET /health` is public and returns API and database readiness. Unknown routes,
malformed JSON, and unexpected errors use the same JSON envelope.
