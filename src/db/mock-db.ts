/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock database implementation that doesn't require any native modules
// This allows the app to work without database connectivity issues

import * as schema from './schema';

// Mock data storage
const mockData = {
  users: new Map<string, any>(),
  discussions: new Map<string, any>(),
  categories: new Map<string, any>(),
  tags: new Map<string, any>(),
  replies: new Map<string, any>(),
  votes: new Map<string, any>(),
  discussionTags: new Map<string, any>(),
};

// Initialize with seed data
function initializeMockData() {
  // Seed categories
  const categories = [
    { id: 'natal', name: 'Natal Chart Analysis', color: '#6bdbff', description: 'Birth chart interpretation', sortOrder: 1, isActive: true, discussionCount: 0 },
    { id: 'transits', name: 'Transits & Predictions', color: '#f2e356', description: 'Current planetary movements', sortOrder: 2, isActive: true, discussionCount: 0 },
    { id: 'help', name: 'Chart Reading Help', color: '#51bd94', description: 'Get help interpreting your chart', sortOrder: 3, isActive: true, discussionCount: 0 },
    { id: 'synastry', name: 'Synastry & Compatibility', color: '#ff91e9', description: 'Relationship astrology', sortOrder: 4, isActive: true, discussionCount: 0 },
    { id: 'mundane', name: 'Mundane Astrology', color: '#19181a', description: 'World events and astrology', sortOrder: 5, isActive: true, discussionCount: 0 },
    { id: 'learning', name: 'Learning Resources', color: '#6bdbff', description: 'Educational content', sortOrder: 6, isActive: true, discussionCount: 0 },
    { id: 'general', name: 'General Discussion', color: '#51bd94', description: 'Open discussions', sortOrder: 7, isActive: true, discussionCount: 0 }
  ];
  
  categories.forEach(cat => {
    mockData.categories.set(cat.id, { ...cat, createdAt: new Date(), updatedAt: new Date() });
  });

  // Seed tags
  const tags = [
    { id: 'natal-chart', name: 'natal-chart', description: 'Birth chart analysis', usageCount: 50, isPopular: true },
    { id: 'mercury-retrograde', name: 'mercury-retrograde', description: 'Mercury retrograde periods', usageCount: 45, isPopular: true },
    { id: 'relationships', name: 'relationships', description: 'Love and partnership astrology', usageCount: 40, isPopular: true },
    { id: 'mars', name: 'mars', description: 'Mars placements and energy', usageCount: 35, isPopular: true },
    { id: 'synastry', name: 'synastry', description: 'Relationship compatibility', usageCount: 30, isPopular: true },
    { id: 'transits', name: 'transits', description: 'Current planetary movements', usageCount: 28, isPopular: true },
    { id: 'planets', name: 'planets', description: 'Planetary placements', usageCount: 25, isPopular: true },
    { id: 'houses', name: 'houses', description: 'Astrological houses', usageCount: 22, isPopular: true },
    { id: 'aspects', name: 'aspects', description: 'Planetary aspects', usageCount: 20, isPopular: true },
    { id: 'compatibility', name: 'compatibility', description: 'Relationship compatibility', usageCount: 18, isPopular: true },
    { id: 'venus', name: 'venus', description: 'Venus placements', usageCount: 15, isPopular: true },
    { id: 'moon', name: 'moon', description: 'Moon phases and astrology', usageCount: 12, isPopular: true }
  ];
  
  tags.forEach(tag => {
    mockData.tags.set(tag.id, { ...tag, createdAt: new Date(), updatedAt: new Date() });
  });
}

// Initialize on load
initializeMockData();

// Mock database object that mimics Drizzle API
export const db = {
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: async () => {
        const id = data.id || Date.now().toString();
        const record = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
        
        // Determine which table to insert into based on the table reference
        if (table === schema.users) {
          mockData.users.set(id, record);
        } else if (table === schema.discussions) {
          mockData.discussions.set(id, record);
        } else if (table === schema.discussionReplies) {
          mockData.replies.set(id, record);
        } else if (table === schema.votes) {
          mockData.votes.set(id, record);
        } else if (table === schema.categories) {
          mockData.categories.set(id, record);
        } else if (table === schema.tags) {
          mockData.tags.set(id, record);
        } else if (table === schema.discussionTags) {
          // Use composite key for discussion tags
          const key = `${data.discussionId}_${data.tagId}`;
          mockData.discussionTags.set(key, record);
        }
        
        return [record];
      },
      onConflictDoNothing: () => ({
        returning: async () => {
          // For mock, just return empty array on conflict
          return [];
        },
        execute: async () => {},
        then: async (resolve: any) => resolve()
      }),
      execute: async () => {
        const id = data.id || Date.now().toString();
        const record = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
        
        // Store in appropriate collection
        if (table === schema.users) {
          mockData.users.set(id, record);
        } else if (table === schema.discussions) {
          mockData.discussions.set(id, record);
        } else if (table === schema.discussionReplies) {
          mockData.replies.set(id, record);
        } else if (table === schema.votes) {
          mockData.votes.set(id, record);
        } else if (table === schema.categories) {
          mockData.categories.set(id, record);
        } else if (table === schema.tags) {
          mockData.tags.set(id, record);
        } else if (table === schema.discussionTags) {
          // Use composite key for discussion tags
          const key = `${data.discussionId}_${data.tagId}`;
          mockData.discussionTags.set(key, record);
        }
      }
    })
  }),
  
  select: (fields?: any) => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: (n: number) => ({
          execute: async () => [],
          then: async (resolve: any) => resolve([])
        }),
        orderBy: (order: any) => ({
          limit: (n: number) => ({
            offset: (o: number) => ({
              execute: async () => [],
              then: async (resolve: any) => resolve([])
            }),
            execute: async () => [],
            then: async (resolve: any) => resolve([])
          })
        }),
        execute: async () => [],
        then: async (resolve: any) => resolve([])
      }),
      orderBy: (order: any) => ({
        limit: (n: number) => ({
          offset: (o: number) => ({
            execute: async () => {
              // Return data based on table
              if (table === schema.users) {
                return Array.from(mockData.users.values()).slice(o, o + n);
              } else if (table === schema.discussions) {
                return Array.from(mockData.discussions.values()).slice(o, o + n);
              } else if (table === schema.categories) {
                return Array.from(mockData.categories.values()).slice(o, o + n);
              } else if (table === schema.tags) {
                return Array.from(mockData.tags.values()).slice(o, o + n);
              } else if (table === schema.discussionTags) {
                return Array.from(mockData.discussionTags.values()).slice(o, o + n);
              }
              return [];
            },
            then: async (resolve: any) => {
              // Execute the same logic as the execute method above
              let result;
              if (table === schema.users) {
                result = Array.from(mockData.users.values()).slice(o, o + n);
              } else if (table === schema.discussions) {
                result = Array.from(mockData.discussions.values()).slice(o, o + n);
              } else if (table === schema.categories) {
                result = Array.from(mockData.categories.values()).slice(o, o + n);
              } else if (table === schema.tags) {
                result = Array.from(mockData.tags.values()).slice(o, o + n);
              } else if (table === schema.discussionTags) {
                result = Array.from(mockData.discussionTags.values()).slice(o, o + n);
              } else {
                result = [];
              }
              return resolve(result);
            }
          }),
          execute: async () => {
            // Return data based on table
            if (table === schema.users) {
              return Array.from(mockData.users.values()).slice(0, n);
            } else if (table === schema.discussions) {
              return Array.from(mockData.discussions.values()).slice(0, n);
            } else if (table === schema.categories) {
              return Array.from(mockData.categories.values()).slice(0, n);
            } else if (table === schema.tags) {
              return Array.from(mockData.tags.values()).slice(0, n);
            } else if (table === schema.discussionTags) {
              return Array.from(mockData.discussionTags.values()).slice(0, n);
            }
            return [];
          },
          then: async (resolve: any) => {
            // Execute the same logic as the execute method above
            let result;
            if (table === schema.users) {
              result = Array.from(mockData.users.values()).slice(0, n);
            } else if (table === schema.discussions) {
              result = Array.from(mockData.discussions.values()).slice(0, n);
            } else if (table === schema.categories) {
              result = Array.from(mockData.categories.values()).slice(0, n);
            } else if (table === schema.tags) {
              result = Array.from(mockData.tags.values()).slice(0, n);
            } else if (table === schema.discussionTags) {
              result = Array.from(mockData.discussionTags.values()).slice(0, n);
            } else {
              result = [];
            }
            return resolve(result);
          }
        })
      }),
      limit: (n: number) => ({
        execute: async () => {
          // Return data based on table
          if (table === schema.users) {
            return Array.from(mockData.users.values()).slice(0, n);
          } else if (table === schema.discussions) {
            return Array.from(mockData.discussions.values()).slice(0, n);
          } else if (table === schema.categories) {
            return Array.from(mockData.categories.values()).slice(0, n);
          } else if (table === schema.tags) {
            return Array.from(mockData.tags.values()).slice(0, n);
          } else if (table === schema.discussionTags) {
            return Array.from(mockData.discussionTags.values()).slice(0, n);
          }
          return [];
        },
        then: async (resolve: any) => {
          // Execute the same logic as the execute method above
          let result;
          if (table === schema.users) {
            result = Array.from(mockData.users.values()).slice(0, n);
          } else if (table === schema.discussions) {
            result = Array.from(mockData.discussions.values()).slice(0, n);
          } else if (table === schema.categories) {
            result = Array.from(mockData.categories.values()).slice(0, n);
          } else if (table === schema.tags) {
            result = Array.from(mockData.tags.values()).slice(0, n);
          } else if (table === schema.discussionTags) {
            result = Array.from(mockData.discussionTags.values()).slice(0, n);
          } else {
            result = [];
          }
          return resolve(result);
        }
      })
    })
  }),
  
  update: (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => ({
        returning: async () => [],
        execute: async () => {},
        then: async (resolve: any) => resolve()
      })
    })
  }),
  
  delete: (table: any) => ({
    where: (condition: any) => ({
      returning: async () => [],
      execute: async () => {},
      then: async (resolve: any) => resolve()
    })
  })
};

// Export schema
export * from './schema';

// Initialize database function
export async function initializeDatabase() {
  return Promise.resolve();
}

// Close database function
export function closeDatabase() {
  // Nothing to close in mock implementation
}