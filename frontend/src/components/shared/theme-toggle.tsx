import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${theme}. Switch to ${nextTheme}.`}
      title={`Theme: ${theme}`}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}
