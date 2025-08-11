import Dexie, { Table } from "dexie";
import { PersonStorage } from "@/types/people";
import { 
  UserProfile, 
  NatalChartStorage, 
  CacheEntry, 
  SeedUserConfig, 
  SeedingBatch,
  DATABASE_VERSION,
  DATABASE_NAME,
  DATABASE_INDEXES
} from "@/types/database";
import { UserRepository } from "@/repositories/UserRepository";
import { PeopleRepository } from "@/repositories/PeopleRepository";
import { ChartRepository } from "@/repositories/ChartRepository";
import { SeedingRepository } from "@/repositories/SeedingRepository";
import { CacheService } from "@/services/CacheService";
import { SeedDataService } from "@/services/SeedDataService";
import { UserTransformations } from "@/utils/userTransformations";

export class LuckstrologyDatabase extends Dexie {
  userProfiles!: Table<UserProfile>;
  natalCharts!: Table<NatalChartStorage>;
  people!: Table<PersonStorage>;
  cache!: Table<CacheEntry>;
  seedUserConfigs!: Table<SeedUserConfig>;
  seedingBatches!: Table<SeedingBatch>;

  // Repository instances
  public readonly userRepository: UserRepository;
  public readonly peopleRepository: PeopleRepository;
  public readonly chartRepository: ChartRepository;
  public readonly seedingRepository: SeedingRepository;
  public readonly cacheService: CacheService;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores(DATABASE_INDEXES);

    // Initialize repositories
    this.userRepository = new UserRepository(this.userProfiles);
    this.peopleRepository = new PeopleRepository(this.people);
    this.chartRepository = new ChartRepository(this.natalCharts);
    this.seedingRepository = new SeedingRepository(this.seedUserConfigs, this.seedingBatches);
    this.cacheService = new CacheService(this.cache);
  }

  // Cache methods (delegated to CacheService)
  async setCache(
    key: string,
    data: unknown,
    ttlMinutes: number = 60
  ): Promise<void> {
    return this.cacheService.set(key, data, ttlMinutes);
  }

  async getCache<T>(key: string): Promise<T | null> {
    return this.cacheService.get<T>(key);
  }

  async clearExpiredCache(): Promise<void> {
    return this.cacheService.clearExpired();
  }

  // User profile methods (delegated to UserRepository)
  async saveUserProfile(profile: UserProfile): Promise<void> {
    return this.userRepository.save(profile);
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    return this.userRepository.getById(id);
  }

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    return this.userRepository.getCurrent();
  }

  // Utility methods for user transformations (delegated to UserTransformations)
  userProfileToUser(profile: UserProfile): import("../types/user").User {
    return UserTransformations.toUser(profile);
  }

  userToUserProfile(user: import("../types/user").User): UserProfile {
    return UserTransformations.fromUser(user);
  }

  // Chart methods (delegated to ChartRepository)
  async saveChart(chart: NatalChartStorage): Promise<void> {
    return this.chartRepository.save(chart);
  }

  async getUserCharts(userId: string): Promise<NatalChartStorage[]> {
    return this.chartRepository.getByUserId(userId);
  }

  async deleteChart(chartId: string): Promise<void> {
    return this.chartRepository.delete(chartId);
  }

  // People management methods (delegated to PeopleRepository)
  async savePerson(person: PersonStorage): Promise<void> {
    return this.peopleRepository.save(person);
  }

  async getPerson(id: string): Promise<PersonStorage | null> {
    return this.peopleRepository.getById(id);
  }

  async getUserPeople(userId: string): Promise<PersonStorage[]> {
    return this.peopleRepository.getByUserId(userId);
  }

  async getDefaultPerson(userId: string): Promise<PersonStorage | null> {
    return this.peopleRepository.getDefault(userId);
  }

  async setDefaultPerson(userId: string, personId: string): Promise<void> {
    return this.peopleRepository.setDefault(userId, personId);
  }

  async deletePerson(personId: string): Promise<void> {
    return this.peopleRepository.delete(personId);
  }

  // Utility methods for person transformations (delegated to PeopleRepository)
  personStorageToPerson(storage: PersonStorage): import("../types/people").Person {
    return this.peopleRepository.toPerson(storage);
  }

  personToPersonStorage(person: import("../types/people").Person): PersonStorage {
    return this.peopleRepository.fromPerson(person);
  }

  // Seeding methods (delegated to SeedingRepository)
  async saveSeedUserConfig(config: SeedUserConfig): Promise<void> {
    return this.seedingRepository.saveSeedUserConfig(config);
  }

  async getSeedUserConfig(id: string): Promise<SeedUserConfig | null> {
    return this.seedingRepository.getSeedUserConfig(id);
  }

  async getAllSeedUserConfigs(): Promise<SeedUserConfig[]> {
    return this.seedingRepository.getAllActiveSeedUserConfigs();
  }

  async getSeedUserConfigByUserId(userId: string): Promise<SeedUserConfig | null> {
    return this.seedingRepository.getSeedUserConfigByUserId(userId);
  }

  async deleteSeedUserConfig(id: string): Promise<void> {
    return this.seedingRepository.deleteSeedUserConfig(id);
  }

  async saveSeedingBatch(batch: SeedingBatch): Promise<void> {
    return this.seedingRepository.saveSeedingBatch(batch);
  }

  async getSeedingBatch(id: string): Promise<SeedingBatch | null> {
    return this.seedingRepository.getSeedingBatch(id);
  }

  async getAllSeedingBatches(): Promise<SeedingBatch[]> {
    return this.seedingRepository.getAllSeedingBatches();
  }

  async updateSeedingBatchStatus(
    id: string, 
    status: SeedingBatch['status'], 
    stats?: Partial<Pick<SeedingBatch, 'createdDiscussions' | 'createdReplies' | 'createdVotes' | 'errorMessage'>>
  ): Promise<void> {
    return this.seedingRepository.updateSeedingBatchStatus(id, status, stats);
  }

  async deleteSeedingBatch(id: string): Promise<void> {
    return this.seedingRepository.deleteSeedingBatch(id);
  }

  // Utility method to create initial seed users (delegated to SeedDataService)
  async createInitialSeedUsers(): Promise<void> {
    const seedUsers = SeedDataService.generateSeedUsers();
    const seedConfigs = SeedDataService.generateSeedUserConfigs();

    // Create user profiles
    for (const user of seedUsers) {
      await this.saveUserProfile(user);
    }

    // Create seed user configurations
    for (const config of seedConfigs) {
      await this.saveSeedUserConfig(config);
    }
  }

  // Database health and maintenance
  async performMaintenance(): Promise<void> {
    console.log('🔧 [Database] Starting maintenance tasks...');
    
    await this.clearExpiredCache();
    console.log('✅ [Database] Cache cleanup completed');
    
    // Additional maintenance tasks can be added here
    console.log('✅ [Database] Maintenance completed');
  }

  async getDatabaseStats(): Promise<{
    userProfiles: number;
    natalCharts: number;
    people: number;
    cacheEntries: number;
    seedUserConfigs: number;
    seedingBatches: number;
  }> {
    const [userProfiles, natalCharts, people, cacheEntries, seedUserConfigs, seedingBatches] = await Promise.all([
      this.userProfiles.count(),
      this.natalCharts.count(),
      this.people.count(),
      this.cache.count(),
      this.seedUserConfigs.count(),
      this.seedingBatches.count()
    ]);

    return {
      userProfiles,
      natalCharts,
      people,
      cacheEntries,
      seedUserConfigs,
      seedingBatches
    };
  }
}

export const db = new LuckstrologyDatabase();

// Export database instance and all related types
export type { 
  UserProfile, 
  NatalChartStorage, 
  CacheEntry, 
  SeedUserConfig, 
  SeedingBatch 
} from '@/types/database';

export { 
  UserRepository, 
  PeopleRepository, 
  ChartRepository, 
  SeedingRepository 
} from './repositories';

export { 
  CacheService, 
  SeedDataService 
} from './services';

export { UserTransformations } from './utils';

// Re-export for backward compatibility
export {
  DATABASE_VERSION,
  DATABASE_NAME,
  DATABASE_INDEXES
} from '@/types/database';
