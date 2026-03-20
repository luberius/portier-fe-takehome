import { CheckIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ConflictChoicePanelProps = {
  title: string
  value: string | null
  selected: boolean
  tone: "local" | "external"
  onSelect: () => void
}

const toneClassNames = {
  local: {
    container:
      "border-sky-200 bg-sky-50/60 dark:border-sky-400/20 dark:bg-sky-400/10",
    button:
      "border-sky-300 bg-sky-600 text-white hover:bg-sky-700 dark:border-sky-400 dark:bg-sky-500 dark:hover:bg-sky-400",
  },
  external: {
    container:
      "border-violet-200 bg-violet-50/60 dark:border-violet-400/20 dark:bg-violet-400/10",
    button:
      "border-violet-300 bg-violet-600 text-white hover:bg-violet-700 dark:border-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400",
  },
} as const

export function ConflictChoicePanel({
  title,
  value,
  selected,
  tone,
  onSelect,
}: ConflictChoicePanelProps) {
  return (
    <div
      className={cn(
        "grid gap-3 border px-4 py-4 transition-colors",
        selected
          ? toneClassNames[tone].container
          : "border-border bg-background"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          className={cn(selected && toneClassNames[tone].button)}
          onClick={onSelect}
        >
          {selected && <CheckIcon />}
          {selected ? "Selected" : "Use This"}
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground">
        {value ?? "null"}
      </div>
    </div>
  )
}
