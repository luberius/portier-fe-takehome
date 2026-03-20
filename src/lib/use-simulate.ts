import { useCallback, useState } from "react"

export type AppError = {
  status: number
  message: string
}

type Fetcher<TData, TArgs extends unknown[]> = (
  ...args: TArgs
) => TData | Promise<TData>

function toSimulateError(error: unknown): AppError {
  if (typeof error === "object" && error !== null) {
    const appError = error as Partial<AppError>

    if (typeof appError.status === "number") {
      return {
        status: appError.status,
        message: appError.message ?? "Unexpected error",
      }
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    }
  }

  return {
    status: 500,
    message: "Unexpected error",
  }
}

function wait() {
  const randomDelay = Math.random() * 700 + 300
  return new Promise((resolve) => {
    setTimeout(resolve, randomDelay)
  })
}

export function useSimulate<TData, TArgs extends unknown[]>(
  fetcher: Fetcher<TData, TArgs>
) {
  const [success, setSuccess] = useState<TData | null>(null)
  const [error, setError] = useState<AppError | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(
    async (...args: TArgs) => {
      setLoading(true)
      setError(null)

      try {
        await wait()
        const result = await fetcher(...args)
        setSuccess(result)
        return result
      } catch (err) {
        const nextError = toSimulateError(err)
        setSuccess(null)
        setError(nextError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [fetcher]
  )

  return [load, loading, success, error] as const
}
