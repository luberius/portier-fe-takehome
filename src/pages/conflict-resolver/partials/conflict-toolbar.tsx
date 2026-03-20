import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type ConflictToolbarProps = {
  onAcceptAllLocal: () => void
  onAcceptAllExternal: () => void
  onViewHistory: () => void
}

export function ConflictToolbar({
  onAcceptAllLocal,
  onAcceptAllExternal,
  onViewHistory,
}: ConflictToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onAcceptAllLocal}>
          Accept all local
        </Button>
        <Button variant="outline" onClick={onAcceptAllExternal}>
          Accept all external
        </Button>
      </div>
      <Button variant="outline" onClick={onViewHistory}>
        <ClockCounterClockwiseIcon />
        View version history
      </Button>
    </div>
  )
}
