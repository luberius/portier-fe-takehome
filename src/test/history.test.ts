import {
  formatHistoryMetrics,
  getEffectiveApplicationDetail,
  getLatestConflictHistoryEntry,
  groupHistoryItems,
} from "@/lib/history"
import type { HistoryEntry, HistoryItem } from "@/types"
import { afterEach, describe, expect, it } from "vitest"

const STORAGE_KEY = "portier:approved-sync-history:v1"

function createHistoryItem(
  overrides: Partial<HistoryItem> = {}
): HistoryItem {
  return {
    id: "item_1",
    entityType: "user",
    entityId: "usr_1",
    entityLabel: "User 1",
    fieldPath: "user.email",
    fieldLabel: "Email",
    changeType: "UPDATE",
    localValue: "old@example.com",
    externalValue: "new@example.com",
    review: {
      required: false,
      status: "not_required",
      decision: null,
    },
    ...overrides,
  }
}

function createHistoryEntry(
  overrides: Partial<HistoryEntry> = {}
): HistoryEntry {
  return {
    id: "hist_1",
    applicationId: "intercom",
    applicationName: "Intercom",
    timestamp: "2026-03-20T09:00:00.000Z",
    source: "system",
    version: "v1.5.2",
    status: "synced",
    summary: "Entry summary",
    metrics: {
      totalChanges: 1,
      added: 0,
      updated: 1,
      deleted: 0,
      requiresReview: 0,
      resolved: 0,
    },
    items: [createHistoryItem()],
    ...overrides,
  }
}

describe("history", () => {
  afterEach(() => {
    localStorage.clear()
  })

  it("groups history items by entity type and id", () => {
    const groups = groupHistoryItems([
      createHistoryItem({ id: "a", entityId: "usr_1" }),
      createHistoryItem({ id: "b", entityId: "usr_1", fieldPath: "user.name" }),
      createHistoryItem({ id: "c", entityType: "door", entityId: "door_1" }),
    ])

    expect(groups).toHaveLength(2)
    expect(groups[0]).toMatchObject({
      entityType: "user",
      entityId: "usr_1",
    })
    expect(groups[0].items.map((item) => item.id)).toEqual(["a", "b"])
    expect(groups[1]).toMatchObject({
      entityType: "door",
      entityId: "door_1",
    })
  })

  it("returns a conflict only when the newest dated entry is conflict", () => {
    const olderConflict = createHistoryEntry({
      id: "older_conflict",
      timestamp: "2026-03-20T08:00:00.000Z",
      status: "conflict",
    })
    const newerSynced = createHistoryEntry({
      id: "newer_synced",
      timestamp: "2026-03-20T09:00:00.000Z",
      status: "synced",
    })

    expect(
      getLatestConflictHistoryEntry([olderConflict, newerSynced])
    ).toBeUndefined()

    const newestConflict = createHistoryEntry({
      id: "newest_conflict",
      timestamp: "2026-03-20T10:00:00.000Z",
      status: "conflict",
    })

    expect(
      getLatestConflictHistoryEntry([olderConflict, newerSynced, newestConflict])
    ).toMatchObject({ id: "newest_conflict" })
  })

  it("formats metrics into a readable summary", () => {
    expect(
      formatHistoryMetrics(
        createHistoryEntry({
          metrics: {
            totalChanges: 5,
            added: 1,
            updated: 2,
            deleted: 1,
            requiresReview: 1,
            resolved: 0,
          },
        })
      )
    ).toBe("1 added • 2 updated • 1 deleted • 1 review")

    expect(
      formatHistoryMetrics(
        createHistoryEntry({
          metrics: {
            totalChanges: 3,
            added: 0,
            updated: 0,
            deleted: 0,
            requiresReview: 0,
            resolved: 0,
          },
        })
      )
    ).toBe("3 changes")
  })

  it("merges persisted application data and sorts history by timestamp", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        persistedData: [
          {
            applicationId: "intercom",
            currentVersion: "v1.5.3",
            lastSyncedAt: "2026-03-20T12:00:00.000Z",
            status: "synced",
            history: [
              createHistoryEntry({
                id: "persisted_latest",
                timestamp: "2026-03-20T12:00:00.000Z",
                version: "v1.5.3",
                source: "user",
              }),
            ],
          },
        ],
      })
    )

    const result = getEffectiveApplicationDetail("intercom")

    expect(result.applicationName).toBe("Intercom")
    expect(result.detail.currentVersion).toBe("v1.5.3")
    expect(result.detail.lastSyncedAt).toBe("2026-03-20T12:00:00.000Z")
    expect(result.detail.history[0]).toMatchObject({ id: "persisted_latest" })
  })
})
