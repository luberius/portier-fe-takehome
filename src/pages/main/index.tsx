import { useEffect } from "react"
import { PageError } from "@/components/page-error"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSimulate } from "@/lib/use-simulate"
import { getApplications } from "./actions/data"
import { ApplicationRow } from "./partials/application-row"
import { ApplicationsListSkeleton } from "./partials/skeletons/applications-list-skeleton"

const MainPage = () => {
  const [loadApplications, loading, applications, error] =
    useSimulate(getApplications)
  const applicationCount = applications?.length ?? 0

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-6">
      <section className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-3 border-b border-border pb-6">
          <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            Integration Panel
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-5xl">
                Applications
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                A spare wireframe for browsing integrations, reviewing sync
                state, and drilling into history without committing to final
                visual polish yet.
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {applicationCount.toString().padStart(2, "0")} integrations
            </p>
          </div>
        </header>
        <Card className="py-0 ring-1 ring-border">
          <CardHeader className="border-b border-border py-3">
            <CardTitle className="grid grid-cols-[1.5fr_0.8fr_1fr_0.7fr] gap-3 font-mono text-[11px] font-normal tracking-[0.18em] text-muted-foreground uppercase">
              <span>Application</span>
              <span>Status</span>
              <span>Last synced</span>
              <span>Version</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {loading && !applications && <ApplicationsListSkeleton />}
            {(error || !applications) && !loading && (
              <PageError
                message={error?.message ?? "Unable to load applications."}
                onRetry={() => {
                  loadApplications()
                }}
              />
            )}
            {!loading &&
              applications &&
              applications.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                />
              ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default MainPage
