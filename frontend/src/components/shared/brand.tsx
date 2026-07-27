import logoIcon from "@/assets/logo-1.png"
import { cn } from "@/lib/utils"

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoIcon}
        alt=""
        aria-hidden="true"
        className={cn("object-contain", compact ? "size-10" : "size-12")}
      />
      <div className={compact ? "hidden sm:block" : undefined}>
        <div className="font-heading text-2xl font-bold tracking-tight text-primary">
          TrimTrack
        </div>
        <div className="text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Barber management
        </div>
      </div>
    </div>
  )
}
