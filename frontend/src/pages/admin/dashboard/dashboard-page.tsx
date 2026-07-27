import {
  CalendarDays,
  CheckCircle2,
  Scissors,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

import { AppointmentRow } from "@/components/shared/appointment-row"
import { EmptyState, ErrorState, PageLoading } from "@/components/shared/page-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDashboardSummary } from "@/services/api/dashboard/dashboard.queries"
import { getErrorMessage } from "@/utils/api-error"
import { formatLongDate } from "@/utils/format"

const statDefinitions = [
  { key: "totalCustomers", label: "Total customers", icon: Users },
  { key: "totalServices", label: "Total services", icon: Scissors },
  { key: "todaysAppointments", label: "Today's appointments", icon: CalendarDays },
  { key: "completedAppointments", label: "Completed", icon: CheckCircle2 },
] as const

export function Component() {
  const summary = useDashboardSummary()

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Dashboard"
        description={formatLongDate()}
        action={
          <Button render={<Link to="/appointments/new" />}>
            <CalendarDays aria-hidden="true" />
            Create appointment
          </Button>
        }
      />

      {summary.isPending ? <PageLoading label="Loading dashboard" /> : null}
      {summary.isError ? (
        <ErrorState
          message={getErrorMessage(summary.error)}
          onRetry={() => summary.refetch()}
        />
      ) : null}
      {summary.data ? (
        <>
          <section
            aria-label="Business summary"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {statDefinitions.map(({ key, label, icon: Icon }) => (
              <Card key={key} className="flex items-center gap-4 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    {label}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums">
                    {summary.data[key].toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-semibold">
                  Today&apos;s schedule
                </h2>
                <Button
                  render={<Link to="/appointments" />}
                  variant="ghost"
                  size="sm"
                >
                  View all
                </Button>
              </div>
              {summary.data.todayAppointments.length === 0 ? (
                <EmptyState
                  title="No appointments today"
                  description="The schedule is clear. Create an appointment when a customer books."
                  action={
                    <Button render={<Link to="/appointments/new" />}>
                      Create appointment
                    </Button>
                  }
                />
              ) : (
                <Card className="overflow-hidden">
                  {summary.data.todayAppointments.map((appointment) => (
                    <AppointmentRow
                      key={appointment.appointmentId}
                      appointment={appointment}
                      showDate={false}
                    />
                  ))}
                </Card>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-semibold">
                  Recent appointments
                </h2>
              </div>
              {summary.data.recentAppointments.length === 0 ? (
                <EmptyState
                  title="No appointment history"
                  description="Recent bookings will appear here."
                />
              ) : (
                <Card className="divide-y overflow-hidden">
                  {summary.data.recentAppointments.map((appointment) => (
                    <Link
                      key={appointment.appointmentId}
                      to={`/appointments/${appointment.appointmentId}`}
                      className="block p-4 transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {appointment.customer.fullName}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {appointment.service.serviceName}
                          </p>
                        </div>
                        <span className="text-xs whitespace-nowrap text-muted-foreground">
                          {appointment.appointmentDate}
                        </span>
                      </div>
                    </Link>
                  ))}
                </Card>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
  )
}
