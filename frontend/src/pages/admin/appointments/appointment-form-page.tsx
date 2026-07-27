import { type FormEvent, useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, Scissors, UserRound } from "lucide-react"
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

import { ErrorState, PageLoading } from "@/components/shared/page-state"
import { Field } from "@/components/shared/field"
import { InlineNotice } from "@/components/shared/inline-notice"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
} from "@/services/api/appointments/appointments.queries"
import { useCustomers } from "@/services/api/customers/customers.queries"
import { useServices } from "@/services/api/services/services.queries"
import {
  appointmentStatuses,
  type AppointmentInput,
  type AppointmentStatus,
} from "@/types/appointment"
import {
  getErrorMessage,
  getFieldErrors,
} from "@/utils/api-error"
import { formatPrice } from "@/utils/format"

const emptyInput: Required<AppointmentInput> = {
  customerId: 0,
  serviceId: 0,
  appointmentDate: "",
  appointmentTime: "",
  status: "Scheduled",
  notes: null,
}

export function Component() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const appointmentId = Number(params.id)
  const editing = Number.isInteger(appointmentId) && appointmentId > 0
  const appointment = useAppointment(appointmentId)
  const customers = useCustomers()
  const services = useServices()
  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()
  const initialCustomerId = Number(searchParams.get("customerId"))
  const [draft, setDraft] = useState<Required<AppointmentInput> | null>(null)
  const [clientError, setClientError] = useState("")
  const mutation = editing ? updateAppointment : createAppointment
  const input =
    draft ??
    (appointment.data
      ? {
          customerId: appointment.data.customer.customerId,
          serviceId: appointment.data.service.serviceId,
          appointmentDate: appointment.data.appointmentDate,
          appointmentTime: appointment.data.appointmentTime.slice(0, 5),
          status: appointment.data.status,
          notes: appointment.data.notes,
        }
      : {
          ...emptyInput,
          customerId:
            Number.isInteger(initialCustomerId) && initialCustomerId > 0
              ? initialCustomerId
              : 0,
        })
  const selectedService = useMemo(
    () =>
      services.data?.find(
        (service) => service.serviceId === input.serviceId
      ),
    [input.serviceId, services.data]
  )

  const fieldErrors = getFieldErrors(mutation.error)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClientError("")

    if (input.customerId <= 0 || input.serviceId <= 0) {
      setClientError("Select a customer and service.")
      return
    }

    if (!input.appointmentDate || !input.appointmentTime) {
      setClientError("Choose an appointment date and start time.")
      return
    }

    const normalizedInput: AppointmentInput = {
      ...input,
      notes: input.notes?.trim() || null,
    }
    const onSuccess = (savedAppointment: { appointmentId: number }) =>
      navigate(`/appointments/${savedAppointment.appointmentId}`, {
        replace: true,
        state: {
          notice: editing
            ? "Appointment updated successfully."
            : "Appointment created successfully.",
        },
      })

    if (editing) {
      updateAppointment.mutate(
        { appointmentId, input: normalizedInput },
        { onSuccess }
      )
      return
    }

    createAppointment.mutate(normalizedInput, { onSuccess })
  }

  if (
    (editing && appointment.isPending) ||
    customers.isPending ||
    services.isPending
  ) {
    return <PageLoading label="Loading appointment form" />
  }

  if (
    (editing && appointment.isError) ||
    customers.isError ||
    services.isError
  ) {
    const error = appointment.error ?? customers.error ?? services.error
    return <ErrorState message={getErrorMessage(error)} />
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title={editing ? "Edit appointment" : "New appointment"}
        description={
          editing
            ? "Update the customer, service, schedule, status, or notes."
            : "Schedule a service for an existing customer."
        }
      />
      <form
        className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid content-start gap-6">
          {clientError || mutation.error ? (
            <InlineNotice tone="error">
              {clientError ||
                getErrorMessage(
                  mutation.error,
                  "We couldn't save this appointment."
                )}
            </InlineNotice>
          ) : null}
          <Card className="grid gap-5 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
              <UserRound className="size-5 text-primary" />
              Customer details
            </h2>
            <Field
              id="customerId"
              label="Select customer"
              required
              error={fieldErrors.customerId?.[0]}
            >
              <Select
                id="customerId"
                value={input.customerId}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    customerId: Number(event.target.value),
                  }))
                }
              >
                <option value={0}>Choose a customer</option>
                {customers.data?.map((customer) => (
                  <option
                    key={customer.customerId}
                    value={customer.customerId}
                  >
                    {customer.fullName} · {customer.phoneNumber}
                  </option>
                ))}
              </Select>
            </Field>
            {customers.data?.length === 0 ? (
              <InlineNotice tone="error">
                Add a customer before creating an appointment.{" "}
                <Link to="/customers/new" className="underline">
                  Add customer
                </Link>
              </InlineNotice>
            ) : null}
          </Card>

          <Card className="grid gap-5 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
              <Scissors className="size-5 text-primary" />
              Service selection
            </h2>
            <Field
              id="serviceId"
              label="Select service"
              required
              error={fieldErrors.serviceId?.[0]}
            >
              <Select
                id="serviceId"
                value={input.serviceId}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    serviceId: Number(event.target.value),
                  }))
                }
              >
                <option value={0}>Choose a service</option>
                {services.data?.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName} · {service.durationMinutes} min ·{" "}
                    {formatPrice(service.price)}
                  </option>
                ))}
              </Select>
            </Field>
          </Card>

          <Card className="grid gap-5 p-5 sm:p-7">
            <h2 className="font-heading text-xl font-semibold">
              Additional notes
            </h2>
            <Field
              id="notes"
              label="Notes (optional)"
              error={fieldErrors.notes?.[0]}
            >
              <Textarea
                id="notes"
                placeholder="Add customer preferences or appointment instructions…"
                maxLength={2000}
                value={input.notes ?? ""}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    notes: event.target.value,
                  }))
                }
              />
            </Field>
          </Card>
        </div>

        <Card className="grid h-fit gap-5 p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
            <CalendarDays className="size-5 text-primary" />
            Schedule & status
          </h2>
          <Field
            id="appointmentDate"
            label="Appointment date"
            required
            error={fieldErrors.appointmentDate?.[0]}
          >
            <Input
              id="appointmentDate"
              type="date"
              value={input.appointmentDate}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  appointmentDate: event.target.value,
                }))
              }
            />
          </Field>
          <Field
            id="appointmentTime"
            label="Start time"
            required
            error={fieldErrors.appointmentTime?.[0]}
          >
            <Input
              id="appointmentTime"
              type="time"
              value={input.appointmentTime}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  appointmentTime: event.target.value,
                }))
              }
            />
          </Field>
          {editing ? (
            <Field
              id="status"
              label="Status"
              required
              error={fieldErrors.status?.[0]}
            >
              <Select
                id="status"
                value={input.status}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    status: event.target.value as AppointmentStatus,
                  }))
                }
              >
                {appointmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase">Starting status</p>
              <div className="flex min-h-11 items-center rounded-md border bg-muted/50 px-3">
                <StatusBadge status="Scheduled" />
              </div>
            </div>
          )}

          <div className="rounded-xl bg-muted/60 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Service summary
            </p>
            {selectedService ? (
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="font-semibold">{selectedService.serviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.durationMinutes} minutes
                  </p>
                </div>
                <p className="text-xl font-semibold text-primary">
                  {formatPrice(selectedService.price)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Select a service to review its price and duration.
              </p>
            )}
          </div>
          <div className="grid gap-3 border-t pt-5 sm:grid-cols-2">
            <Button
              render={<Link to="/appointments" />}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                mutation.isPending ||
                customers.data?.length === 0 ||
                services.data?.length === 0
              }
            >
              <CheckCircle2 />
              {mutation.isPending ? "Saving…" : "Save appointment"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
