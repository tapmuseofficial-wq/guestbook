type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

// Sliding window rate limiter — per-instance (sufficient for single-region Vercel Fluid Compute).
// Returns true if the request is allowed, false if it should be blocked.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
