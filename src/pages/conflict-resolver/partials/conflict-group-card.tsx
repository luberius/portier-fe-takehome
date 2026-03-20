import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReviewDecision, HistoryItem } from "@/types"
import { ConflictFieldCard } from "./conflict-field-card"

type ConflictGroupCardProps = {
  entityLabel: string
  entityType: HistoryItem["entityType"]
  items: HistoryItem[]
  selections: Record<string, ReviewDecision>
  onSelect: (itemId: string, decision: Exclude<ReviewDecision, null>) => void
}

export function ConflictGroupCard({
  entityLabel,
  entityType,
  items,
  selections,
  onSelect,
}: ConflictGroupCardProps) {
  const resolvedCount = items.filter((item) => selections[item.id] !== null).length
  const entityLabelText =
    entityType.charAt(0).toUpperCase() + entityType.slice(1)

  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="border-b border-border py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-lg">{entityLabel}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{entityLabelText}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{items.length} fields</Badge>
            <Badge variant="outline">{resolvedCount}/{items.length} selected</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 pt-5">
        {items.map((item) => (
          <ConflictFieldCard
            key={item.id}
            item={item}
            selection={selections[item.id] ?? null}
            onSelect={(decision) => onSelect(item.id, decision)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
