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
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateService,
  useService,
  useUpdateService,
} from "@/services/api/services/services.queries"
import type { ServiceInput } from "@/types/service"
import {
  getErrorMessage,
  getFieldErrors,
} from "@/utils/api-error"

const emptyInput: ServiceInput = {
  serviceName: "",
  description: null,
  price: 0,
  durationMinutes: 30,
}

export function Component() {
  const params = useParams()
  const navigate = useNavigate()
  const serviceId = Number(params.id)
  const editing = Number.isInteger(serviceId) && serviceId > 0
  const service = useService(serviceId)
  const createService = useCreateService()
  const updateService = useUpdateService()
  const [draft, setDraft] = useState<ServiceInput | null>(null)
  const [clientError, setClientError] = useState("")
  const mutation = editing ? updateService : createService
  const input =
    draft ??
    (service.data
      ? {
        serviceName: service.data.serviceName,
        description: service.data.description,
        price: service.data.price,
        durationMinutes: service.data.durationMinutes,
        }
      : emptyInput)

  const fieldErrors = getFieldErrors(mutation.error)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClientError("")

    if (input.serviceName.trim().length < 2) {
      setClientError("Enter a service name with at least two characters.")
      return
    }

    if (!Number.isFinite(input.price) || input.price < 0) {
      setClientError("Enter a valid non-negative price.")
      return
    }

    if (!Number.isInteger(input.durationMinutes) || input.durationMinutes <= 0) {
      setClientError("Enter a positive duration in minutes.")
      return
    }

    const normalizedInput: ServiceInput = {
      ...input,
      serviceName: input.serviceName.trim(),
      description: input.description?.trim() || null,
    }
    const onSuccess = () =>
      navigate("/services", {
        replace: true,
        state: {
          notice: editing
            ? "Service updated successfully."
            : "Service created successfully.",
        },
      })

    if (editing) {
      updateService.mutate(
        { serviceId, input: normalizedInput },
        { onSuccess }
      )
      return
    }

    createService.mutate(normalizedInput, { onSuccess })
  }

  if (editing && service.isPending) {
    return <PageLoading label="Loading service" />
  }

  if (editing && service.isError) {
    return (
      <ErrorState
        message={getErrorMessage(service.error)}
        onRetry={() => service.refetch()}
      />
    )
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title={editing ? "Edit service" : "New service"}
        description="Set the name, customer-facing description, price, and appointment duration."
      />
      <Card className="mx-auto w-full max-w-2xl p-5 sm:p-8">
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          {clientError || mutation.error ? (
            <InlineNotice tone="error">
              {clientError ||
                getErrorMessage(
                  mutation.error,
                  "We couldn't save this service."
                )}
            </InlineNotice>
          ) : null}
          <Field
            id="serviceName"
            label="Service name"
            required
            error={fieldErrors.serviceName?.[0]}
          >
            <Input
              id="serviceName"
              placeholder="Standard Haircut"
              value={input.serviceName}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  serviceName: event.target.value,
                }))
              }
            />
          </Field>
          <Field
            id="description"
            label="Description (optional)"
            error={fieldErrors.description?.[0]}
          >
            <Textarea
              id="description"
              placeholder="Describe what the service includes."
              maxLength={255}
              value={input.description ?? ""}
              disabled={mutation.isPending}
              onChange={(event) =>
                setDraft((current) => ({
                  ...(current ?? input),
                  description: event.target.value,
                }))
              }
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="price"
              label="Price (GHS)"
              required
              error={fieldErrors.price?.[0]}
            >
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={input.price}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    price: Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field
              id="durationMinutes"
              label="Duration (minutes)"
              required
              error={fieldErrors.durationMinutes?.[0]}
            >
              <Input
                id="durationMinutes"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={input.durationMinutes}
                disabled={mutation.isPending}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...(current ?? input),
                    durationMinutes: Number(event.target.value),
                  }))
                }
              />
            </Field>
          </div>
          <div className="mt-2 grid gap-3 border-t pt-6 sm:grid-cols-2">
            <Button type="submit" disabled={mutation.isPending}>
              <CheckCircle2 aria-hidden="true" />
              {mutation.isPending ? "Saving…" : "Save service"}
            </Button>
            <Button
              render={<Link to="/services" />}
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
