import { notFound } from "@/lib/errors"
import { getPersistedApplicationData } from "@/lib/persisted-state"
import { syncApplication } from "@/lib/api"
import { applicationDetails } from "@/mocks"
import type {
  ApplicationDetail,
  ChangeType,
  EntityType,
  HistoryItem,
  SyncChange,
  SyncPreviewData,
  SyncPreviewGroup,
} from "@/types"

const fieldLabels: Record<string, string> = {
  access_end: "Access end",
  access_start: "Access start",
  battery_level: "Battery level",
  created_at: "Created at",
  device_id: "Device ID",
  door_id: "Door ID",
  email: "Email",
  id: "ID",
  key_type: "Key type",
  last_seen: "Last seen",
  location: "Location",
  name: "Name",
  phone: "Phone",
  role: "Role",
  status: "Status",
  updated_at: "Updated at",
  user_id: "User ID",
}

function getApplicationDetail(applicationId: string) {
  const detail = applicationDetails.find((item) => item.applicationId === applicationId)

  if (!detail) {
    throw notFound("Application not found")
  }

  return detail
}

function getEntityType(fieldName: string): EntityType {
  const [prefix] = fieldName.split(".")

  if (prefix === "user" || prefix === "door" || prefix === "key") {
    return prefix
  }

  return "user"
}

function getFieldKey(fieldName: string) {
  return fieldName.split(".")[1] ?? fieldName
}

function getFieldLabel(fieldName: string) {
  const fieldKey = getFieldKey(fieldName)

  return (
    fieldLabels[fieldKey] ??
    fieldKey
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  )
}

function getNextVersionLabel(version: string) {
  const match = version.match(/^v(\d+)\.(\d+)\.(\d+)$/)

  if (!match) {
    return version
  }

  const [, major, minor, patch] = match
  return `v${major}.${minor}.${Number(patch) + 1}`
}

function createReviewState(required: boolean): HistoryItem["review"] {
  return {
    required,
    status: required ? "pending" : "not_required",
    decision: null,
  }
}

function createStandaloneItem(
  change: SyncChange,
  index: number,
  entityType: EntityType,
  applicationName: string
) {
  const entityId =
    change.change_type === "ADD"
      ? change.new_value ?? `${entityType}-${index + 1}`
      : change.current_value ?? `${entityType}-${index + 1}`

  return {
    id: change.id,
    entityType,
    entityId,
    entityLabel: `${applicationName} ${entityType} change ${index + 1}`,
    fieldPath: change.field_name,
    fieldLabel: getFieldLabel(change.field_name),
    changeType: change.change_type,
    localValue: change.current_value ?? null,
    externalValue: change.new_value ?? null,
    review: createReviewState(change.change_type === "DELETE"),
  }
}

function normalizeChanges(changes: SyncChange[], applicationName: string) {
  const items: HistoryItem[] = []
  const entityCounts = new Map<EntityType, number>()
  let openAddGroup:
    | {
        entityType: EntityType
        entityId: string
        entityLabel: string
      }
    | undefined

  for (const [index, change] of changes.entries()) {
    const entityType = getEntityType(change.field_name)
    const fieldKey = getFieldKey(change.field_name)

    if (
      openAddGroup &&
      (change.change_type === "DELETE" ||
        change.change_type === "ADD" ||
        entityType !== openAddGroup.entityType)
    ) {
      openAddGroup = undefined
    }

    if (change.change_type === "ADD" && fieldKey === "id") {
      const nextCount = (entityCounts.get(entityType) ?? 0) + 1
      entityCounts.set(entityType, nextCount)

      openAddGroup = {
        entityType,
        entityId: change.new_value ?? `${entityType}-new-${nextCount}`,
        entityLabel: `New ${entityType} ${nextCount}`,
      }

      items.push({
        id: change.id,
        entityType,
        entityId: openAddGroup.entityId,
        entityLabel: openAddGroup.entityLabel,
        fieldPath: change.field_name,
        fieldLabel: getFieldLabel(change.field_name),
        changeType: change.change_type,
        localValue: change.current_value ?? null,
        externalValue: change.new_value ?? null,
        review: createReviewState(false),
      })

      continue
    }

    if (change.change_type === "DELETE" && fieldKey === "id") {
      const nextCount = (entityCounts.get(entityType) ?? 0) + 1
      entityCounts.set(entityType, nextCount)

      items.push({
        id: change.id,
        entityType,
        entityId: change.current_value ?? `${entityType}-deleted-${nextCount}`,
        entityLabel: `Deleted ${entityType} ${nextCount}`,
        fieldPath: change.field_name,
        fieldLabel: getFieldLabel(change.field_name),
        changeType: change.change_type,
        localValue: change.current_value ?? null,
        externalValue: change.new_value ?? null,
        review: createReviewState(true),
      })

      continue
    }

    if (openAddGroup && entityType === openAddGroup.entityType) {
      items.push({
        id: change.id,
        entityType,
        entityId: openAddGroup.entityId,
        entityLabel: openAddGroup.entityLabel,
        fieldPath: change.field_name,
        fieldLabel: getFieldLabel(change.field_name),
        changeType: change.change_type,
        localValue: change.current_value ?? null,
        externalValue: change.new_value ?? null,
        review: createReviewState(false),
      })
      continue
    }

    items.push(createStandaloneItem(change, index, entityType, applicationName))
  }

  return items
}

function groupItems(items: HistoryItem[]): SyncPreviewGroup[] {
  const groups = new Map<string, SyncPreviewGroup>()

  for (const item of items) {
    const key = `${item.entityType}:${item.entityId}`
    const existing = groups.get(key)

    if (existing) {
      existing.items.push(item)
      continue
    }

    groups.set(key, {
      entityId: item.entityId,
      entityLabel: item.entityLabel,
      entityType: item.entityType,
      items: [item],
    })
  }

  return Array.from(groups.values())
}

function countByType(changes: SyncChange[], changeType: ChangeType) {
  return changes.filter((change) => change.change_type === changeType).length
}

export async function getSyncPreview(applicationId: string): Promise<SyncPreviewData> {
  const detail: ApplicationDetail = getApplicationDetail(applicationId)
  const persistedData = getPersistedApplicationData(applicationId)
  const response = await syncApplication(applicationId)
  const syncApproval = response.data.sync_approval
  const items = normalizeChanges(syncApproval.changes, syncApproval.application_name)
  const currentVersion = persistedData?.currentVersion ?? detail.currentVersion

  return {
    applicationId,
    applicationName: syncApproval.application_name,
    currentVersion,
    nextVersion: getNextVersionLabel(currentVersion),
    summary: {
      totalChanges: syncApproval.changes.length,
      added: countByType(syncApproval.changes, "ADD"),
      updated: countByType(syncApproval.changes, "UPDATE"),
      deleted: countByType(syncApproval.changes, "DELETE"),
      estimatedDurationSeconds: detail.lastSyncDurationSeconds,
    },
    groups: groupItems(items),
  }
}
