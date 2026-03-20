import { Button } from "@/components/ui/button"

type ConflictFooterProps = {
  totalCount: number
  resolvedCount: number
  merging: boolean
  onCancel: () => void
  onMerge: () => void
}

export function ConflictFooter({
  totalCount,
  resolvedCount,
  merging,
  onCancel,
  onMerge,
}: ConflictFooterProps) {
  const isComplete = totalCount > 0 && resolvedCount === totalCount

  return (
    <footer className="sticky bottom-4 mt-2 flex flex-col gap-3 rounded-3xl border border-border bg-background/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {isComplete
          ? "All conflicting fields are selected and ready to merge."
          : "Please select a version for all conflicting fields before merging."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} disabled={merging}>
          Cancel
        </Button>
        <Button onClick={onMerge} disabled={!isComplete || merging}>
          {merging
            ? "Merging..."
            : `Merge Changes (${resolvedCount}/${totalCount})`}
        </Button>
      </div>
    </footer>
  )
}
