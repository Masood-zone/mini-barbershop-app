import { useState } from "react"
import {
  CalendarDays,
  Clock3,
  Mail,
  Pencil,
  Phone,
  Scissors,
  Trash2,
  UserRound,
} from "lucide-react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ErrorState, PageLoading } from "@/components/shared/page-state"
import { InlineNotice } from "@/components/shared/inline-notice"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import {
  useAppointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/services/api/appointments/appointments.queries"
import {
  appointmentStatuses,
  type AppointmentStatus,
} from "@/types/appointment"
import { getErrorMessage } from "@/utils/api-error"
import { formatDate, formatPrice, formatTime } from "@/utils/format"

export function Component() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const appointmentId = Number(params.id)
  const appointment = useAppointment(appointmentId)
  const updateStatus = useUpdateAppointmentStatus()
  const deleteAppointment = useDeleteAppointment()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [localNotice, setLocalNotice] = useState("")
  const routeNotice = (location.state as { notice?: string } | null)?.notice

  if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
    return <ErrorState message="Use a valid appointment address." />
  }

  if (appointment.isPending) {
    return <PageLoading label="Loading appointment" />
  }

  if (appointment.isError) {
    return (
      <ErrorState
        message={getErrorMessage(appointment.error)}
        onRetry={() => appointment.refetch()}
      />
    )
  }

  if (!appointment.data) {
    return null
  }

  const handleDelete = () => {
    deleteAppointment.mutate(appointmentId, {
      onSuccess: () =>
        navigate("/appointments", {
          replace: true,
          state: { notice: "Appointment deleted." },
        }),
    })
  }

  return (
    <div className="grid gap-7">
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

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Appointment details</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            {appointment.data.customer.fullName}
          </h1>
          <div className="mt-2">
            <StatusBadge status={appointment.data.status} />
          </div>
        </div>
        <Button
          render={<Link to={`/appointments/${appointmentId}/edit`} />}
          variant="outline"
        >
          <Pencil />
          Edit appointment
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
            <UserRound className="text-primary" />
            Customer
          </h2>
          <dl className="mt-6 grid gap-5">
            <div className="flex gap-3">
              <UserRound className="size-5 text-primary" />
              <div>
                <dt className="text-xs font-semibold uppercase">Name</dt>
                <dd>{appointment.data.customer.fullName}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="size-5 text-primary" />
              <div>
                <dt className="text-xs font-semibold uppercase">Phone</dt>
                <dd>{appointment.data.customer.phoneNumber}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="size-5 text-primary" />
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase">Email</dt>
                <dd className="break-words">
                  {appointment.data.customer.email ?? "Not provided"}
                </dd>
              </div>
            </div>
          </dl>
          <Button
            render={
              <Link
                to={`/customers/${appointment.data.customer.customerId}`}
              />
            }
            variant="outline"
            className="mt-6"
          >
            View customer
          </Button>
        </Card>

        <Card className="p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
            <Scissors className="text-primary" />
            Service
          </h2>
          <dl className="mt-6 grid gap-5">
            <div>
              <dt className="text-xs font-semibold uppercase">Service</dt>
              <dd className="text-lg font-semibold">
                {appointment.data.service.serviceName}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase">Duration</dt>
                <dd>{appointment.data.service.durationMinutes} minutes</dd>
              </div>
              <div className="text-right">
                <dt className="text-xs font-semibold uppercase">Price</dt>
                <dd className="text-lg font-semibold text-primary">
                  {formatPrice(appointment.data.service.price)}
                </dd>
              </div>
            </div>
          </dl>
        </Card>

        <Card className="p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
            <CalendarDays className="text-primary" />
            Schedule
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase">Date</p>
              <p className="mt-1">{formatDate(appointment.data.appointmentDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase">Start time</p>
              <p className="mt-1 inline-flex items-center gap-2">
                <Clock3 className="size-4 text-primary" />
                {formatTime(appointment.data.appointmentTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-7">
          <h2 className="font-heading text-2xl font-semibold">Status & notes</h2>
          <div className="mt-5">
            <label
              htmlFor="detail-status"
              className="mb-2 block text-xs font-semibold uppercase"
            >
              Quick status update
            </label>
            <Select
              id="detail-status"
              value={appointment.data.status}
              disabled={updateStatus.isPending}
              onChange={(event) =>
                updateStatus.mutate(
                  {
                    appointmentId,
                    status: event.target.value as AppointmentStatus,
                  },
                  {
                    onSuccess: () =>
                      setLocalNotice("Appointment status updated."),
                  }
                )
              }
            >
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-5 rounded-lg bg-muted/60 p-4">
            <p className="text-xs font-semibold uppercase">Notes</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {appointment.data.notes ?? "No notes were added."}
            </p>
          </div>
        </Card>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button
          variant="ghost"
          className="text-destructive"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 />
          Delete appointment
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete appointment?"
        description="This permanently removes the appointment and its notes. The customer and service remain available."
        confirmLabel="Delete appointment"
        busy={deleteAppointment.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
