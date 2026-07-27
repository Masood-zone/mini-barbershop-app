import { AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function InlineNotice({
  tone,
  children,
}: {
  tone: "success" | "error"
  children: React.ReactNode
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        tone === "success"
          ? "border-primary/20 bg-primary/8 text-primary"
          : "border-destructive/25 bg-destructive/8 text-destructive"
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
