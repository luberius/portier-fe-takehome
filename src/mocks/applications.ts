import type { Application } from "@/types"

export const applications: Application[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    status: "synced",
    version: "v2.4.1",
    lastSyncedAt: "2026-03-18T11:20:00Z",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    status: "conflict",
    version: "v1.8.3",
    lastSyncedAt: "2026-03-18T10:43:00Z",
  },
  {
    id: "stripe",
    name: "Stripe",
    status: "syncing",
    version: "v3.1.0",
    lastSyncedAt: "2026-03-18T10:31:00Z",
  },
  {
    id: "slack",
    name: "Slack",
    status: "synced",
    version: "v1.2.5",
    lastSyncedAt: "2026-03-18T09:12:00Z",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    status: "error",
    version: "v2.0.8",
    lastSyncedAt: "2026-03-17T16:20:00Z",
  },
  {
    id: "intercom",
    name: "Intercom",
    status: "synced",
    version: "v1.5.2",
    lastSyncedAt: "2026-03-18T08:05:00Z",
  },
]
