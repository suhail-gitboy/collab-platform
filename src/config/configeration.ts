export const configData = {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_URL,
    },

    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    ttl: {
        // define in seconds — easy to read/reason about
        min5: Number(process.env.REDIS_TTL_5MIN_SEC) || 300,
        min10: Number(process.env.REDIS_TTL_10MIN_SEC) || 600,
        min15: Number(process.env.REDIS_TTL_15MIN_SEC) || 900,
        hr1: Number(process.env.REDIS_TTL_1HR_SEC) || 3600,
        day1: Number(process.env.REDIS_TTL_1DAY_SEC) || 86400,         // 24 hr
    },

    // src/common/redis/redis-keys.ts

    RedisKeys: {
        userProfile: (id: string | number) => `user:profile:${id}`,

    },
    secret: process.env.SECRET
};