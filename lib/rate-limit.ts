import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/redis"

// Create a new ratelimiter that allows 5 requests per 10 seconds
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  // A prefix to easily identify keys in Redis
  prefix: "@upstash/ratelimit/auth",
})
