import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HistoryItem } from "@/types"
import { ChangeRow } from "./change-row"
import { ResolutionRow } from "./resolution-row"

type ChangeGroupCardProps = {
  entityLabel: string
  entityType: HistoryItem["entityType"]
  items: HistoryItem[]
  selectedIds?: Set<string>
  onToggleSelect?: (itemId: string) => void
}

export function ChangeGroupCard({
  entityLabel,
  entityType,
  items,
  selectedIds,
  onToggleSelect,
}: ChangeGroupCardProps) {
  const pendingCount = items.filter(
    (item) => item.review.status === "pending"
  ).length
  const entityLabelText =
    entityType.charAt(0).toUpperCase() + entityType.slice(1)

  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="border-b border-border py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm">{entityLabel}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {entityLabelText}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{items.length} fields</Badge>
            {pendingCount > 0 && (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0">
        {items.map((item) =>
          item.review.status === "resolved" ? (
            <ResolutionRow key={item.id} item={item} />
          ) : (
            <ChangeRow
              key={item.id}
              item={item}
              selected={selectedIds?.has(item.id)}
              onToggleSelect={onToggleSelect}
            />
          )
        )}
      </CardContent>
    </Card>
  )
}
