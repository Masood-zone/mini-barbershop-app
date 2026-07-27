import { useMemo, useState } from "react"
import {
  CalendarDays,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

import { AppointmentRow } from "@/components/shared/appointment-row"
import { Avatar } from "@/components/shared/avatar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState, ErrorState, PageLoading } from "@/components/shared/page-state"
import { InlineNotice } from "@/components/shared/inline-notice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppointments } from "@/services/api/appointments/appointments.queries"
import {
  useCustomer,
  useDeleteCustomer,
} from "@/services/api/customers/customers.queries"
import { getErrorMessage } from "@/utils/api-error"
import { formatDate } from "@/utils/format"

export function Component() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const customerId = Number(params.id)
  const customer = useCustomer(customerId)
  const appointments = useAppointments()
  const deleteCustomer = useDeleteCustomer()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const notice = (location.state as { notice?: string } | null)?.notice
  const customerAppointments = useMemo(
    () =>
      appointments.data?.filter(
        (appointment) => appointment.customer.customerId === customerId
      ) ?? [],
    [appointments.data, customerId]
  )

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return <ErrorState message="Use a valid customer address." />
  }

  if (customer.isPending) {
    return <PageLoading label="Loading customer" />
  }

  if (customer.isError) {
    return (
      <ErrorState
        message={getErrorMessage(customer.error)}
        onRetry={() => customer.refetch()}
      />
    )
  }

  if (!customer.data) {
    return null
  }

  const handleDelete = () => {
    deleteCustomer.mutate(customerId, {
      onSuccess: () =>
        navigate("/customers", {
          replace: true,
          state: { notice: "Customer deleted." },
        }),
    })
  }

  return (
    <div className="grid gap-7">
      {notice ? <InlineNotice tone="success">{notice}</InlineNotice> : null}
      {deleteCustomer.error ? (
        <InlineNotice tone="error">
          {getErrorMessage(deleteCustomer.error)}
        </InlineNotice>
      ) : null}

      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            name={customer.data.fullName}
            className="size-20 text-2xl sm:size-24"
          />
          <div>
            <p className="text-sm text-muted-foreground">Customer profile</p>
            <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
              {customer.data.fullName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registered {formatDate(customer.data.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            render={<Link to={`/customers/${customerId}/edit`} />}
            variant="outline"
          >
            <Pencil aria-hidden="true" />
            Edit customer
          </Button>
          <Button
            render={<Link to={`/appointments/new?customerId=${customerId}`} />}
          >
            <CalendarDays aria-hidden="true" />
            Create appointment
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card className="flex flex-col p-5 sm:p-6">
          <h2 className="font-heading text-2xl font-semibold">Personal info</h2>
          <dl className="mt-6 grid gap-5">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-muted-foreground uppercase">
                  Email
                </dt>
                <dd className="break-words">
                  {customer.data.email ?? "Not provided"}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-semibold text-muted-foreground uppercase">
                  Phone
                </dt>
                <dd>{customer.data.phoneNumber}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <UserRound className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-semibold text-muted-foreground uppercase">
                  Gender
                </dt>
                <dd>{customer.data.gender ?? "Not specified"}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-8 border-t pt-5 xl:mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 />
              Delete customer
            </Button>
          </div>
        </Card>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            <h2 className="font-heading text-2xl font-semibold">
              Appointment history
            </h2>
          </div>
          {appointments.isPending ? (
            <PageLoading label="Loading appointment history" />
          ) : null}
          {appointments.isError ? (
            <ErrorState
              message={getErrorMessage(appointments.error)}
              onRetry={() => appointments.refetch()}
            />
          ) : null}
          {appointments.data && customerAppointments.length === 0 ? (
            <EmptyState
              title="No appointments yet"
              description="This customer's appointments will appear here."
              action={
                <Button
                  render={
                    <Link to={`/appointments/new?customerId=${customerId}`} />
                  }
                >
                  Create appointment
                </Button>
              }
            />
          ) : null}
          {customerAppointments.length > 0 ? (
            <Card className="overflow-hidden">
              {customerAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
            </Card>
          ) : null}
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete customer?"
        description={`This permanently deletes ${customer.data.fullName}. A customer with appointment history cannot be deleted.`}
        confirmLabel="Delete customer"
        busy={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
