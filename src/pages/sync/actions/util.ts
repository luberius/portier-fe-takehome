export function getSyncPreviewErrorMessage(status?: number, message?: string) {
  if (status === 502) {
    return "Can't connect to the server."
  }

  if (status === 500) {
    return "Internal server error."
  }

  if (!message) {
    return "Unable to load sync preview."
  }

  if (message.includes("invalid_application_id")) {
    return "This integration is not supported by the live sync API."
  }

  return message
}
