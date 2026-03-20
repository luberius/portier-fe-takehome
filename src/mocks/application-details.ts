import type { ApplicationDetail } from "@/types"
import { applications } from "./applications"
import {
  hubspotDetail,
  intercomDetail,
  salesforceDetail,
  slackDetail,
  stripeDetail,
  zendeskDetail,
} from "./integrations"

export const applicationDetails: ApplicationDetail[] = [
  salesforceDetail,
  hubspotDetail,
  stripeDetail,
  slackDetail,
  zendeskDetail,
  intercomDetail,
]

export function getApplicationName(applicationId: string) {
  return applications.find((application) => application.id === applicationId)?.name ?? ""
}
