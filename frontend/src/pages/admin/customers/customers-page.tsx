import { useDeferredValue, useState } from "react"
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Avatar } from "@/components/shared/avatar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState, ErrorState, PageLoading } from "@/components/shared/page-state"
import { InlineNotice } from "@/components/shared/inline-notice"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  useCustomers,
  useDeleteCustomer,
} from "@/services/api/customers/customers.queries"
import type { Customer } from "@/types/customer"
import { getErrorMessage } from "@/utils/api-error"
import { formatDate } from "@/utils/format"

export function Component() {
  const location = useLocation()
  const [search, setSearch] = useState("")
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [notice, setNotice] = useState("")
  const deferredSearch = useDeferredValue(search.trim())
  const customers = useCustomers(deferredSearch)
  const deleteCustomer = useDeleteCustomer()
  const routeNotice = (location.state as { notice?: string } | null)?.notice

  const handleDelete = () => {
    if (!customerToDelete) {
      return
    }

    deleteCustomer.mutate(customerToDelete.customerId, {
      onSuccess: () => {
        setNotice(`${customerToDelete.fullName} was deleted.`)
        setCustomerToDelete(null)
      },
    })
  }

  return (
    <div className="grid gap-7">
      <PageHeader
        title="Customers"
        description="Manage customer contact details and appointment history."
        action={
          <Button render={<Link to="/customers/new" />}>
            <Plus aria-hidden="true" />
            Add customer
          </Button>
        }
      />

      {notice || routeNotice ? (
        <InlineNotice tone="success">{notice || routeNotice}</InlineNotice>
      ) : null}
      {deleteCustomer.error ? (
        <InlineNotice tone="error">
          {getErrorMessage(deleteCustomer.error)}
        </InlineNotice>
      ) : null}

      <Card className="p-4">
        <label htmlFor="customer-search" className="sr-only">
          Search customers by name or phone
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="customer-search"
            type="search"
            placeholder="Search customers by name or phone…"
            className="pl-11"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Card>

      {customers.isPending ? <PageLoading label="Loading customers" /> : null}
      {customers.isError ? (
        <ErrorState
          message={getErrorMessage(customers.error)}
          onRetry={() => customers.refetch()}
        />
      ) : null}
      {customers.data?.length === 0 ? (
        <EmptyState
          title={deferredSearch ? "No matching customers" : "No customers yet"}
          description={
            deferredSearch
              ? "Try a different name or phone number."
              : "Add the first customer to start scheduling appointments."
          }
          action={
            deferredSearch ? undefined : (
              <Button render={<Link to="/customers/new" />}>Add customer</Button>
            )
          }
        />
      ) : null}
      {customers.data && customers.data.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_0.6fr_0.7fr_auto] gap-4 bg-muted/50 px-6 py-4 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase md:grid">
            <span>Customer</span>
            <span>Contact</span>
            <span>Gender</span>
            <span>Date added</span>
            <span>Actions</span>
          </div>
          <div className="divide-y">
            {customers.data.map((customer) => (
              <article
                key={customer.customerId}
                className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_0.6fr_0.7fr_auto] md:items-center md:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={customer.fullName} />
                  <div className="min-w-0">
                    <Link
                      to={`/customers/${customer.customerId}`}
                      className="truncate font-semibold hover:text-primary hover:underline"
                    >
                      {customer.fullName}
                    </Link>
                    <p className="text-xs text-muted-foreground md:hidden">
                      Added {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="min-w-0 text-sm">
                  <p>{customer.phoneNumber}</p>
                  <p className="truncate text-muted-foreground">
                    {customer.email ?? "No email address"}
                  </p>
                </div>
                <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                  {customer.gender ?? "Not set"}
                </span>
                <span className="hidden text-sm text-muted-foreground md:block">
                  {formatDate(customer.createdAt)}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    render={<Link to={`/customers/${customer.customerId}`} />}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`View ${customer.fullName}`}
                  >
                    <Eye />
                  </Button>
                  <Button
                    render={
                      <Link to={`/customers/${customer.customerId}/edit`} />
                    }
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${customer.fullName}`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    aria-label={`Delete ${customer.fullName}`}
                    onClick={() => {
                      setNotice("")
                      deleteCustomer.reset()
                      setCustomerToDelete(customer)
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
        open={customerToDelete !== null}
        title="Delete customer?"
        description={`This will permanently delete ${customerToDelete?.fullName ?? "this customer"}. Customers with appointment history cannot be deleted.`}
        confirmLabel="Delete customer"
        busy={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleteCustomer.isPending) {
            setCustomerToDelete(null)
          }
        }}
      />
    </div>
  )
}
