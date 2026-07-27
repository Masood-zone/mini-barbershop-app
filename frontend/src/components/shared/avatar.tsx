import { cn } from "@/lib/utils"
import { initials } from "@/utils/format"

export function Avatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary",
        className
      )}
    >
      {initials(name)}
    </span>
  )
}
