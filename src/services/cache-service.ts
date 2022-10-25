import { createClient, RedisClientType } from "redis";
import LRUCache from "lru-cache";

class CacheService {
    private cache: boolean = process.env.CACHE === "off" ? false : true;
    private client: RedisClientType | LRUCache<String, String>;

    constructor() {
        this.client = new LRUCache<String, String>({
            ttl: 60000,
            max: 100000
        });;
    }

    public async connect() {
        if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
            this.client = createClient({
                socket: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT ?? 6379)
                },
            });

            try {
                await this.client.connect();
                console.log(`[CACHE] Connected to Redis on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? 6379}`);
                return;
            } catch {
                console.warn(`[CACHE] Failed to connect to Redis on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? 6379}, falling back to LRU cache...`);
                this.connectLRU();
            }
        } else {
            this.connectLRU();
        }
    }

    private connectLRU() {
        console.log("[CACHE] Using LRU in-memory cache instead of Redis, please configure REDIS_HOST and REDIS_PORT env variables for distributed caching.");
        this.client = new LRUCache<String, String>({
            ttl: 60000,
            max: 100000
        });
    }

    public stopCache() {
        this.cache = false;
    }

    public startCache() {
        this.cache = true;
    }

    public async get(key: string): Promise<string> {
        const cached = await (this.client["get"] as Function)(key);
        return cached;
    }

    public async getObject(key: string): Promise<object | null> {
        const cachedData = await this.get(key);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        return null;
    }

    public async setObject(key: string, object: any) {
        if (this.cache) {
            try {
                const cached = await (this.client["set"] as Function)(key, JSON.stringify(object));
                return cached;
            } catch (error) {
                console.warn(`[CACHE] Error while caching object ${key}:`, error);
            }
        }
    }
}

export default new CacheService();