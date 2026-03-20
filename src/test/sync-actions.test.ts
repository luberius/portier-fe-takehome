import { beforeEach, describe, expect, it, vi } from "vitest"
import type { SyncResponse } from "@/types"

const syncApplicationMock = vi.fn()
const getPersistedApplicationDataMock = vi.fn()

vi.mock("@/lib/api", () => ({
  syncApplication: (...args: Parameters<typeof syncApplicationMock>) =>
    syncApplicationMock(...args),
}))

vi.mock("@/lib/persisted-state", async () => {
  const actual = await vi.importActual<typeof import("@/lib/persisted-state")>(
    "@/lib/persisted-state"
  )

  return {
    ...actual,
    getPersistedApplicationData: (
      ...args: Parameters<typeof getPersistedApplicationDataMock>
    ) => getPersistedApplicationDataMock(...args),
  }
})

import { getSyncPreview } from "@/pages/sync/actions/data"

function createSyncResponse(changes: SyncResponse["data"]["sync_approval"]["changes"]): SyncResponse {
  return {
    code: "SUCCESS",
    message: "successfully retrieve the data",
    data: {
      sync_approval: {
        application_name: "Intercom",
        changes,
      },
      metadata: {},
    },
  }
}

describe("sync preview grouping", () => {
  beforeEach(() => {
    syncApplicationMock.mockReset()
    getPersistedApplicationDataMock.mockReset()
    getPersistedApplicationDataMock.mockReturnValue(undefined)
  })

  it("groups consecutive changes by entity type and change type", async () => {
    syncApplicationMock.mockResolvedValue(
      createSyncResponse([
        {
          id: "change_001",
          field_name: "user.id",
          change_type: "ADD",
          new_value: "user-1",
        },
        {
          id: "change_002",
          field_name: "user.email",
          change_type: "UPDATE",
          current_value: "before@example.com",
          new_value: "after@example.com",
        },
        {
          id: "change_003",
          field_name: "user.role",
          change_type: "UPDATE",
          current_value: "user",
          new_value: "admin",
        },
        {
          id: "change_004",
          field_name: "door.status",
          change_type: "UPDATE",
          current_value: "offline",
          new_value: "online",
        },
        {
          id: "change_005",
          field_name: "key.id",
          change_type: "ADD",
          new_value: "key-1",
        },
        {
          id: "change_006",
          field_name: "key.status",
          change_type: "ADD",
          new_value: "active",
        },
      ])
    )

    const preview = await getSyncPreview("intercom")

    expect(preview.groups).toHaveLength(4)
    expect(
      preview.groups.map((group) => ({
        entityType: group.entityType,
        entityId: group.entityId,
        label: group.entityLabel,
        itemIds: group.items.map((item) => item.id),
      }))
    ).toEqual([
      {
        entityType: "user",
        entityId: "user-add-1",
        label: "New user 1",
        itemIds: ["change_001"],
      },
      {
        entityType: "user",
        entityId: "user-update-1",
        label: "Updated user 1",
        itemIds: ["change_002", "change_003"],
      },
      {
        entityType: "door",
        entityId: "door-update-1",
        label: "Updated door 1",
        itemIds: ["change_004"],
      },
      {
        entityType: "key",
        entityId: "key-add-1",
        label: "New key 1",
        itemIds: ["change_005", "change_006"],
      },
    ])
  })

  it("starts a new group when the change type changes for the same entity type", async () => {
    syncApplicationMock.mockResolvedValue(
      createSyncResponse([
        {
          id: "change_001",
          field_name: "user.name",
          change_type: "UPDATE",
          current_value: "Jane",
          new_value: "Jane Smith",
        },
        {
          id: "change_002",
          field_name: "user.phone",
          change_type: "DELETE",
          current_value: "+1 555 0100",
        },
        {
          id: "change_003",
          field_name: "user.email",
          change_type: "UPDATE",
          current_value: "jane@old.com",
          new_value: "jane@new.com",
        },
      ])
    )

    const preview = await getSyncPreview("intercom")

    expect(preview.groups).toHaveLength(3)
    expect(preview.groups[0]).toMatchObject({
      entityType: "user",
      entityId: "user-update-1",
    })
    expect(preview.groups[1]).toMatchObject({
      entityType: "user",
      entityId: "user-delete-1",
    })
    expect(preview.groups[2]).toMatchObject({
      entityType: "user",
      entityId: "user-update-2",
    })
  })
})
