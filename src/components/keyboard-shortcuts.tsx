import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  )
}

export function KeyboardShortcuts() {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === "d") {
        const nextTheme =
          theme === "dark"
            ? "light"
            : theme === "light"
              ? "dark"
              : getSystemTheme() === "dark"
                ? "light"
                : "dark"

        setTheme(nextTheme)
        return
      }

      if (key === "x") {
        localStorage.clear()
        window.location.reload()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [setTheme, theme])

  return (
    <Card className="fixed top-6 right-6 z-50 hidden w-44 rounded-none bg-background/92 p-2 font-mono backdrop-blur sm:flex">
      <CardContent className="grid gap-1.5 p-0">
        <div className="flex items-center justify-between gap-1 text-xs">
          <span className="text-foreground">Switch theme</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            D
          </kbd>
        </div>
        <div className="flex items-center justify-between gap-1 text-xs">
          <span className="text-foreground">Reset data</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            X
          </kbd>
        </div>
      </CardContent>
    </Card>
  )
}
