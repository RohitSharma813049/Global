import { Redis } from '@upstash/redis'


export const redis = new Redis({
  url: process.env.UPstash_REDIS_URL || '',
  token: process.env.UPstash_REDIS_TOKEN || '',
})