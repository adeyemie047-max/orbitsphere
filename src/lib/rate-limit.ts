const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return ip;
}

export function checkRateLimit(
  request: Request,
  scope = "auth",
  maxAttempts = DEFAULT_MAX,
  windowMs = DEFAULT_WINDOW_MS
): { allowed: boolean; retryAfterSeconds?: number } {
  const key = `${scope}:${getClientKey(request)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

/** Returns a 429 Response if limited, otherwise null. */
export function enforceRateLimit(
  request: Request,
  scope: string,
  maxAttempts = DEFAULT_MAX
): Response | null {
  const rate = checkRateLimit(request, scope, maxAttempts);
  if (!rate.allowed && rate.retryAfterSeconds) {
    return rateLimitResponse(rate.retryAfterSeconds);
  }
  return null;
}
