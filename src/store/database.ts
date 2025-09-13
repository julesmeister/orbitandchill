import Dexie, { Table } from 'dexie';
import { DatabaseUser, DatabasePerson, DatabaseChart, DatabaseSeedingBatch, CacheEntry, NatalChartStorage, UserProfile } from '@/types/database';

// Database class
export class LuckstrologyDatabase extends Dexie {
  userProfiles!: Table<DatabaseUser>;
  people!: Table<DatabasePerson>;
  natalCharts!: Table<DatabaseChart>;
  seedingBatches!: Table<DatabaseSeedingBatch>;
  cache!: Table<CacheEntry>;

  constructor() {
    super('LuckstrologyDatabase');

    this.version(1).stores({
      userProfiles: "id, username, authProvider, updatedAt, email",
      people: "id, userId, name, relationship, isDefault",
      natalCharts: "id, userId, chartType, createdAt",
      seedingBatches: "id, userId, status, createdAt",
      cache: "key, expiry"
    });
  }

  async saveUserProfile(profile: DatabaseUser): Promise<void> {
    await this.userProfiles.put(profile);
  }

  async getCurrentUserProfile(): Promise<DatabaseUser | undefined> {
    return await this.userProfiles.orderBy('updatedAt').last();
  }

  async setCache<T>(key: string, data: T, ttlMinutes: number): Promise<void> {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    await this.cache.put({
      key,
      value: JSON.stringify(data),
      expiry
    });
  }

  async getCache<T>(key: string): Promise<T | null> {
    const entry = await this.cache.get(key);
    if (!entry) return null;

    if (entry.expiry < Date.now()) {
      await this.cache.delete(key);
      return null;
    }

    return JSON.parse(entry.value) as T;
  }

  async clearExpiredCache(): Promise<void> {
    const allEntries = await this.cache.toArray();
    const now = Date.now();
    const expiredKeys = allEntries.filter(entry => entry.expiry < now).map(entry => entry.key);

    if (expiredKeys.length > 0) {
      await this.cache.bulkDelete(expiredKeys);
    }
  }
}

// Export singleton instance
export const db = new LuckstrologyDatabase();