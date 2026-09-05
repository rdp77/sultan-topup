const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
    public retryable = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ParsedErrorBody {
  message: string;
  body: unknown;
  retryable: boolean;
}

interface FetchOptions extends RequestInit {
  retry?: number; // max retry attempts (default 0)
  retryDelay?: number; // base delay ms (default 1000, doubled each attempt)
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function parseErrorResponse(res: Response): Promise<ParsedErrorBody> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  const errBody = body as { message?: string; error?: string | { message: string } };
  const message =
    errBody?.message ??
    (typeof errBody?.error === 'string' ? errBody.error : errBody?.error?.message) ??
    `Request failed (${res.status})`;

  return { message, body, retryable: res.status >= 500 || res.status === 429 };
}

function toApiError(
  res: Response,
  path: string,
  method: string,
  parsed: ParsedErrorBody
): ApiError {
  console.error(`[apiFetch] ${method} ${path} → ${res.status}`, {
    body: parsed.body,
    status: res.status,
  });
  return new ApiError(parsed.message, res.status, parsed.body, parsed.retryable);
}

function toNetworkError(err: unknown): ApiError {
  return new ApiError(err instanceof Error ? err.message : 'Network error', 0, undefined, true);
}

async function fetchOnce<T>(url: string, path: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Identifies traffic from this Next.js server so the upstream API's
      // Cloudflare bot protection can whitelist it (see WAF custom rule).
      // Browsers ignore this header, so it is harmless on the client.
      'User-Agent': 'SultanTopUp-Server/1.0',
      ...init.headers,
    },
  });

  if (!res.ok) {
    const parsed = await parseErrorResponse(res);
    throw toApiError(res, path, init.method ?? 'GET', parsed);
  }

  return res.json();
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { retry = 0, retryDelay = 1000, ...init } = opts;
  const url = `${BASE_URL}${path}`;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      return await fetchOnce<T>(url, path, init);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : toNetworkError(err);
      if (!apiErr.retryable || attempt === retry) throw apiErr;
      await sleep(retryDelay * 2 ** attempt);
    }
  }

  // Unreachable — loop always returns or throws
  throw new ApiError('Unexpected fetch error', 0);
}
