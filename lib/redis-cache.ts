import { redis } from '@/lib/redis';
import { revalidateTag, unstable_cache } from 'next/cache';

// In-memory cache store fallback for sub-millisecond local speed
const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const memoryCacheTags = new Map<string, Set<string>>();

const isRedisConfigured = () => {
  const url = process.env.UPSTASH_REDIS_URL;
  return url && !url.includes('placeholder') && !!process.env.UPSTASH_REDIS_TOKEN;
};

/**
 * Multi-tier caching wrapper:
 * 1. Fast in-memory cache check
 * 2. Upstash Redis cache check (if configured)
 * 3. Next.js unstable_cache wrapper for tags/revalidation
 * 4. Fallback execution of fetchFn
 */
export async function cacheOrFetch<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
  tags: string[] = []
): Promise<T> {
  const now = Date.now();

  // 1. Check In-Memory Cache
  const cachedMemory = memoryCache.get(key);
  if (cachedMemory && cachedMemory.expiresAt > now) {
    return cachedMemory.data as T;
  }

  // 2. Check Upstash Redis (if configured)
  if (isRedisConfigured()) {
    try {
      const redisVal = await redis.get<T>(key);
      if (redisVal !== null && redisVal !== undefined) {
        // Save to in-memory for ultra fast subsequent reads
        memoryCache.set(key, { data: redisVal, expiresAt: now + ttlSeconds * 1000 });
        tags.forEach(tag => {
          if (!memoryCacheTags.has(tag)) memoryCacheTags.set(tag, new Set());
          memoryCacheTags.get(tag)!.add(key);
        });
        return redisVal;
      }
    } catch (err) {
      console.warn(`[RedisCache] Error fetching key "${key}":`, err);
    }
  }

  // 3. Fallback to executing fetchFn wrapped with Next.js unstable_cache
  const cachedFetch = unstable_cache(
    fetchFn,
    [key],
    { revalidate: ttlSeconds, tags }
  );

  try {
    const freshData = await cachedFetch();
    
    // Store in memory cache
    memoryCache.set(key, { data: freshData, expiresAt: now + ttlSeconds * 1000 });
    tags.forEach(tag => {
      if (!memoryCacheTags.has(tag)) memoryCacheTags.set(tag, new Set());
      memoryCacheTags.get(tag)!.add(key);
    });

    // Store in Redis async
    if (isRedisConfigured() && freshData !== undefined && freshData !== null) {
      redis.set(key, freshData, { ex: ttlSeconds }).catch(err => {
        console.warn(`[RedisCache] Failed to set key "${key}" in Redis:`, err);
      });
    }

    return freshData;
  } catch (error) {
    console.error(`[RedisCache] Error executing cached fetch for "${key}":`, error);
    return await fetchFn();
  }
}

/**
 * Invalidate cache by tags or key patterns
 */
export async function invalidateCache(tagsOrKeys: string[]): Promise<void> {
  // Clear memory cache completely to ensure real-time fresh data
  memoryCache.clear();
  memoryCacheTags.clear();

  // 1. Clear Memory Cache by tags / keys
  tagsOrKeys.forEach(item => {
    memoryCache.delete(item);
    if (memoryCacheTags.has(item)) {
      const keys = memoryCacheTags.get(item)!;
      keys.forEach(k => memoryCache.delete(k));
      memoryCacheTags.delete(item);
    }
  });

  // 2. Revalidate Next.js Cache Tags
  tagsOrKeys.forEach(tag => {
    try {
      (revalidateTag as any)(tag);

    } catch (e) {
      // In case called outside request scope
    }
  });

  // 3. Invalidate Redis keys if configured
  if (isRedisConfigured()) {
    try {
      for (const item of tagsOrKeys) {
        await redis.del(item);
      }
    } catch (err) {
      console.warn('[RedisCache] Error invalidating Redis keys:', err);
    }
  }
}
