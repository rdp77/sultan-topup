const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL

interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('API_URL / NEXT_PUBLIC_API_URL is not defined')
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    throw new ApiError(res.status, `Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
