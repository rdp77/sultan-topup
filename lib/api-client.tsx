const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
    public retryable = false,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends RequestInit {
  retry?: number // max retry attempts (default 0)
  retryDelay?: number // base delay ms (default 1000, doubled each attempt)
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { retry = 0, retryDelay = 1000, ...init } = opts
  const url = `${BASE_URL}${path}`

  let lastErr: ApiError | undefined

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        ...init,
      })

      if (!res.ok) {
        let body: unknown
        try {
          body = await res.json()
        } catch {
          // no JSON body
        }

        const retryable = res.status >= 500 || res.status === 429

        // Attempt to extract message from common API shapes
        const msg =
          (body as { message?: string })?.message ??
          (body as { error?: string })?.error ??
          `Request failed (${res.status})`

        throw new ApiError(msg, res.status, body, retryable)
      }

      return res.json()
    } catch (err) {
      if (err instanceof ApiError) {
        lastErr = err
        if (!err.retryable || attempt === retry) throw err
      } else {
        // Network error — retryable
        lastErr = new ApiError(
          err instanceof Error ? err.message : 'Network error',
          0,
          undefined,
          true,
        )
        if (attempt === retry) throw lastErr
      }

      await sleep(retryDelay * 2 ** attempt)
    }
  }

  // Unreachable — loop always either returns or throws
  throw lastErr ?? new ApiError('Unexpected fetch error', 0)
}
