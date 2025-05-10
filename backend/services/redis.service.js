import Redis from 'ioredis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Check if Redis config is available
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || '';

// Create Redis client with reconnection options
const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    retryStrategy: (times) => {
        // Exponential backoff strategy
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
});

// Event handlers for connection management
redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

redisClient.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
});

// Wrap Redis operations with error handling
const safeRedisOperation = async (operation) => {
    try {
        return await operation();
    } catch (error) {
        console.error(`Redis operation failed: ${error.message}`);
        throw new Error(`Redis operation failed: ${error.message}`);
    }
};

// Helper function to ensure parameters are the right type
const ensureNumber = (value) => {
    if (value === undefined || value === null) return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
};

// Enhanced Redis client with error handling
const enhancedRedisClient = {
    // Basic operations
    get: (key) => safeRedisOperation(() => redisClient.get(key)),
    set: (key, value, ttl) => {
        if (ttl) {
            return safeRedisOperation(() => redisClient.set(key, value, 'EX', ensureNumber(ttl)));
        }
        return safeRedisOperation(() => redisClient.set(key, value));
    },
    del: (key) => safeRedisOperation(() => redisClient.del(key)),
    
    // List operations
    lpush: (key, value) => safeRedisOperation(() => redisClient.lpush(key, value)),
    rpush: (key, value) => safeRedisOperation(() => redisClient.rpush(key, value)),
    lrange: (key, start, end) => safeRedisOperation(() => redisClient.lrange(key, ensureNumber(start), ensureNumber(end))),
    ltrim: (key, start, end) => safeRedisOperation(() => redisClient.ltrim(key, ensureNumber(start), ensureNumber(end))),
    llen: (key) => safeRedisOperation(() => redisClient.llen(key)),
    
    // Hash operations
    hset: (key, field, value) => safeRedisOperation(() => redisClient.hset(key, field, value)),
    hget: (key, field) => safeRedisOperation(() => redisClient.hget(key, field)),
    hgetall: (key) => safeRedisOperation(() => redisClient.hgetall(key)),
    hdel: (key, field) => safeRedisOperation(() => redisClient.hdel(key, field)),
    
    // Set operations
    sadd: (key, ...members) => safeRedisOperation(() => redisClient.sadd(key, ...members)),
    smembers: (key) => safeRedisOperation(() => redisClient.smembers(key)),
    srem: (key, ...members) => safeRedisOperation(() => redisClient.srem(key, ...members)),
    
    // Expiration
    expire: (key, seconds) => safeRedisOperation(() => redisClient.expire(key, ensureNumber(seconds))),
    ttl: (key) => safeRedisOperation(() => redisClient.ttl(key)),
    
    // Transaction
    multi: () => redisClient.multi(),
    
    // Raw client for advanced operations
    raw: redisClient
};

export default enhancedRedisClient;