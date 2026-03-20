import { TagIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type VersionTagProps = {
  version: string
  className?: string
}

export function VersionTag({ version, className }: VersionTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-foreground",
        className
      )}
    >
      <TagIcon size={12} weight="bold" />
      <span>{version}</span>
    </span>
  )
}
