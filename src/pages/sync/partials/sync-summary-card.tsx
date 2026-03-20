import { Card, CardContent } from "@/components/ui/card"

type SyncSummaryCardProps = {
  label: string
  value: number | string
}

export function SyncSummaryCard({ label, value }: SyncSummaryCardProps) {
  return (
    <Card className="py-3 ring-1 ring-border">
      <CardContent className="px-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-2 text-2xl font-medium text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
