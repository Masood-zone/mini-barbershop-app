import type { ReactNode } from "react"

export function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  const descriptionId = error || hint ? `${id}-description` : undefined

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-[0.08em] text-foreground uppercase"
      >
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {error || hint ? (
        <p
          id={descriptionId}
          className={
            error
              ? "text-xs text-destructive"
              : "text-xs text-muted-foreground"
          }
          aria-live={error ? "polite" : undefined}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  )
}
