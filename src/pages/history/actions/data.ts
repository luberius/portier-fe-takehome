import { notFound } from "@/lib/errors"
import { getMergedHistory, getPersistedApplicationData } from "@/lib/persisted-state"
import { applicationDetails } from "@/mocks"

export function getApplicationHistoryDetail(applicationId: string) {
  const detail = applicationDetails.find((item) => item.applicationId === applicationId)

  if (!detail) {
    throw notFound("Application not found")
  }

  const persistedData = getPersistedApplicationData(applicationId)
  const history = getMergedHistory(detail.history, persistedData?.history)

  if (!persistedData) {
    return {
      ...detail,
      history,
    }
  }

  return {
    ...detail,
    currentVersion: persistedData.currentVersion,
    lastSyncedAt: persistedData.lastSyncedAt,
    history,
  }
}
