/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'dexie';
import { CacheEntry } from '@/types/database';

export class CacheService {
  constructor(private cache: Table<CacheEntry>) {}

  async set(
    key: string,
    data: unknown,
    ttlMinutes: number = 60
  ): Promise<void> {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    await this.cache.put({
      key,
      data,
      expiry,
      createdAt: new Date().toISOString(),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = await this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      await this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  async clearExpired(): Promise<void> {
    const now = Date.now();
    await this.cache.where("expiry").below(now).delete();
  }

  async clear(): Promise<void> {
    await this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = await this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      await this.cache.delete(key);
      return false;
    }

    return true;
  }

  async getKeys(): Promise<string[]> {
    const entries = await this.cache.toArray();
    return entries
      .filter(entry => Date.now() <= entry.expiry)
      .map(entry => entry.key);
  }

  async getSize(): Promise<number> {
    const entries = await this.cache.toArray();
    return entries.filter(entry => Date.now() <= entry.expiry).length;
  }

  async setMultiple(entries: Array<{ key: string; data: unknown; ttlMinutes?: number }>): Promise<void> {
    const cacheEntries = entries.map(entry => ({
      key: entry.key,
      data: entry.data,
      expiry: Date.now() + (entry.ttlMinutes || 60) * 60 * 1000,
      createdAt: new Date().toISOString(),
    }));

    await this.cache.bulkPut(cacheEntries);
  }

  async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    const entries = await this.cache.where('key').anyOf(keys).toArray();
    const result = new Map<string, T>();
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const entry of entries) {
      if (now > entry.expiry) {
        expiredKeys.push(entry.key);
      } else {
        result.set(entry.key, entry.data as T);
      }
    }

    // Clean up expired entries
    if (expiredKeys.length > 0) {
      await this.cache.where('key').anyOf(expiredKeys).delete();
    }

    return result;
  }

  async getEntryInfo(key: string): Promise<{
    exists: boolean;
    expired: boolean;
    expiryDate?: Date;
    createdAt?: Date;
    ttl?: number;
  }> {
    const entry = await this.cache.get(key);
    if (!entry) {
      return { exists: false, expired: false };
    }

    const now = Date.now();
    const expired = now > entry.expiry;

    return {
      exists: true,
      expired,
      expiryDate: new Date(entry.expiry),
      createdAt: new Date(entry.createdAt),
      ttl: expired ? 0 : Math.ceil((entry.expiry - now) / (1000 * 60))
    };
  }
}