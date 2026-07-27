import { Eye } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar } from "@/components/shared/avatar"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import type { Appointment } from "@/types/appointment"
import { formatDate, formatTime } from "@/utils/format"

export function AppointmentRow({
  appointment,
  showDate = true,
}: {
  appointment: Appointment
  showDate?: boolean
}) {
  return (
    <article className="grid gap-4 border-t p-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(8rem,0.8fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={appointment.customer.fullName} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{appointment.customer.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {appointment.customer.phoneNumber}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">{appointment.service.serviceName}</p>
        <p className="text-xs text-muted-foreground">
          {appointment.service.durationMinutes} min
        </p>
      </div>
      <div>
        {showDate ? (
          <p className="text-sm font-medium">
            {formatDate(appointment.appointmentDate)}
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          {formatTime(appointment.appointmentTime)}
        </p>
        <StatusBadge status={appointment.status} className="mt-2 sm:hidden" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={appointment.status} className="hidden sm:flex" />
        <Button
          render={<Link to={`/appointments/${appointment.appointmentId}`} />}
          variant="ghost"
          size="icon"
          aria-label={`View ${appointment.customer.fullName}'s appointment`}
        >
          <Eye />
        </Button>
      </div>
    </article>
  )
}
