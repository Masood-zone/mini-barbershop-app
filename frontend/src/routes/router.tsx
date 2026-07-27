import { redirect } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { queryClient } from "@/lib/query-client"
import { currentUserQueryOptions } from "@/services/api/auth/auth.queries"

async function requireUser() {
  try {
    return await queryClient.ensureQueryData(currentUserQueryOptions())
  } catch {
    throw redirect("/login")
  }
}

async function redirectAuthenticatedUser() {
  try {
    await queryClient.ensureQueryData(currentUserQueryOptions())
    throw redirect("/dashboard")
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }

    return null
  }
}

export const router = createBrowserRouter([
  {
    path: "/login",
    loader: redirectAuthenticatedUser,
    lazy: () => import("@/pages/auth/login-page"),
  },
  {
    id: "protected",
    path: "/",
    loader: requireUser,
    Component: AppLayout,
    children: [
      {
        index: true,
        loader: () => redirect("/dashboard"),
      },
      {
        path: "dashboard",
        lazy: () => import("@/pages/admin/dashboard/dashboard-page"),
      },
      {
        path: "customers",
        lazy: () => import("@/pages/admin/customers/customers-page"),
      },
      {
        path: "customers/new",
        lazy: () => import("@/pages/admin/customers/customer-form-page"),
      },
      {
        path: "customers/:id",
        lazy: () => import("@/pages/admin/customers/customer-detail-page"),
      },
      {
        path: "customers/:id/edit",
        lazy: () => import("@/pages/admin/customers/customer-form-page"),
      },
      {
        path: "services",
        lazy: () => import("@/pages/admin/services/services-page"),
      },
      {
        path: "services/new",
        lazy: () => import("@/pages/admin/services/service-form-page"),
      },
      {
        path: "services/:id/edit",
        lazy: () => import("@/pages/admin/services/service-form-page"),
      },
      {
        path: "appointments",
        lazy: () => import("@/pages/admin/appointments/appointments-page"),
      },
      {
        path: "appointments/new",
        lazy: () => import("@/pages/admin/appointments/appointment-form-page"),
      },
      {
        path: "appointments/:id",
        lazy: () => import("@/pages/admin/appointments/appointment-detail-page"),
      },
      {
        path: "appointments/:id/edit",
        lazy: () => import("@/pages/admin/appointments/appointment-form-page"),
      },
      {
        path: "*",
        lazy: () => import("@/pages/not-found/not-found-page"),
      },
    ],
  },
])
