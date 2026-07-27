# TrimTrack Barber Management System

## Development Plan

TrimTrack is a minimalist web-based barbershop management system for managing customers, services, appointments, and basic dashboard information.

The project is designed as a beginner-friendly full-stack application that satisfies the assignment requirements for:

- A suitable relational database
- Login and dashboard pages
- CRUD operations
- Responsive design
- Prepared SQL statements
- Clear technical documentation

---

## 1. Project Scope

### 1.1 Main User

The first version will have one authenticated user:

- Administrator / Barber

### 1.2 Core Modules

1. Authentication
2. Dashboard
3. Customer Management
4. Service Management
5. Appointment Management
6. Documentation

### 1.3 Features Included

- Administrator login and logout
- Protected application routes
- Dashboard summary cards
- Customer CRUD operations
- Service CRUD operations
- Appointment CRUD operations
- Appointment status management
- Search and basic filtering
- Responsive interface
- Prepared SQL statements
- Password hashing
- Session-based authentication
- Form validation and user-friendly error messages

### 1.4 Features Excluded from Version 1

- Customer accounts
- Multiple barber accounts
- Online appointment booking
- Mobile Money or card payments
- SMS and email notifications
- Payroll
- Inventory management
- Advanced reports
- Cloud deployment

These may be proposed as future improvements.

---

## 2. Confirmed Technology Stack

### 2.1 Database

- MySQL Community Server
- MySQL Workbench
- SQL scripts for schema creation and sample data
- Foreign keys and relational constraints
- Prepared statements through `mysql2`

### 2.2 Backend

- Node.js
- Express.js 5
- `mysql2/promise`
- REST API
- `express-session`
- `bcrypt`
- `cors`
- `dotenv`
- Centralized error handling

### 2.3 Frontend

- React
- Vite
- React Router DOM v6
- Tailwind CSS
- shadcn/ui
- Axios
- TanStack Query v5

### 2.4 Development Tools

- Visual Studio Code
- Node Package Manager
- MySQL Workbench
- Browser developer tools
- Git and GitHub

---

## 3. System Architecture

```text
React Frontend
      |
      | Axios HTTP requests
      v
Express REST API
      |
      | mysql2 prepared statements
      v
Local MySQL Database
```

### 3.1 Frontend Responsibility

The React frontend will:

- Display pages and forms
- Manage navigation
- Collect user input
- Send API requests
- Display loading, success, and error states
- Cache server data with TanStack Query
- Adapt to desktop, tablet, and mobile screens

### 3.2 Backend Responsibility

The Express backend will:

- Receive API requests
- Validate request data
- Authenticate the administrator
- Protect private endpoints
- Execute prepared SQL statements
- Return JSON responses
- Handle errors consistently

### 3.3 Database Responsibility

MySQL will permanently store:

- Administrator accounts
- Customers
- Services
- Appointments

The React application must never connect directly to MySQL.

---

## 4. Database Design

### 4.1 Database Name

```sql
trimtrack_db
```

### 4.2 Tables

#### `users`

| Column | Type | Rules |
|---|---|---|
| user_id | INT | Primary key, auto increment |
| full_name | VARCHAR(100) | Required |
| email | VARCHAR(100) | Required, unique |
| password | VARCHAR(255) | Required, hashed |
| created_at | TIMESTAMP | Default current timestamp |

#### `customers`

| Column | Type | Rules |
|---|---|---|
| customer_id | INT | Primary key, auto increment |
| full_name | VARCHAR(100) | Required |
| phone_number | VARCHAR(20) | Required |
| email | VARCHAR(100) | Optional |
| gender | VARCHAR(20) | Optional |
| created_at | TIMESTAMP | Default current timestamp |

#### `services`

| Column | Type | Rules |
|---|---|---|
| service_id | INT | Primary key, auto increment |
| service_name | VARCHAR(100) | Required |
| description | VARCHAR(255) | Optional |
| price | DECIMAL(10,2) | Required |
| duration_minutes | INT | Required |
| created_at | TIMESTAMP | Default current timestamp |

#### `appointments`

| Column | Type | Rules |
|---|---|---|
| appointment_id | INT | Primary key, auto increment |
| customer_id | INT | Foreign key, required |
| service_id | INT | Foreign key, required |
| appointment_date | DATE | Required |
| appointment_time | TIME | Required |
| status | ENUM or VARCHAR(30) | Default `Scheduled` |
| notes | TEXT | Optional |
| created_at | TIMESTAMP | Default current timestamp |

### 4.3 Relationships

```text
customers 1 ---- many appointments
services  1 ---- many appointments
```

Each appointment belongs to one customer and one service.

### 4.4 Appointment Statuses

- Scheduled
- In Progress
- Completed
- Cancelled

### 4.5 Database Rules

- Use primary keys for every table.
- Use foreign keys on appointment records.
- Use `NOT NULL` for required fields.
- Use `UNIQUE` for the administrator email.
- Use suitable decimal types for prices.
- Do not store plain-text passwords.
- Use prepared statements for every SQL query that includes user input.
- Avoid destructive cascading deletes unless deliberately required.

---

## 5. REST API Design

### 5.1 Authentication Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate administrator |
| GET | `/api/auth/me` | Return current session user |
| POST | `/api/auth/logout` | End current session |

### 5.2 Dashboard Endpoint

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard/summary` | Return dashboard totals and recent appointments |

### 5.3 Customer Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/customers` | List customers |
| GET | `/api/customers/:id` | Get one customer |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |

### 5.4 Service Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/services` | List services |
| GET | `/api/services/:id` | Get one service |
| POST | `/api/services` | Create a service |
| PUT | `/api/services/:id` | Update a service |
| DELETE | `/api/services/:id` | Delete a service |

### 5.5 Appointment Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/appointments` | List appointments |
| GET | `/api/appointments/:id` | Get one appointment |
| POST | `/api/appointments` | Create an appointment |
| PUT | `/api/appointments/:id` | Update an appointment |
| PATCH | `/api/appointments/:id/status` | Update only the status |
| DELETE | `/api/appointments/:id` | Delete an appointment |

### 5.6 API Response Format

Successful response:

```json
{
  "success": true,
  "message": "Customer created successfully.",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Customer name and phone number are required."
}
```

---

## 6. Frontend Route Plan

```text
/login
/dashboard
/customers
/customers/new
/customers/:id
/customers/:id/edit
/services
/services/new
/services/:id/edit
/appointments
/appointments/new
/appointments/:id
/appointments/:id/edit
```

### 6.1 Route Structure

React Router DOM v6 will use:

- `BrowserRouter`
- `Routes`
- `Route`
- Nested layout routes
- `Outlet`
- `Navigate`
- `useNavigate`
- `useParams`

A protected route wrapper will prevent unauthenticated users from opening dashboard pages.

---

## 7. Data-Fetching Plan

TanStack Query v5 will manage server state.

### 7.1 Queries

Use `useQuery` for:

- Current administrator
- Dashboard summary
- Customers
- Single customer
- Services
- Single service
- Appointments
- Single appointment

### 7.2 Mutations

Use `useMutation` for:

- Login
- Logout
- Creating records
- Updating records
- Deleting records
- Changing appointment status

### 7.3 Cache Invalidation

After a successful mutation, invalidate the affected query keys.

Example query keys:

```text
["auth", "me"]
["dashboard", "summary"]
["customers"]
["customers", customerId]
["services"]
["services", serviceId]
["appointments"]
["appointments", appointmentId]
```

Examples:

- Creating a customer invalidates `["customers"]`.
- Updating a service invalidates `["services"]` and the selected service query.
- Creating an appointment invalidates `["appointments"]` and `["dashboard", "summary"]`.
- Completing an appointment invalidates appointment and dashboard queries.

### 7.4 Query States

Every data page must handle:

- `isPending`
- `isError`
- Empty data
- Successful data

Every mutation must handle:

- Pending state
- Error message
- Success feedback
- Disabled submit button while saving

---

## 8. Recommended Project Structure

```text
trimtrack/
|
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   ├── customerApi.js
│   │   │   ├── serviceApi.js
│   │   │   └── appointmentApi.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── customers/
│   │   │   ├── services/
│   │   │   └── appointments/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── services/
│   │   │   └── appointments/
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── query/
│   │   │   └── queryClient.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── components.json
│   ├── package.json
│   └── vite.config.js
|
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── queries.sql
│   ├── .env.example
│   └── package.json
|
├── docs/
│   ├── DATABASE.md
│   ├── TECHNOLOGY_STACK.md
│   ├── BACKEND.md
│   ├── API.md
│   ├── FRONTEND.md
│   └── USER_GUIDE.md
|
├── PLAN.md
└── README.md
```

---

# 9. Updated Development Phases

## Phase 1 — Requirements and Business Process

### Goal

Understand what the system solves before writing code.

### Tasks

- Define the barbershop problem.
- Identify the administrator as the main user.
- Define the customer, service, and appointment workflows.
- Confirm all required CRUD operations.
- Confirm project boundaries.
- Draw a simple business-process flow.
- Prepare the initial page list.
- Prepare the initial API list.

### Learning Outcomes

The student should be able to explain:

- What TrimTrack does
- Who uses it
- Why the system is needed
- What CRUD means
- How an appointment moves through the system

### Completion Check

- Project scope approved
- Tables identified
- Pages identified
- Main workflows documented

---

## Phase 2 — Local Development Environment

### Goal

Prepare all tools required for development.

### Tasks

- Install Node.js.
- Install MySQL Community Server.
- Install MySQL Workbench.
- Install Visual Studio Code.
- Confirm Node and npm versions.
- Confirm MySQL is running.
- Create the root project folder.
- Initialize Git.
- Add a suitable `.gitignore`.

### Completion Check

- Node commands work
- MySQL Workbench connects locally
- Project repository is initialized

---

## Phase 3 — Database Design in MySQL Workbench

### Goal

Build and understand the relational database first.

### Tasks

- Create `trimtrack_db`.
- Create the four tables.
- Add primary keys.
- Add foreign keys.
- Add required constraints.
- Insert sample services.
- Create a secure administrator seed process.
- Add sample customers and appointments for testing.
- Write reusable `SELECT`, `INSERT`, `UPDATE`, and `DELETE` queries.
- Write join queries for appointment listings.
- Test referential integrity.
- Export the schema into `server/database/schema.sql`.
- Export sample data into `server/database/seed.sql`.
- Document the entity relationships.

### Important Query Practice

The student should manually practise:

- Selecting all records
- Selecting one record by ID
- Searching customers by name
- Joining appointments with customers and services
- Counting dashboard records
- Updating appointment status
- Deleting a safe test record

### Completion Check

- All tables can be created from the SQL script
- Relationships work
- Sample data can be inserted
- Join queries return readable appointment information

---

## Phase 4 — Backend Foundation

### Goal

Create a stable Express 5 REST API foundation.

### Tasks

- Initialize the server package.
- Install Express, mysql2, cors, dotenv, bcrypt, and express-session.
- Configure ES modules.
- Create `app.js` and `server.js`.
- Add `express.json()` before API routes.
- Configure CORS for the React development origin.
- Configure environment variables.
- Create the MySQL connection pool using `mysql2/promise`.
- Test the database connection.
- Create a `/api/health` route.
- Create modular routers with `express.Router()`.
- Add a not-found handler after all routes.
- Add centralized error-handling middleware last.

### Express 5 Planning Notes

- Use async controllers.
- Let rejected async handlers flow to the error middleware.
- Keep parsing and general middleware before routes.
- Keep 404 and error middleware after routes.
- Use four parameters for the error middleware:
  `err, req, res, next`.

### Completion Check

- Express server starts
- Health endpoint responds
- MySQL connection succeeds
- Unknown routes return a consistent 404 response
- Server errors return JSON rather than crashing the application

---

## Phase 5 — Authentication and Security

### Goal

Secure the application before adding private CRUD routes.

### Tasks

- Hash the administrator password with bcrypt.
- Build the login controller.
- Query users with a prepared statement.
- Compare the submitted password with the stored hash.
- Configure session cookies.
- Store only necessary user details in the session.
- Build `/api/auth/me`.
- Build `/api/auth/logout`.
- Create authentication middleware.
- Protect dashboard and CRUD endpoints.
- Validate login input.
- Return a general invalid-credentials message.
- Keep secrets in `.env`.
- Create `.env.example`.

### Security Requirements

- Never store a plain-text password.
- Never concatenate user input into SQL.
- Use placeholders for all values.
- Do not expose password hashes in API responses.
- Do not commit `.env`.
- Use HTTP-only session cookies.

### Completion Check

- Correct credentials create a session
- Incorrect credentials are rejected
- Protected routes reject unauthenticated requests
- Logout destroys the session

---

## Phase 6 — Customer Backend CRUD

### Goal

Complete the first full CRUD module on the backend.

### Tasks

- Create customer routes.
- Create customer controllers.
- List all customers.
- Fetch one customer.
- Create a customer.
- Update a customer.
- Delete a customer.
- Add name and phone validation.
- Add optional search by name or phone number.
- Use prepared statements for every query.
- Return suitable HTTP status codes.
- Test with an API client.

### Completion Check

- All five customer endpoints work
- Invalid data returns useful errors
- Search works
- Prepared statements are used throughout

---

## Phase 7 — Service Backend CRUD

### Goal

Manage barbershop services and prices.

### Tasks

- Create service routes and controllers.
- List services.
- Fetch one service.
- Create a service.
- Update a service.
- Delete a service.
- Validate name, price, and duration.
- Prevent invalid negative prices and durations.
- Handle attempts to delete services used by appointments.

### Completion Check

- Service CRUD works
- Invalid prices are rejected
- Foreign-key conflicts are handled clearly

---

## Phase 8 — Appointment Backend CRUD

### Goal

Implement the main business process.

### Tasks

- Create appointment routes and controllers.
- List appointments using SQL joins.
- Fetch one appointment with customer and service details.
- Create an appointment.
- Update an appointment.
- Update appointment status.
- Delete an appointment.
- Validate customer and service IDs.
- Validate date, time, and status.
- Add optional filtering by date and status.
- Consider preventing exact duplicate appointment slots.
- Return readable appointment objects.

### Completion Check

- Appointments display names instead of only IDs
- Status updates work
- Filters work
- Invalid foreign keys are rejected

---

## Phase 9 — Dashboard Backend

### Goal

Provide useful summary information.

### Tasks

Create `/api/dashboard/summary` to return:

- Total customers
- Total services
- Total appointments
- Today’s appointments
- Completed appointments
- Recent appointments

Use SQL aggregate functions and a joined recent-appointments query.

### Completion Check

- Dashboard endpoint returns all required totals
- Recent appointments contain customer and service names

---

## Phase 10 — Frontend Foundation and Design System

### Goal

Create a clean, responsive React application shell.

### Tasks

- Create the Vite React application.
- Install React Router DOM v6.
- Install Axios.
- Install TanStack Query v5.
- Configure Tailwind CSS.
- Initialize shadcn/ui.
- Create the application colour palette.
- Create typography, spacing, and component conventions.
- Configure the Axios instance.
- Configure `QueryClient`.
- Wrap the app with `QueryClientProvider`.
- Configure `BrowserRouter`.
- Build global loading and error components.

### Suggested Visual Direction

- Primary: near-black or charcoal
- Accent: gold or amber
- Surface: white
- Background: light neutral grey
- Success: green
- Warning: amber
- Danger: red

### Completion Check

- Tailwind classes work
- shadcn/ui components render
- Axios uses the backend base URL
- TanStack Query provider is active
- Router renders placeholder pages

---

## Phase 11 — Routing, Login, and Protected Layout

### Goal

Connect frontend authentication to the backend.

### Tasks

- Build the login page.
- Create the authentication query for `/api/auth/me`.
- Create the login mutation.
- Create the logout mutation.
- Build a protected-route component with `Navigate`.
- Build the dashboard layout.
- Use nested routes and `Outlet`.
- Add sidebar and top navigation.
- Redirect to the dashboard after successful login.
- Redirect to login after logout or unauthorized responses.
- Ensure Axios sends session credentials.

### React Router v6 Planning Notes

- Use nested routes for the shared dashboard layout.
- Render child pages through `Outlet`.
- Use route parameters for view and edit pages.
- Use `Navigate` for authentication redirects.
- Use `useNavigate` after successful form submissions.

### Completion Check

- Login redirects correctly
- Refreshing a protected page preserves the session
- Logged-out users cannot access dashboard pages
- Layout remains visible while child pages change

---

## Phase 12 — Dashboard Frontend

### Goal

Display the first useful authenticated screen.

### Tasks

- Create the dashboard summary query.
- Display summary cards.
- Display today’s appointments.
- Display recent appointments.
- Add loading skeletons.
- Add an error state.
- Add an empty state.
- Make cards responsive.

### Completion Check

- Dashboard data comes from the backend
- Loading, error, and success states are visible
- Layout works on phone and desktop widths

---

## Phase 13 — Customer Frontend CRUD

### Goal

Build the first complete frontend CRUD workflow.

### Tasks

- Create the customer list query.
- Build the customer table.
- Add customer search.
- Build create and edit forms.
- Build a customer details page.
- Add create, update, and delete mutations.
- Add confirmation before deletion.
- Invalidate customer queries after mutations.
- Show success and error feedback.

### Completion Check

- Customer CRUD works from the browser
- Lists refresh automatically after changes
- Forms prevent invalid submissions

---

## Phase 14 — Service Frontend CRUD

### Goal

Manage barbershop services from the interface.

### Tasks

- Build service list and card/table view.
- Build create and edit forms.
- Add delete confirmation.
- Format service prices consistently.
- Show duration in minutes.
- Add TanStack Query mutations and invalidation.
- Display backend constraint errors clearly.

### Completion Check

- Service CRUD works
- Prices and durations display correctly
- Lists update without a manual page refresh

---

## Phase 15 — Appointment Frontend CRUD

### Goal

Complete the central booking workflow.

### Tasks

- Fetch customers and services for selection fields.
- Build the appointment list.
- Build create and edit forms.
- Build appointment details.
- Add date and status filters.
- Add status badges.
- Add quick status update controls.
- Add delete confirmation.
- Invalidate appointment and dashboard queries after mutations.
- Display joined customer and service information.

### Completion Check

- An appointment can be created from existing customers and services
- Status can be changed
- Filters work
- Dashboard totals update after relevant changes

---

## Phase 16 — Responsive Design and Accessibility

### Goal

Ensure the system works well on different screens.

### Tasks

- Test login on mobile.
- Make sidebar responsive.
- Make tables horizontally scrollable when necessary.
- Use cards on very small screens where tables become difficult.
- Ensure form labels are connected to inputs.
- Ensure buttons have clear text.
- Maintain readable contrast.
- Add keyboard focus states.
- Check empty, loading, and error layouts.

### Completion Check

- App is usable at mobile, tablet, and desktop widths
- No important content overflows
- Forms are keyboard accessible

---

## Phase 17 — Validation, Error Handling, and Testing

### Goal

Improve reliability before presentation.

### Backend Tests

- Missing required fields
- Invalid IDs
- Invalid prices
- Invalid appointment status
- Duplicate administrator email
- Foreign-key conflicts
- SQL injection attempts
- Unauthorized requests
- Unknown routes
- Database connection failure

### Frontend Tests

- Login success and failure
- Query loading states
- API error messages
- Empty lists
- Form validation
- Create, edit, and delete workflows
- Session persistence after refresh
- Responsive navigation
- Delete confirmations

### Completion Check

- Main workflows pass
- The server does not crash on expected input errors
- Errors are understandable to the user

---

## Phase 18 — Documentation

### Goal

Prepare clear project and learning documentation.

### Required Documents

#### `docs/DATABASE.md`

Include:

- Database purpose
- Table descriptions
- Data types
- Primary and foreign keys
- Relationship explanation
- Schema script
- Common queries
- Prepared statement explanation

#### `docs/TECHNOLOGY_STACK.md`

Include:

- React
- React Router DOM v6
- Tailwind CSS
- shadcn/ui
- Axios
- TanStack Query v5
- Node.js
- Express 5
- MySQL
- mysql2
- bcrypt
- express-session

Explain the role of each technology.

#### `docs/BACKEND.md`

Include:

- Backend folder structure
- Request lifecycle
- Route-controller-database flow
- Middleware order
- Sessions
- Password hashing
- Prepared statements
- Error handling

#### `docs/API.md`

Include:

- Every endpoint
- HTTP methods
- Request examples
- Response examples
- Status codes

#### `docs/FRONTEND.md`

Include:

- Route structure
- Component structure
- Design system
- Axios setup
- Query keys
- Query and mutation flow
- Protected routes

#### `docs/USER_GUIDE.md`

Include:

- Login steps
- Dashboard explanation
- Managing customers
- Managing services
- Managing appointments
- Logging out

### Completion Check

- Another student can understand and run the project from the documentation
- The friend can explain each technology in simple terms

---

## Phase 19 — Final Presentation Preparation

### Goal

Prepare the student to demonstrate and defend the project.

### Presentation Order

1. Introduce TrimTrack.
2. Explain the barbershop problem.
3. Explain the proposed solution.
4. Show the database tables.
5. Explain relationships.
6. Show prepared statements.
7. Log into the application.
8. Show the dashboard.
9. Create a customer.
10. Create a service.
11. Create an appointment.
12. Update the appointment status.
13. Edit a record.
14. Delete a test record.
15. Demonstrate search or filtering.
16. Resize the browser to show responsiveness.
17. Explain frontend, backend, and database communication.
18. Log out.
19. Mention future improvements.

### Questions the Student Must Answer

- What is CRUD?
- Why does React not connect directly to MySQL?
- What does Express do?
- What is an API endpoint?
- What is a foreign key?
- Why are prepared statements important?
- Why are passwords hashed?
- What does TanStack Query manage?
- What does Axios do?
- How does React Router protect pages?
- How does the application remain responsive?

---

# 10. Development Rules

1. Build one module at a time.
2. Finish and test the database before the backend.
3. Finish and test backend endpoints before connecting the frontend.
4. Use prepared statements for all user-supplied values.
5. Keep the initial scope small.
6. Do not add unrelated features.
7. Keep names consistent across database, backend, and frontend.
8. Return consistent API responses.
9. Handle loading, error, empty, and success states.
10. Update documentation as each phase is completed.
11. Ensure the student can explain every major file before moving on.
12. Run the application locally before every presentation practice.

---

# 11. Definition of Done

TrimTrack is complete when:

- The database can be created from the SQL scripts.
- The administrator can log in and log out.
- Protected routes work.
- Customer CRUD works.
- Service CRUD works.
- Appointment CRUD works.
- Appointment status updates work.
- Dashboard summaries work.
- Search and filtering work.
- Prepared statements are used.
- Passwords are hashed.
- The interface is responsive.
- Errors are handled clearly.
- Documentation is complete.
- The student can explain and demonstrate the full workflow.
