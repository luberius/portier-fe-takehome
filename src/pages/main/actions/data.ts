import { getPersistedApplicationsData } from "@/lib/persisted-state"
import { applications } from "@/mocks"

export function getApplications() {
  const persistedData = getPersistedApplicationsData()

  return applications.map((application) => {
    const applicationPersistedData = persistedData.find(
      (item) => item.applicationId === application.id
    )

    if (!applicationPersistedData) {
      return application
    }

    return {
      ...application,
      version: applicationPersistedData.currentVersion,
      lastSyncedAt: applicationPersistedData.lastSyncedAt,
      status: applicationPersistedData.status,
    }
  })
}
