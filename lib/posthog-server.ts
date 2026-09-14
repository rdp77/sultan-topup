import { cookies } from 'next/headers';
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
  posthogClient ??= new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

export interface PostHogServerContext {
  distinctId: string;
  sessionId: string | null;
}

/**
 * Reads the PostHog browser cookie (set by posthog-js) so server-side events
 * are attributed to the same person + session as client-side events.
 * Falls back to 'anonymous' when the visitor has no PostHog cookie yet
 * (e.g. first request, bot, or cookie blocked).
 */
export async function getPostHogServerContext(): Promise<PostHogServerContext> {
  try {
    const cookieStore = await cookies();
    const phCookie = cookieStore.getAll().find((c) => /^ph_phc_.*_posthog$/.test(c.name));

    if (phCookie?.value) {
      const parsed = JSON.parse(phCookie.value) as {
        distinct_id?: unknown;
        session_id?: unknown;
      };
      if (typeof parsed.distinct_id === 'string' && parsed.distinct_id) {
        return {
          distinctId: parsed.distinct_id,
          sessionId: typeof parsed.session_id === 'string' ? parsed.session_id : null,
        };
      }
    }
  } catch {
    // Not in a request scope (build/ISR) or malformed cookie - fall through.
  }
  return { distinctId: 'anonymous', sessionId: null };
}

/**
 * Capture an exception server-side without ever throwing (analytics must not
 * break the request path). Flushes immediately because the client uses
 * flushAt: 1 / flushInterval: 0 and serverless handlers are short-lived.
 */
export async function captureServerException(err: unknown, context?: Record<string, unknown>) {
  try {
    const posthog = getPostHogClient();
    const { distinctId } = await getPostHogServerContext();
    posthog.captureException(err, distinctId, context);
    await posthog.flush();
  } catch {
    // Never let analytics failures escape.
  }
}
