import {
  ArrowsClockwiseIcon,
  ArrowUpRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { useEffect } from "react"
import { PageError } from "@/components/page-error"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useSimulate } from "@/lib/use-simulate"
import { formatDateTime } from "@/lib/utils"
import type { EntityType } from "@/types"
import { useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router"
import {
  getApplicationDetail,
  getLatestConflictEntry,
} from "./actions/data"
import { DetailHistorySkeleton } from "./partials/skeletons/detail-history-skeleton"
import { DetailLocalStateSkeleton } from "./partials/skeletons/detail-local-state-skeleton"
import { DetailMetricsSkeleton } from "./partials/skeletons/detail-metrics-skeleton"
import { DetailMetricCard } from "./partials/detail-metric-card"
import { HistoryPreviewCard } from "./partials/history-preview-card"

const entityLabels: Record<EntityType, string> = {
  user: "Users",
  door: "Doors",
  key: "Keys",
}

function DetailPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [showSyncWarning, setShowSyncWarning] = useState(false)
  const [loadDetail, loading, detailResponse, error] = useSimulate(
    getApplicationDetail
  )

  useEffect(() => {
    if (!applicationId) {
      navigate("/")
      return
    }

    loadDetail(applicationId)
  }, [applicationId, loadDetail, navigate])

  const detail = detailResponse?.detail
  const pageTitle = detailResponse?.applicationName

  const latestConflictEntry = detail
    ? getLatestConflictEntry(detail.history)
    : undefined
  const recordSummary = [
    { label: entityLabels.user, count: detail?.localState.users.length ?? 0 },
    { label: entityLabels.door, count: detail?.localState.doors.length ?? 0 },
    { label: entityLabels.key, count: detail?.localState.keys.length ?? 0 },
  ]
  const syncApproved = location.state as
    | {
        syncApproved?: { applicationName: string; selectedCount: number }
        conflictResolved?: { applicationName: string; resolvedCount: number }
      }
    | undefined

  function handleStartSync() {
    if (!applicationId) {
      return
    }

    navigate(`/applications/${applicationId}/sync`)
  }

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="border-b border-border pb-6">
          <Button variant="ghost" size="sm" render={<Link to="/" />} nativeButton={false}>
            <ArrowLeftIcon />
            Back to applications
          </Button>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                {applicationId ?? "application"}
              </p>
              {loading && !detailResponse ? (
                <Skeleton className="mt-3 h-12 w-64 rounded-2xl sm:h-14 sm:w-80" />
              ) : (
                <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                  {pageTitle ?? "Application"}
                </h1>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="lg"
                disabled={!applicationId}
                onClick={() => {
                  if (latestConflictEntry) {
                    setShowSyncWarning(true)
                    return
                  }

                  handleStartSync()
                }}
              >
                <ArrowsClockwiseIcon />
                Sync now
              </Button>
              {latestConflictEntry && (
                <Button
                  size="lg"
                  render={
                    <Link to={`/applications/${applicationId}/conflict-resolver`} />
                  }
                >
                  <ArrowUpRightIcon />
                  Resolve conflicts
                </Button>
              )}
            </div>
          </div>
        </header>

        {loading && !detail ? (
          <>
            <section className="grid gap-3 sm:grid-cols-4">
              <DetailMetricsSkeleton />
            </section>
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <DetailLocalStateSkeleton />
              <DetailHistorySkeleton />
            </section>
          </>
        ) : !detail || !applicationId ? (
          <PageError
            message={error?.message ?? "Unknown application."}
            onRetry={() => {
              if (applicationId) {
                loadDetail(applicationId)
              }
            }}
          />
        ) : (
          <>
            {syncApproved?.syncApproved && (
              <Alert variant="success">
                <CheckCircleIcon />
                <AlertTitle>Sync approval recorded</AlertTitle>
                <AlertDescription>
                  Approved {syncApproved.syncApproved.selectedCount} change
                  {syncApproved.syncApproved.selectedCount === 1 ? "" : "s"} for{" "}
                  {syncApproved.syncApproved.applicationName}.
                </AlertDescription>
              </Alert>
            )}

            {syncApproved?.conflictResolved && (
              <Alert variant="success">
                <CheckCircleIcon />
                <AlertTitle>Conflict resolution recorded</AlertTitle>
                <AlertDescription>
                  Resolved {syncApproved.conflictResolved.resolvedCount} conflict
                  field{syncApproved.conflictResolved.resolvedCount === 1 ? "" : "s"} for{" "}
                  {syncApproved.conflictResolved.applicationName}.
                </AlertDescription>
              </Alert>
            )}

            {latestConflictEntry && (
              <Alert variant="warning">
                <WarningCircleIcon />
                <AlertTitle>Conflict detected</AlertTitle>
                <AlertDescription>
                  This integration has conflicting data that requires your attention.{" "}
                  <Link
                    to={`/applications/${applicationId}/conflict-resolver`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-3 hover:text-amber-900 dark:hover:text-amber-100"
                  >
                    Resolve conflicts
                    <ArrowUpRightIcon />
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <section className="grid gap-3 sm:grid-cols-4">
              <DetailMetricCard
                label="Total records"
                value={detail.totalRecords}
              />
              <DetailMetricCard
                label="Last sync duration"
                value={`${detail.lastSyncDurationSeconds}s`}
              />
              <DetailMetricCard
                label="Last synced"
                value={formatDateTime(detail.lastSyncedAt)}
                size="small"
              />
              <DetailMetricCard label="Version" value={detail.currentVersion} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="ring-1 ring-border">
                <CardHeader className="border-b border-border">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      Local state
                    </p>
                    <CardTitle className="mt-2 text-lg">
                      Current records
                    </CardTitle>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    mocked source of truth
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3 pt-5">
                  {recordSummary.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-dashed border-border pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-foreground">
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.count.toString().padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="ring-1 ring-border">
                <CardHeader className="border-b border-border">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                      History
                    </p>
                    <CardTitle className="mt-2 text-lg">
                      Recent sync events
                    </CardTitle>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {Math.min(detail.history.length, 3)
                      .toString()
                      .padStart(2, "0")}{" "}
                    preview entries
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3 pt-5">
                  {detail.history.slice(0, 3).map((entry) => (
                    <HistoryPreviewCard
                      key={entry.id}
                      applicationId={applicationId}
                      entry={entry}
                    />
                  ))}
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link to={`/applications/${applicationId}/history`} />
                      }
                    >
                      <ClockCounterClockwiseIcon />
                      Show history
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </section>

      <Dialog open={showSyncWarning} onOpenChange={setShowSyncWarning}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Sync now will replace the current conflict state</DialogTitle>
            <DialogDescription>
              This integration still has unresolved conflict history. Starting a
              new sync will move you into a fresh API preview and can replace the
              current state you were reviewing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSyncWarning(false)}>
              Keep current state
            </Button>
            <Button
              onClick={() => {
                setShowSyncWarning(false)
                handleStartSync()
              }}
            >
              Continue sync
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default DetailPage
