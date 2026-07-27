import { useMemo, useState } from "react"
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Avatar } from "@/components/shared/avatar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState, ErrorState, PageLoading } from "@/components/shared/page-state"
import { InlineNotice } from "@/components/shared/inline-notice"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  useAppointments,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/services/api/appointments/appointments.queries"
import {
  appointmentStatuses,
  type Appointment,
  type AppointmentStatus,
} from "@/types/appointment"
import { getErrorMessage } from "@/utils/api-error"
import { formatDate, formatTime } from "@/utils/format"

export function Component() {
  const location = useLocation()
  const [date, setDate] = useState("")
  const [status, setStatus] = useState<AppointmentStatus | "">("")
  const [search, setSearch] = useState("")
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null)
  const [localNotice, setLocalNotice] = useState("")
  const appointments = useAppointments({ date, status })
  const updateStatus = useUpdateAppointmentStatus()
  const deleteAppointment = useDeleteAppointment()
  const routeNotice = (location.state as { notice?: string } | null)?.notice
  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLocaleLowerCase()

    if (!term) {
      return appointments.data ?? []
    }

    return (
      appointments.data?.filter(
        (appointment) =>
          appointment.customer.fullName.toLocaleLowerCase().includes(term) ||
          appointment.customer.phoneNumber.toLocaleLowerCase().includes(term)
      ) ?? []
    )
  }, [appointments.data, search])

  const handleDelete = () => {
    if (!appointmentToDelete) {
      return
    }

    deleteAppointment.mutate(appointmentToDelete.appointmentId, {
      onSuccess: () => {
        setLocalNotice("Appointment deleted.")
        setAppointmentToDelete(null)
      },
    })
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title="Appointments"
        description="Manage upcoming bookings, schedules, and appointment statuses."
        action={
          <Button render={<Link to="/appointments/new" />}>
            <Plus aria-hidden="true" />
            Create appointment
          </Button>
        }
      />
      {routeNotice || localNotice ? (
        <InlineNotice tone="success">
          {localNotice || routeNotice}
        </InlineNotice>
      ) : null}
      {updateStatus.error || deleteAppointment.error ? (
        <InlineNotice tone="error">
          {getErrorMessage(updateStatus.error ?? deleteAppointment.error)}
        </InlineNotice>
      ) : null}

      <Card className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(11rem,0.6fr)_minmax(12rem,0.7fr)]">
        <div>
          <label
            htmlFor="appointment-search"
            className="mb-1.5 block text-xs font-semibold uppercase"
          >
            Search customer
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="appointment-search"
              type="search"
              placeholder="Name or phone…"
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="appointment-date-filter"
            className="mb-1.5 block text-xs font-semibold uppercase"
          >
            Date
          </label>
          <Input
            id="appointment-date-filter"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="appointment-status-filter"
            className="mb-1.5 block text-xs font-semibold uppercase"
          >
            Status
          </label>
          <Select
            id="appointment-status-filter"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AppointmentStatus | "")
            }
          >
            <option value="">All statuses</option>
            {appointmentStatuses.map((appointmentStatus) => (
              <option key={appointmentStatus} value={appointmentStatus}>
                {appointmentStatus}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {appointments.isPending ? (
        <PageLoading label="Loading appointments" />
      ) : null}
      {appointments.isError ? (
        <ErrorState
          message={getErrorMessage(appointments.error)}
          onRetry={() => appointments.refetch()}
        />
      ) : null}
      {appointments.data && filteredAppointments.length === 0 ? (
        <EmptyState
          title="No matching appointments"
          description="Adjust the filters or create a new appointment."
          action={
            <Button render={<Link to="/appointments/new" />}>
              Create appointment
            </Button>
          }
        />
      ) : null}
      {filteredAppointments.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(9rem,0.8fr)_minmax(10rem,0.8fr)_auto] gap-4 bg-muted/50 px-6 py-4 text-xs font-semibold uppercase md:grid">
            <span>Customer</span>
            <span>Service</span>
            <span>Date & time</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="divide-y">
            {filteredAppointments.map((appointment) => (
              <article
                key={appointment.appointmentId}
                className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(9rem,0.8fr)_minmax(10rem,0.8fr)_auto] md:items-center md:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={appointment.customer.fullName} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {appointment.customer.fullName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {appointment.customer.phoneNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {appointment.service.serviceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.service.durationMinutes} min
                  </p>
                </div>
                <div className="text-sm">
                  <p>{formatDate(appointment.appointmentDate)}</p>
                  <p className="text-muted-foreground">
                    {formatTime(appointment.appointmentTime)}
                  </p>
                </div>
                <div className="grid gap-2">
                  <StatusBadge status={appointment.status} />
                  <Select
                    aria-label={`Change status for ${appointment.customer.fullName}`}
                    className="h-9 text-xs"
                    value={appointment.status}
                    disabled={updateStatus.isPending}
                    onChange={(event) =>
                      updateStatus.mutate(
                        {
                          appointmentId: appointment.appointmentId,
                          status: event.target.value as AppointmentStatus,
                        },
                        {
                          onSuccess: () =>
                            setLocalNotice("Appointment status updated."),
                        }
                      )
                    }
                  >
                    {appointmentStatuses.map((appointmentStatus) => (
                      <option key={appointmentStatus} value={appointmentStatus}>
                        {appointmentStatus}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    render={
                      <Link to={`/appointments/${appointment.appointmentId}`} />
                    }
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`View ${appointment.customer.fullName}'s appointment`}
                  >
                    <Eye />
                  </Button>
                  <Button
                    render={
                      <Link
                        to={`/appointments/${appointment.appointmentId}/edit`}
                      />
                    }
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${appointment.customer.fullName}'s appointment`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    aria-label={`Delete ${appointment.customer.fullName}'s appointment`}
                    onClick={() => {
                      deleteAppointment.reset()
                      setLocalNotice("")
                      setAppointmentToDelete(appointment)
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Card>
      ) : null}

      <ConfirmDialog
        open={appointmentToDelete !== null}
        title="Delete appointment?"
        description={`This permanently removes ${appointmentToDelete?.customer.fullName ?? "this customer's"} appointment and its notes. The customer and service will remain.`}
        confirmLabel="Delete appointment"
        busy={deleteAppointment.isPending}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleteAppointment.isPending) {
            setAppointmentToDelete(null)
          }
        }}
      />
    </div>
  )
}
