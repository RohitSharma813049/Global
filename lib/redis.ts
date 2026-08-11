import { Redis } from '@upstash/redis'


export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL || 'https://placeholder-redis.upstash.io',
    token: process.env.UPSTASH_REDIS_TOKEN || 'placeholder-token',
})
