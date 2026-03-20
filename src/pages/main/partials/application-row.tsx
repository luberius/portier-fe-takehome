import { StatusBadge } from "@/components/diff/status-badge"
import { VersionTag } from "@/components/version-tag"
import { formatDateTime } from "@/lib/utils"
import type { Application } from "@/types"
import { Link } from "react-router"

type ApplicationRowProps = {
  application: Application
}

export function ApplicationRow({ application }: ApplicationRowProps) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="grid grid-cols-[1.5fr_0.8fr_1fr_0.7fr] gap-3 border-t border-border px-5 py-4 text-sm transition-colors hover:bg-foreground/2"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {application.name}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {application.id}
        </p>
      </div>
      <div>
        <StatusBadge kind="sync" value={application.status} className="capitalize" />
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        {formatDateTime(application.lastSyncedAt)}
      </p>
      <div>
        <VersionTag version={application.version} />
      </div>
    </Link>
  )
}
