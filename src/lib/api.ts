import type { ErrorResponse, SyncApiError, SyncResponse } from "@/types"

const API_BASE_URL = "https://portier-takehometest.onrender.com/api/v1"

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)
  const data = (await response.json()) as T | ErrorResponse

  if (!response.ok) {
    const error = data as ErrorResponse

    throw {
      status: response.status,
      error: error.error ?? "Request failed",
      code: error.code ?? "unexpected_error",
      message: error.message ?? "Unexpected error",
    } as SyncApiError
  }

  return data as T
}

export function syncApplication(applicationId: string) {
  return api<SyncResponse>(`/data/sync?application_id=${applicationId}`)
}
