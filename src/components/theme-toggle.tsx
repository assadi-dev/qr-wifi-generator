import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
      }
      className="size-11 text-muted-foreground hover:text-foreground"
    >
      <HugeiconsIcon icon={Moon02Icon} className="size-5 dark:hidden" />
      <HugeiconsIcon icon={Sun01Icon} className="hidden size-5 dark:block" />
    </Button>
  )
}
