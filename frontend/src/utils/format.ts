const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
})

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
})

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

export function formatLongDate(value: Date = new Date()): string {
  return longDateFormatter.format(value)
}

export function formatTime(value: string): string {
  return timeFormatter.format(new Date(`2000-01-01T${value}`))
}

export function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
