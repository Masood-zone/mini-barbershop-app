import { type FormEvent, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { ErrorState, PageLoading } from "@/components/shared/page-state"
import { Field } from "@/components/shared/field"
import { InlineNotice } from "@/components/shared/inline-notice"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  useCreateCustomer,
  useCustomer,
  useUpdateCustomer,
} from "@/services/api/customers/customers.queries"
import {
  customerGenders,
  type CustomerGender,
  type CustomerInput,
} from "@/types/customer"
import {
  getErrorMessage,
  getFieldErrors,
} from "@/utils/api-error"

const emptyInput: CustomerInput = {
  fullName: "",
  phoneNumber: "",
  email: null,
  gender: null,
}

export function Component() {
  const params = useParams()
  const navigate = useNavigate()
  const customerId = Number(params.id)
  const editing = Number.isInteger(customerId) && customerId > 0
  const customer = useCustomer(customerId)
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const [draft, setDraft] = useState<CustomerInput | null>(null)
  const [clientError, setClientError] = useState("")
  const mutation = editing ? updateCustomer : createCustomer
  const input =
    draft ??
    (customer.data
      ? {
        fullName: customer.data.fullName,
        phoneNumber: customer.data.phoneNumber,
        email: customer.data.email,
        gender: customer.data.gender,
        }
      : emptyInput)

  const fieldErrors = getFieldErrors(mutation.error)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClientError("")

    if (input.fullName.trim().length < 2) {
      setClientError("Enter a customer name with at least two characters.")
      return
    }

    if (!/^[0-9+() -]{7,20}$/.test(input.phoneNumber.trim())) {
      setClientError("Enter a valid phone number.")
      return
    }

    const normalizedInput: CustomerInput = {
      fullName: input.fullName.trim(),
      phoneNumber: input.phoneNumber.trim(),
      email: input.email?.trim() || null,
      gender: input.gender,
    }

    const onSuccess = (savedCustomer: { customerId: number }) => {
      navigate(`/customers/${savedCustomer.customerId}`, {
        replace: true,
        state: {
          notice: editing
            ? "Customer details updated."
            : "Customer created successfully.",
        },
      })
    }

    if (editing) {
      updateCustomer.mutate(
        { customerId, input: normalizedInput },
        { onSuccess }
      )
      return
    }

    createCustomer.mutate(normalizedInput, { onSuccess })
  }

  if (editing && customer.isPending) {
    return <PageLoading label="Loading customer" />
  }

  if (editing && customer.isError) {
    return (
      <ErrorState
        message={getErrorMessage(customer.error)}
        onRetry={() => customer.refetch()}
      />
    )
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title={editing ? "Edit customer" : "New customer"}
        description={
          editing
            ? "Update this customer's contact information."
            : "Add contact details before scheduling an appointment."
        }
      />
      <Card className="mx-auto w-full max-w-2xl p-5 sm:p-8">
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          {clientError || mutation.error ? (
            <InlineNotice tone="error">
              {clientError ||
                getErrorMessage(
                  mutation.error,
                  "We couldn't save this customer."
                )}
            </InlineNotice>
          ) : null}
          <Field
            id="fullName"
            label="Full name"
            required
            error={fieldErrors.fullName?.[0]}
          >
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="John Doe"
              value={input.fullName}
              aria-invalid={Boolean(fieldErrors.fullName)}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  fullName: event.target.value,
                }))
              }
            />
          </Field>
          <Field
            id="phoneNumber"
            label="Phone number"
            required
            error={fieldErrors.phoneNumber?.[0]}
          >
            <Input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+233 24 000 0000"
              value={input.phoneNumber}
              aria-invalid={Boolean(fieldErrors.phoneNumber)}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  phoneNumber: event.target.value,
                }))
              }
            />
          </Field>
          <Field
            id="email"
            label="Email address (optional)"
            error={fieldErrors.email?.[0]}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={input.email ?? ""}
              aria-invalid={Boolean(fieldErrors.email)}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  email: event.target.value,
                }))
              }
            />
          </Field>
          <Field
            id="gender"
            label="Gender (optional)"
            error={fieldErrors.gender?.[0]}
          >
            <Select
              id="gender"
              value={input.gender ?? ""}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  gender: (event.target.value || null) as CustomerGender | null,
                }))
              }
            >
              <option value="">Not specified</option>
              {customerGenders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </Select>
          </Field>
          <div className="mt-2 grid gap-3 border-t pt-6 sm:grid-cols-2">
            <Button type="submit" disabled={mutation.isPending}>
              <CheckCircle2 aria-hidden="true" />
              {mutation.isPending
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : "Save customer"}
            </Button>
            <Button
              render={
                <Link
                  to={editing ? `/customers/${customerId}` : "/customers"}
                />
              }
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
