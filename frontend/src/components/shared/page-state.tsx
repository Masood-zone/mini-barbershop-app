import { AlertCircle, Inbox, LoaderCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      role="status"
      aria-label={label}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-xl border bg-muted/70"
        />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Inbox aria-hidden="true" className="size-6" />
      </span>
      <div>
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </Card>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Card
      className="flex min-h-48 flex-col items-center justify-center gap-3 border-destructive/30 p-8 text-center"
      role="alert"
    >
      <AlertCircle aria-hidden="true" className="size-8 text-destructive" />
      <div>
        <h2 className="font-heading text-xl font-semibold">
          We couldn&apos;t load this page
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </Card>
  )
}

export function InlineLoading({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      {label}
    </span>
  )
}
