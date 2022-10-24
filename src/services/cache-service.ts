
class CacheService {
    private cache: boolean = process.env.CACHE === "off" ? false : true;

    public stopCache() {
        this.cache = false;
    }

    public startCache() {
        this.cache = true;
    }

    public async isCached(key: string): Promise<Boolean> {
        if (this.cache) {
            return false;
        }
        return false;
    }

    public async get(key: string): Promise<string> {
        return "";
    }

    public async getObject(key: string): Promise<object> {
        return JSON.parse(await this.get(key));
    }

    public async set(key: string, object: any) {
        return true;
    }

    public async delete(key: string) {
        return true;
    }
}

export default new CacheService();