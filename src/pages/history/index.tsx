import { ArrowLeftIcon } from "@phosphor-icons/react"
import { useEffect } from "react"
import { PageError } from "@/components/page-error"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSimulate } from "@/lib/use-simulate"
import { Link, useNavigate, useParams } from "react-router"
import { getApplicationHistoryDetail } from "./actions/data"
import { HistoryListSkeleton } from "./partials/skeletons/history-list-skeleton"
import { HistoryRow } from "./partials/history-row"

function HistoryPage() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [loadHistoryDetail, loading, detail, error] = useSimulate(
    getApplicationHistoryDetail
  )

  useEffect(() => {
    if (!applicationId) {
      navigate("/")
      return
    }

    loadHistoryDetail(applicationId)
  }, [applicationId, loadHistoryDetail, navigate])

  const pageTitle = detail?.history[0]?.applicationName

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
            Back to detail
          </Button>
          <div className="mt-4">
            <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
              {applicationId ?? "application"}
            </p>
            {loading && !detail ? (
              <Skeleton className="mt-3 h-12 w-72 rounded-2xl sm:h-14 sm:w-96" />
            ) : (
              <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                {pageTitle ?? "Application"} history
              </h1>
            )}
          </div>
        </header>
        <Card className="py-0 ring-1 ring-border">
          <CardHeader className="border-b border-border py-3">
            <CardTitle className="grid grid-cols-[1.2fr_0.7fr_0.5fr_1.2fr] gap-3 font-mono text-[11px] font-normal tracking-[0.18em] text-muted-foreground uppercase">
              <span>Timestamp / source</span>
              <span>Version</span>
              <span>Status</span>
              <span>Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {loading && !detail ? (
              <HistoryListSkeleton />
            ) : !detail || !applicationId ? (
              <PageError
                message={error?.message ?? "Unknown application."}
                onRetry={() => {
                  if (applicationId) {
                    loadHistoryDetail(applicationId)
                  }
                }}
              />
            ) : (
              detail.history.map((entry) => (
                <HistoryRow
                  key={entry.id}
                  applicationId={applicationId}
                  entry={entry}
                />
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default HistoryPage
