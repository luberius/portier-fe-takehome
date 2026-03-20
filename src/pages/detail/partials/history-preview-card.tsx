import { StatusBadge } from "@/components/diff/status-badge"
import { VersionTag } from "@/components/version-tag"
import { formatHistoryMetrics } from "@/lib/history"
import { formatDateTime } from "@/lib/utils"
import type { HistoryEntry } from "@/types"
import { Link } from "react-router"

type HistoryPreviewCardProps = {
  applicationId: string
  entry: HistoryEntry
}

export function HistoryPreviewCard({
  applicationId,
  entry,
}: HistoryPreviewCardProps) {
  return (
    <Link
      to={`/applications/${applicationId}/history/${entry.id}`}
      className="grid gap-2 border border-border p-4 transition-colors hover:bg-foreground/[0.02]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground">{formatHistoryMetrics(entry)}</p>
        <StatusBadge kind="sync" value={entry.status} className="capitalize" />
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{formatDateTime(entry.timestamp)}</span>
        <VersionTag version={entry.version} />
      </div>
    </Link>
  )
}
