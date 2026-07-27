import { useState } from "react"
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Users,
  X,
} from "lucide-react"
import {
  NavLink,
  Outlet,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom"

import { Brand } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/services/api/auth/auth.queries"
import type { AuthenticatedUser } from "@/types/auth"
import { initials } from "@/utils/format"

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/services", label: "Services", icon: Scissors },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
]

function SidebarContent({
  onNavigate,
  onLogout,
  loggingOut,
}: {
  onNavigate?: () => void
  onLogout: () => void
  loggingOut: boolean
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-5">
        <Brand />
      </div>
      <nav aria-label="Primary" className="mt-5 grid gap-2 px-4">
        {navigationItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")
            }
          >
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          disabled={loggingOut}
          onClick={onLogout}
        >
          <LogOut aria-hidden="true" />
          {loggingOut ? "Logging out…" : "Logout"}
        </Button>
      </div>
    </div>
  )
}

export function AppLayout() {
  const user = useRouteLoaderData("protected") as AuthenticatedUser
  const navigation = useNavigation()
  const navigate = useNavigate()
  const logout = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    })
  }

  return (
    <div className="min-h-svh bg-background">
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r bg-sidebar lg:block">
        <SidebarContent
          onLogout={handleLogout}
          loggingOut={logout.isPending}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/35"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(86vw,300px)] border-r bg-sidebar shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-3"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X />
            </Button>
            <SidebarContent
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
              loggingOut={logout.isPending}
            />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden h-8 w-px bg-border sm:block" />
            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials(user.fullName)}
            </span>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-sm font-semibold">
                {user.fullName}
              </p>
              <p className="max-w-40 truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
          </div>
          {navigation.state !== "idle" ? (
            <div
              className="absolute right-0 bottom-0 left-0 h-0.5 animate-pulse bg-primary"
              role="progressbar"
              aria-label="Loading page"
            />
          ) : null}
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
