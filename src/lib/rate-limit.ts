import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const memeShortBurstLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per 1 minute
});

export const memeDailyLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "24 h"),
});

export async function enforceMemeLimits(key: string) {
  const [shortResult, dailyResult] = await Promise.all([
    memeShortBurstLimit.limit(`short:${key}`),
    memeDailyLimit.limit(`daily:${key}`),
  ]);

  if (!shortResult.success || !dailyResult.success) {
    return {
      ok: false as const,
      exceeded: !shortResult.success
        ? "short"
        : !dailyResult.success
        ? "daily"
        : "unknown",
      retryAfter: Math.max(shortResult.reset, dailyResult.reset),
      remainingShort: shortResult.remaining,
      remainingDaily: dailyResult.remaining,
    };
  }

  return {
    ok: true as const,
    exceeded: null,
    remainingShort: shortResult.remaining,
    remainingDaily: dailyResult.remaining,
  };
}
