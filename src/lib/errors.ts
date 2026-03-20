export function notFound(message: string) {
  return {
    status: 404,
    message,
  }
}
