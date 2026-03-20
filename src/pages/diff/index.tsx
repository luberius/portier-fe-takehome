import { ArrowLeftIcon } from "@phosphor-icons/react"
import { ChangeGroupCard } from "@/components/diff/change-group-card"
import { useEffect } from "react"
import { PageError } from "@/components/page-error"
import { VersionTag } from "@/components/version-tag"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSimulate } from "@/lib/use-simulate"
import { Link, useNavigate, useParams } from "react-router"
import { getReviewDetail, groupReviewItems } from "./actions/data"
import { DiffContentSkeleton } from "./partials/skeletons/diff-content-skeleton"

function DiffPage() {
  const { applicationId, historyId } = useParams()
  const navigate = useNavigate()
  const [loadReview, loading, review, error] = useSimulate(getReviewDetail)

  useEffect(() => {
    if (!applicationId || !historyId) {
      navigate("/")
      return
    }

    loadReview(applicationId, historyId)
  }, [applicationId, historyId, loadReview, navigate])

  const detail = review?.detail
  const entry = review?.entry
  const pageTitle = entry?.applicationName

  const diffItems = entry?.items ?? []
  const reviewGroups = groupReviewItems(diffItems)

  console.log(reviewGroups, detail)

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="border-b border-border pb-6">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to={`/applications/${applicationId}/history`} />}
            nativeButton={false}
          >
            <ArrowLeftIcon />
            Back to history
          </Button>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                <span>{applicationId ?? "application"}</span>
                {entry?.version && <VersionTag version={entry.version} />}
              </div>
              {loading && !review ? (
                <Skeleton className="mt-3 h-12 w-72 rounded-2xl sm:h-14 sm:w-96" />
              ) : (
                <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                  {pageTitle ?? "Application"} review
                </h1>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-muted-foreground sm:grid-cols-4">
              <Card className="py-3 ring-1 ring-border">
                <CardContent className="px-4">
                  <p>total</p>
                  <p className="mt-2 text-lg text-foreground">
                    {entry?.metrics.totalChanges ?? "--"}
                  </p>
                </CardContent>
              </Card>
              <Card className="py-3 ring-1 ring-border">
                <CardContent className="px-4">
                  <p>added</p>
                  <p className="mt-2 text-lg text-foreground">
                    {entry?.metrics.added ?? "--"}
                  </p>
                </CardContent>
              </Card>
              <Card className="py-3 ring-1 ring-border">
                <CardContent className="px-4">
                  <p>updated</p>
                  <p className="mt-2 text-lg text-foreground">
                    {entry?.metrics.updated ?? "--"}
                  </p>
                </CardContent>
              </Card>
              <Card className="py-3 ring-1 ring-border">
                <CardContent className="px-4">
                  <p>review</p>
                  <p className="mt-2 text-lg text-foreground">
                    {entry?.metrics.requiresReview ?? "--"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </header>

        {loading && !review ? (
          <DiffContentSkeleton />
        ) : !detail || !entry || !applicationId ? (
          <PageError
            message={error?.message ?? "Unknown history entry."}
            onRetry={() => {
              if (applicationId && historyId) {
                loadReview(applicationId, historyId)
              }
            }}
          />
        ) : diffItems.length > 0 ? (
          <section className="grid gap-4">
            {reviewGroups.map((group) => (
              <ChangeGroupCard
                key={`${group.entityType}:${group.entityId}`}
                entityLabel={group.entityLabel}
                entityType={group.entityType}
                items={group.items}
              />
            ))}
          </section>
        ) : (
          <Card className="ring-1 ring-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                This history entry has no recorded field-level changes.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  )
}

export default DiffPage
