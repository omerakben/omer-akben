import { Redis } from '@upstash/redis';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export interface ContactData {
  name: string;
  email: string;
  company?: string;
  purpose: string;
  notes?: string;
  preferredTime?: string;
  collectedAt: string;
  ip: string;
}

/**
 * Save contact information to Redis with 7-day TTL
 */
export async function saveContactToRedis(contact: ContactData): Promise<void> {
  if (!redis) {
    console.warn('[Redis] Contact storage unavailable in development mode');
    return;
  }

  try {
    const key = `contact:${contact.email}`;
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds

    await redis.setex(key, ttl, JSON.stringify(contact));

    // Also add to a sorted set for tracking (optional, for analytics)
    await redis.zadd('contacts:timeline', {
      score: Date.now(),
      member: contact.email,
    });
  } catch (error) {
    console.error('[Redis] Failed to save contact:', error);
    throw error;
  }
}

/**
 * Retrieve contact information from Redis
 */
export async function getContactFromRedis(email: string): Promise<ContactData | null> {
  if (!redis) {
    return null;
  }

  try {
    const key = `contact:${email}`;
    const data = await redis.get<string>(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as ContactData;
  } catch (error) {
    console.error('[Redis] Failed to retrieve contact:', error);
    return null;
  }
}

/**
 * Check if contact has been collected for this email
 */
export async function hasCollectedContact(email: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const key = `contact:${email}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('[Redis] Failed to check contact existence:', error);
    return false;
  }
}
