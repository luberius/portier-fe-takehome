import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type PageErrorProps = {
  message: string
  onRetry: () => void
}

export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <ArrowClockwiseIcon />
        Retry
      </Button>
    </div>
  )
}
