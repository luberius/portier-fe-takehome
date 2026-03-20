import {
  ArrowLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { PageError } from "@/components/page-error"
import { VersionTag } from "@/components/version-tag"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { commitResolvedConflictEntry } from "@/lib/persisted-state"
import { useSimulate } from "@/lib/use-simulate"
import type { ReviewDecision } from "@/types"
import { Link, useNavigate, useParams } from "react-router"
import {
  createBulkSelections,
  createInitialSelections,
  getConflictResolverDetail,
  getSelectionSummary,
} from "./actions/data"
import { ConflictFooter } from "./partials/conflict-footer"
import { ConflictGroupCard } from "./partials/conflict-group-card"
import { ConflictToolbar } from "./partials/conflict-toolbar"
import { MergeConflictsDialog } from "./partials/merge-conflicts-dialog"

function ConflictResolverPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [loadConflictDetail, loading, conflictDetail, error] = useSimulate(
    getConflictResolverDetail
  )
  const [mergeConflicts, merging] = useSimulate(commitResolvedConflictEntry)
  const [selections, setSelections] = useState<Record<string, ReviewDecision>>({})
  const [showMergeDialog, setShowMergeDialog] = useState(false)

  useEffect(() => {
    if (!applicationId) {
      navigate("/")
      return
    }

    loadConflictDetail(applicationId)
  }, [applicationId, loadConflictDetail, navigate])

  useEffect(() => {
    if (!conflictDetail) {
      return
    }

    setSelections(createInitialSelections(conflictDetail.groups))
  }, [conflictDetail])

  const pageTitle = conflictDetail?.applicationName
  const entry = conflictDetail?.entry
  const groups = conflictDetail?.groups ?? []
  const conflictCount = entry?.metrics.requiresReview ?? 0
  const totalSelectableCount = groups.flatMap((group) => group.items).length
  const { resolvedCount, localCount, externalCount } =
    getSelectionSummary(selections)

  function handleSelect(itemId: string, decision: Exclude<ReviewDecision, null>) {
    setSelections((current) => ({
      ...current,
      [itemId]: decision,
    }))
  }

  function handleAcceptAll(decision: Exclude<ReviewDecision, null>) {
    setSelections(createBulkSelections(groups, decision))
  }

  async function handleMerge() {
    if (!applicationId || !entry || resolvedCount !== totalSelectableCount) {
      return
    }

    const result = await mergeConflicts(applicationId, entry, selections)

    if (!result) {
      return
    }

    navigate(`/applications/${applicationId}`, {
      state: {
        conflictResolved: {
          applicationName: result.applicationName,
          resolvedCount: result.resolvedCount,
        },
      },
    })
  }

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
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
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                <span>{applicationId ?? "application"}</span>
                {entry?.version && <VersionTag version={entry.version} />}
              </div>
              {loading && !conflictDetail ? (
                <Skeleton className="mt-3 h-12 w-80 rounded-2xl sm:h-14 sm:w-[34rem]" />
              ) : (
                <h1 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                  {pageTitle ?? "Application"} resolve conflicts
                </h1>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {conflictCount} field conflict{conflictCount === 1 ? "" : "s"} across{" "}
                {groups.length} record{groups.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>
        </header>

        {loading && !conflictDetail ? (
          <section className="grid gap-4">
            <Card className="ring-1 ring-border">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-4 h-24 w-full" />
              </CardContent>
            </Card>
            <Card className="ring-1 ring-border">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-4 h-24 w-full" />
              </CardContent>
            </Card>
          </section>
        ) : !conflictDetail || !applicationId ? (
          <PageError
            message={error?.message ?? "No conflict entry found."}
            onRetry={() => {
              if (applicationId) {
                loadConflictDetail(applicationId)
              }
            }}
          />
        ) : groups.length > 0 ? (
          <>
            <Alert variant="warning">
              <WarningCircleIcon />
              <AlertTitle>Conflict resolution required</AlertTitle>
              <AlertDescription>
                Choose which value to keep for every conflicting field before
                merging the resolved result into history.
              </AlertDescription>
            </Alert>

            <ConflictToolbar
              onAcceptAllLocal={() => handleAcceptAll("local")}
              onAcceptAllExternal={() => handleAcceptAll("external")}
              onViewHistory={() => {
                if (entry) {
                  navigate(`/applications/${applicationId}/history/${entry.id}`)
                }
              }}
            />

            <section className="grid gap-4">
              {groups.map((group) => (
                <ConflictGroupCard
                  key={`${group.entityType}:${group.entityId}`}
                  entityLabel={group.entityLabel}
                  entityType={group.entityType}
                  items={group.items}
                  selections={selections}
                  onSelect={handleSelect}
                />
              ))}
            </section>

            <ConflictFooter
              totalCount={totalSelectableCount}
              resolvedCount={resolvedCount}
              merging={merging}
              onCancel={() => navigate(`/applications/${applicationId}`)}
              onMerge={() => setShowMergeDialog(true)}
            />
          </>
        ) : (
          <Card className="ring-1 ring-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                This application has no pending field conflicts to resolve.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {entry && (
        <MergeConflictsDialog
          open={showMergeDialog}
          onOpenChange={setShowMergeDialog}
          merging={merging}
          applicationName={pageTitle ?? "Application"}
          version={entry.version}
          localCount={localCount}
          externalCount={externalCount}
          onConfirm={async () => {
            await handleMerge()
          }}
        />
      )}
    </main>
  )
}

export default ConflictResolverPage
