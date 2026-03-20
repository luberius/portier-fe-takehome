import {
  ArrowLeftIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { ChangeGroupCard } from "@/components/diff/change-group-card"
import { PageError } from "@/components/page-error"
import { VersionTag } from "@/components/version-tag"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { commitApprovedSyncPreview } from "@/lib/persisted-state"
import { useSimulate } from "@/lib/use-simulate"
import { Link, useNavigate, useParams } from "react-router"
import { getSyncPreview } from "./actions/data"
import { getSyncPreviewErrorMessage } from "./actions/util"
import { ApproveSyncDialog } from "./partials/approve-sync-dialog"
import { SyncSummaryCard } from "./partials/sync-summary-card"
import { SyncPageSkeleton } from "./partials/skeletons/sync-page-skeleton"

function SyncPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [loadPreview, loading, preview, error] = useSimulate(getSyncPreview)
  const [approvePreview, approving] = useSimulate(commitApprovedSyncPreview)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const pageTitle = preview?.applicationName

  useEffect(() => {
    if (!applicationId) {
      navigate("/")
      return
    }

    loadPreview(applicationId)
  }, [applicationId, loadPreview, navigate])

  useEffect(() => {
    if (!preview) {
      return
    }

    setSelectedIds(
      new Set(
        preview.groups.flatMap((group) =>
          group.items
            .filter((item) => !item.review.required)
            .map((item) => item.id)
        )
      )
    )
  }, [preview])

  const totalChanges = preview?.summary.totalChanges ?? 0
  const selectedCount = selectedIds.size
  const hasSelection = selectedCount > 0
  const selectedManualReviewCount =
    preview?.groups
      .flatMap((group) => group.items)
      .filter((item) => {
        return item.review.required && selectedIds.has(item.id)
      }).length ?? 0
  const uncheckedManualReviewItems =
    preview?.groups
      .flatMap((group) => group.items)
      .filter((item) => {
        return item.review.required && !selectedIds.has(item.id)
      }) ?? []

  function handleToggleSelect(itemId: string) {
    setSelectedIds((current) => {
      const selections = new Set(current)

      if (selections.has(itemId)) {
        selections.delete(itemId)
      } else {
        selections.add(itemId)
      }

      return selections
    })
  }

  function handleSelectAll() {
    if (!preview) {
      return
    }

    setSelectedIds(
      new Set(
        preview.groups.flatMap((group) => group.items.map((item) => item.id))
      )
    )
  }

  function handleDeselectAll() {
    setSelectedIds(new Set())
  }

  async function handleApprove() {
    if (!applicationId || !preview || !hasSelection) {
      return
    }

    const result = await approvePreview(applicationId, preview, selectedIds)

    if (!result) {
      return
    }

    navigate(`/applications/${applicationId}`, {
      state: {
        syncApproved: {
          selectedCount: result.selectedCount,
          applicationName: result.applicationName,
        },
      },
    })
  }

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="border-b border-border pb-6">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to={`/applications/${applicationId}`} />}
            nativeButton={false}
          >
            <ArrowLeftIcon />
            Back to integration
          </Button>
          <div className="mt-4">
            <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              {applicationId ?? "application"}
            </p>
            {loading && !preview ? (
              <Skeleton className="mt-3 h-12 w-80 rounded-2xl sm:h-14 sm:w-120" />
            ) : (
              <h1 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                {pageTitle ?? "Application"} review sync changes
              </h1>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Review and approve changes before they are applied to your system.
            </p>
          </div>
        </header>

        {loading && !preview ? (
          <SyncPageSkeleton />
        ) : !preview || !applicationId ? (
          <PageError
            message={getSyncPreviewErrorMessage(error?.status, error?.message)}
            onRetry={() => {
              if (applicationId) {
                loadPreview(applicationId)
              }
            }}
          />
        ) : (
          <>
            <Alert variant="info">
              <WarningCircleIcon />
              <AlertTitle>Approval required</AlertTitle>
              <AlertDescription>
                This sync will update your integration from{" "}
                <VersionTag
                  version={preview.currentVersion}
                  className="mx-1 align-middle"
                />{" "}
                to{" "}
                <VersionTag
                  version={preview.nextVersion}
                  className="mx-1 align-middle"
                />
                . Review all changes before approving.
              </AlertDescription>
            </Alert>

            <section className="grid gap-3 sm:grid-cols-4">
              <SyncSummaryCard label="Added" value={preview.summary.added} />
              <SyncSummaryCard
                label="Updated"
                value={preview.summary.updated}
              />
              <SyncSummaryCard
                label="Deleted"
                value={preview.summary.deleted}
              />
              <SyncSummaryCard
                label="Est. duration"
                value={`${preview.summary.estimatedDurationSeconds}s`}
              />
            </section>

            <Card className="ring-1 ring-border">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSelectAll}>
                    Select all
                  </Button>
                  <Button variant="outline" onClick={handleDeselectAll}>
                    Deselect all
                  </Button>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {selectedCount} of {totalChanges} changes selected
                </p>
              </CardContent>
            </Card>

            <section className="grid gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  Detailed changes
                </p>
                <h2 className="mt-2 text-xl font-medium text-foreground">
                  Review set
                </h2>
              </div>

              {preview.groups.map((group) => (
                <ChangeGroupCard
                  key={`${group.entityType}:${group.entityId}`}
                  entityLabel={group.entityLabel}
                  entityType={group.entityType}
                  items={group.items}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                />
              ))}

              {!hasSelection && (
                <Card className="ring-1 ring-border">
                  <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
                    <XCircleIcon className="text-muted-foreground" />
                    No changes selected. Select at least one change to approve.
                  </CardContent>
                </Card>
              )}
            </section>

            <footer className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                size="lg"
                render={<Link to={`/applications/${applicationId}`} />}
                nativeButton={false}
              >
                <XCircleIcon />
                Cancel sync
              </Button>
              <Button
                size="lg"
                onClick={() => setShowApproveDialog(true)}
                disabled={!hasSelection || approving}
              >
                <CheckCircleIcon />
                {approving
                  ? "Approving..."
                  : `Approve ${selectedCount} change${selectedCount === 1 ? "" : "s"}`}
              </Button>
            </footer>

            <ApproveSyncDialog
              open={showApproveDialog}
              onOpenChange={setShowApproveDialog}
              approving={approving}
              hasSelection={hasSelection}
              selectedCount={selectedCount}
              applicationName={preview.applicationName}
              nextVersion={preview.nextVersion}
              selectedManualReviewCount={selectedManualReviewCount}
              uncheckedManualReviewItems={uncheckedManualReviewItems}
              onApprove={async () => {
                await handleApprove()
                setShowApproveDialog(false)
              }}
            />
          </>
        )}
      </section>
    </main>
  )
}

export default SyncPage
