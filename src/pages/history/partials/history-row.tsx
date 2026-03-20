import { formatHistoryMetrics } from "@/lib/history"
import { formatDateTime } from "@/lib/utils"
import { VersionTag } from "@/components/version-tag"
import { StatusBadge } from "@/components/diff/status-badge"
import type { HistoryEntry } from "@/types"
import { Link } from "react-router"

type HistoryRowProps = {
  applicationId: string
  entry: HistoryEntry
}

export function HistoryRow({ applicationId, entry }: HistoryRowProps) {
  return (
    <Link
      to={`/applications/${applicationId}/history/${entry.id}`}
      className="grid grid-cols-[1.2fr_0.7fr_0.5fr_1.2fr] gap-3 border-t border-border px-5 py-4 text-sm transition-colors hover:bg-foreground/[0.02]"
    >
      <div>
        <p className="font-mono text-xs text-foreground">{formatDateTime(entry.timestamp)}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {entry.source}
        </p>
      </div>
      <div>
        <VersionTag version={entry.version} />
      </div>
      <div>
        <StatusBadge kind="sync" value={entry.status} className="capitalize" />
      </div>
      <p className="text-sm text-foreground">{formatHistoryMetrics(entry)}</p>
    </Link>
  )
}
