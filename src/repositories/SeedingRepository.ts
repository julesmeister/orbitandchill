/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'dexie';
import { SeedUserConfig, SeedingBatch } from '@/types/database';

export class SeedingRepository {
  constructor(
    private seedUserConfigs: Table<SeedUserConfig>,
    private seedingBatches: Table<SeedingBatch>
  ) {}

  // Seed User Configuration methods
  async saveSeedUserConfig(config: SeedUserConfig): Promise<void> {
    await this.seedUserConfigs.put(config);
  }

  async getSeedUserConfig(id: string): Promise<SeedUserConfig | null> {
    const config = await this.seedUserConfigs.get(id);
    return config || null;
  }

  async getAllActiveSeedUserConfigs(): Promise<SeedUserConfig[]> {
    const configs = await this.seedUserConfigs
      .where("isActive")
      .equals(1)
      .toArray();
    
    return configs.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getSeedUserConfigByUserId(userId: string): Promise<SeedUserConfig | null> {
    const config = await this.seedUserConfigs
      .where("userId")
      .equals(userId)
      .first();
    return config || null;
  }

  async deleteSeedUserConfig(id: string): Promise<void> {
    await this.seedUserConfigs.delete(id);
  }

  // Seeding Batch methods
  async saveSeedingBatch(batch: SeedingBatch): Promise<void> {
    await this.seedingBatches.put(batch);
  }

  async getSeedingBatch(id: string): Promise<SeedingBatch | null> {
    const batch = await this.seedingBatches.get(id);
    return batch || null;
  }

  async getAllSeedingBatches(): Promise<SeedingBatch[]> {
    const batches = await this.seedingBatches.toArray();
    return batches.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateSeedingBatchStatus(
    id: string, 
    status: SeedingBatch['status'], 
    stats?: Partial<Pick<SeedingBatch, 'createdDiscussions' | 'createdReplies' | 'createdVotes' | 'errorMessage'>>
  ): Promise<void> {
    const updateData: Partial<SeedingBatch> = { status };
    
    if (stats) {
      Object.assign(updateData, stats);
    }
    
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date().toISOString();
    }
    
    await this.seedingBatches.update(id, updateData);
  }

  async deleteSeedingBatch(id: string): Promise<void> {
    await this.seedingBatches.delete(id);
  }

  async getBatchesByStatus(status: SeedingBatch['status']): Promise<SeedingBatch[]> {
    const batches = await this.seedingBatches
      .where("status")
      .equals(status)
      .toArray();
    
    return batches.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}