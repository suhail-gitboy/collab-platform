import { Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {

    }
    getHello(): string {
        return 'Hello World!';
    }


    async Setcache<T>(key: string, value: T, ttl: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl)
    }

    async getCache<T>(key: string): Promise<T | undefined> {
        return await this.cacheManager.get(key)
    }

    async Del(key: string): Promise<void> {
        await this.cacheManager.del(key)

    }

    async reset(): Promise<void> {
        await this.cacheManager.clear();
    }

    async getOrFetch<T>(
        key: string,
        fn: () => Promise<T>,
        ttl: number,
    ): Promise<T> {


        console.log("CACHE KEY:", key);

        await this.cacheManager.set("debug-from-nest", "HELLO", 600000);

        console.log(
            "DEBUG VALUE:",
            await this.cacheManager.get("debug-from-nest")
        );
        const cached = await this.cacheManager.get<T>(key);

        console.log('CACHE BEFORE:', cached);

        if (cached !== undefined && cached !== null) {
            console.log('🔥 CACHE HIT');
            return cached;
        }

        console.log('❌ CACHE MISS');

        const data = await fn();

        console.log('DATA FROM DB:', data);

        await this.cacheManager.set(key, data, ttl);

        console.log('✅ STORED');

        // Immediately read it back
        const check = await this.cacheManager.get<T>(key);

        console.log('CACHE AFTER SET:', check);

        return data;
    }
    async testRedis() {


        let item = {
            "id": "9e5e22df-0ad2-4eb1-aba3-14ddbda2b99f",
            "user_id": "973e8920-af37-4a96-8aa1-1dec5a8e258c",
            "display_name": "suheshTech",
            "bio": "am a welder",
            "profile_photo_url": "https://res.cloudinary.com/dlyufkmc5/image/upload/v1785916189/profile_photo_url/tp88a97iwh7fmnkj4ngf.jpg",
            "cover_photo_url": "https://res.cloudinary.com/dlyufkmc5/image/upload/v1785916190/cover_photo_url/yaktecsfsoelddivw7wm.jpg",
            "city": "thrissur",
            "state": "kerala",
            "country": "india",
            "latitude": "9.931233",
            "longtitude": "76.267303",
            "location": {
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "EPSG:4326"
                    }
                },
                "type": "Point",
                "coordinates": [
                    76.267303,
                    9.931233
                ]
            },
            "pricing_min": "5000.00",
            "pricing_max": "15000.00",
            "currency": "INR",
            "accepts_paid": true,
            "accepts_barter": true,
            "accepts_affiliate": false,
            "accepts_events": true,
            "engagement_rate": null,
            "average_rating": "0.00",
            "total_reviews": 0,
            "total_collaborations": 0,
            "is_verified": false,
            "created_at": "2026-08-04T15:26:44.423Z",
            "updated_at": "2026-08-04T15:26:44.424Z"
        }
        await this.cacheManager.set('nestjs-test', item, 600000);

        const value = await this.cacheManager.get('nestjs-test');

        console.log('VALUE FROM REDIS:', value);

        return {
            value,
        };
    }
}
