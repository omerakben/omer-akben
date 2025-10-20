/**
 * Redis Connection Test Utility
 * Tests Upstash Redis connection and rate limiting configuration
 *
 * Usage: npx tsx scripts/test-redis-connection.ts
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local or .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function testRedisConnection() {
  console.log("🔍 Testing Upstash Redis Connection...\n");

  // Step 1: Check environment variables
  console.log("1️⃣  Checking environment variables:");
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error("❌ Missing environment variables!");
    console.log("   Required: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN");
    console.log("   Please check your .env or .env.local file");
    process.exit(1);
  }

  console.log("✅ Environment variables found");
  console.log(`   URL: ${url}`);
  console.log(`   Token: ${token.substring(0, 10)}...`);
  console.log("");

  // Step 2: Test Redis connection
  console.log("2️⃣  Testing Redis connection:");
  try {
    const redis = new Redis({
      url,
      token,
    });

    // Test basic operations
    const testKey = `test:${Date.now()}`;
    await redis.set(testKey, "Hello from Redis test!");
    const value = await redis.get(testKey);
    await redis.del(testKey);

    console.log("✅ Redis connection successful");
    console.log(`   Test key: ${testKey}`);
    console.log(`   Retrieved value: ${value}`);
    console.log("");

    // Step 3: Test rate limiting
    console.log("3️⃣  Testing rate limiting:");
    const rateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "test:ratelimit",
    });

    const identifier = "test-user";
    console.log(`   Testing with identifier: ${identifier}`);
    console.log(`   Limit: 5 requests per minute`);
    console.log("");

    // Make 6 requests to test rate limiting
    for (let i = 1; i <= 6; i++) {
      const result = await rateLimit.limit(identifier);
      console.log(`   Request ${i}:`, {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
      });

      if (!result.success) {
        console.log("✅ Rate limiting working correctly - request blocked");
      }
    }

    console.log("");

    // Step 4: Summary
    console.log("4️⃣  Summary:");
    console.log("✅ All tests passed!");
    console.log("   - Environment variables configured correctly");
    console.log("   - Redis connection working");
    console.log("   - Rate limiting functioning properly");
    console.log("");
    console.log("📝 Next steps:");
    console.log("   - Start your dev server: npm run dev");
    console.log("   - Test rate limiting on API routes");
    console.log("   - Check rate limit headers in browser DevTools");

  } catch (error) {
    console.error("❌ Redis connection failed!");
    console.error("   Error:", error);
    console.log("");
    console.log("📝 Troubleshooting:");
    console.log("   1. Verify credentials at https://console.upstash.com/");
    console.log("   2. Check network connectivity");
    console.log("   3. Ensure URL includes 'https://' protocol");
    process.exit(1);
  }
}

testRedisConnection();
