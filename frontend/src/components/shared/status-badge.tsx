import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AppointmentStatus } from "@/types/appointment"

const statusClasses: Record<AppointmentStatus, string> = {
  Scheduled: "bg-status-scheduled text-status-scheduled-foreground",
  "In Progress": "bg-status-progress text-status-progress-foreground",
  Completed: "bg-status-completed text-status-completed-foreground",
  Cancelled: "bg-status-cancelled text-status-cancelled-foreground",
}

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
        className
      )}
    >
      <Circle aria-hidden="true" className="size-1.5 fill-current" />
      {status}
    </span>
  )
}
