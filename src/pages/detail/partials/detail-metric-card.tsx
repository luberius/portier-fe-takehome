import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type DetailMetricCardProps = {
  label: string
  value: ReactNode
  size?: "small" | "default"
}

export function DetailMetricCard({
  label,
  value,
  size = "default",
}: DetailMetricCardProps) {
  return (
    <Card className="ring-1 ring-border">
      <CardHeader>
        <CardTitle className="font-mono text-[11px] font-normal tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            size == "default" && "text-3xl tracking-[-0.04em]",
            size == "small" && "text-lg",
            "font-medium text-foreground"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
