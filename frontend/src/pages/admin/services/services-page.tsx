import { useState } from "react"
import { Clock3, Pencil, Plus, Scissors, Trash2, WalletCards } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState, ErrorState, PageLoading } from "@/components/shared/page-state"
import { InlineNotice } from "@/components/shared/inline-notice"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  useDeleteService,
  useServices,
} from "@/services/api/services/services.queries"
import type { Service } from "@/types/service"
import { getErrorMessage } from "@/utils/api-error"
import { formatPrice } from "@/utils/format"

export function Component() {
  const location = useLocation()
  const services = useServices()
  const deleteService = useDeleteService()
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [localNotice, setLocalNotice] = useState("")
  const routeNotice = (location.state as { notice?: string } | null)?.notice

  const totalDuration =
    services.data?.reduce(
      (total, service) => total + service.durationMinutes,
      0
    ) ?? 0
  const averagePrice =
    services.data && services.data.length > 0
      ? services.data.reduce((total, service) => total + service.price, 0) /
        services.data.length
      : 0

  const handleDelete = () => {
    if (!serviceToDelete) {
      return
    }

    deleteService.mutate(serviceToDelete.serviceId, {
      onSuccess: () => {
        setLocalNotice(`${serviceToDelete.serviceName} was deleted.`)
        setServiceToDelete(null)
      },
    })
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title="Services"
        description="Manage your shop's offerings, prices, and appointment durations."
        action={
          <Button render={<Link to="/services/new" />}>
            <Plus aria-hidden="true" />
            Add service
          </Button>
        }
      />
      {routeNotice || localNotice ? (
        <InlineNotice tone="success">
          {localNotice || routeNotice}
        </InlineNotice>
      ) : null}
      {deleteService.error ? (
        <InlineNotice tone="error">
          {getErrorMessage(deleteService.error)}
        </InlineNotice>
      ) : null}

      {services.isPending ? <PageLoading label="Loading services" /> : null}
      {services.isError ? (
        <ErrorState
          message={getErrorMessage(services.error)}
          onRetry={() => services.refetch()}
        />
      ) : null}
      {services.data ? (
        <>
          <section
            aria-label="Service summary"
            className="grid gap-4 sm:grid-cols-3"
          >
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Scissors />
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Total services
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {services.data.length}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <WalletCards />
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Average price
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatPrice(averagePrice)}
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock3 />
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Total duration
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {totalDuration} min
                </p>
              </div>
            </Card>
          </section>

          {services.data.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Add a service before creating appointments."
              action={
                <Button render={<Link to="/services/new" />}>Add service</Button>
              }
            />
          ) : (
            <section
              aria-label="Services"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {services.data.map((service) => (
                <Card
                  key={service.serviceId}
                  className="flex min-h-64 flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Scissors aria-hidden="true" />
                    </span>
                    <p className="font-heading text-2xl font-semibold text-primary">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                  <h2 className="mt-5 font-heading text-xl font-semibold">
                    {service.serviceName}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {service.description ?? "No description provided."}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock3 aria-hidden="true" className="size-4" />
                      {service.durationMinutes} min
                    </span>
                    <div className="flex gap-1">
                      <Button
                        render={
                          <Link to={`/services/${service.serviceId}/edit`} />
                        }
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${service.serviceName}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        aria-label={`Delete ${service.serviceName}`}
                        onClick={() => {
                          setLocalNotice("")
                          deleteService.reset()
                          setServiceToDelete(service)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </section>
          )}
        </>
      ) : null}

      <ConfirmDialog
        open={serviceToDelete !== null}
        title="Delete service?"
        description={`This permanently deletes ${serviceToDelete?.serviceName ?? "this service"}. Services referenced by appointments cannot be deleted.`}
        confirmLabel="Delete service"
        busy={deleteService.isPending}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleteService.isPending) {
            setServiceToDelete(null)
          }
        }}
      />
    </div>
  )
}
